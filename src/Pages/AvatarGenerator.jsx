import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, User, Save, FolderPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CreditBadge from '@/components/ui/CreditBadge';
import AvatarForm from '@/components/generators/AvatarForm';
import GenerationGallery from '@/components/generators/GenerationGallery';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AvatarGenerator() {
  const [user, setUser] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [lastFormData, setLastFormData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        const userProjects = await base44.entities.Project.filter(
          { created_by: userData.email },
          '-created_date'
        );
        setProjects(userProjects);
      } catch (e) {
        console.error(e);
      }
    };
    loadData();
  }, []);

  const buildPrompt = (formData) => {
    const style = formData.style.replace(/_/g, ' ');
    const mood = formData.mood.replace(/_/g, ' ');
    const background = formData.background.replace(/_/g, ' ');
    const stylization = formData.stylization[0] < 33 ? 'subtle stylization' : 
                        formData.stylization[0] < 66 ? 'balanced stylization' : 'highly stylized';
    
    let prompt = `Avatar portrait: ${formData.characterDescription}. ${style} art style, ${mood} mood and expression. ${background} background. ${stylization}.`;
    
    if (formData.additionalNotes) {
      prompt += ` Additional details: ${formData.additionalNotes}.`;
    }
    
    prompt += ' High quality, professional avatar, centered composition, suitable for profile picture.';
    
    return prompt;
  };

  const handleGenerate = async (formData) => {
    setIsGenerating(true);
    setLastFormData(formData);
    const prompt = buildPrompt(formData);
    
    try {
      const generateOptions = {
        prompt,
        existing_image_urls: formData.referenceImage ? [formData.referenceImage] : undefined,
      };
      
      // Generate 4 images
      const generatePromises = Array(4).fill(null).map(() => 
        base44.integrations.Core.GenerateImage(generateOptions)
      );
      
      const results = await Promise.all(generatePromises);
      
      const newImages = results.map((result, idx) => ({
        id: `temp-${Date.now()}-${idx}`,
        image_url: result.url,
        prompt,
        settings: formData,
        is_favorite: false,
        generator_type: 'avatar',
      }));
      
      setGeneratedImages(newImages);
      
      // Update user credits
      if (user) {
        await base44.auth.updateMe({
          credits: Math.max(0, (user.credits ?? 100) - 4),
          total_generations: (user.total_generations ?? 0) + 4,
        });
        setUser(prev => ({
          ...prev,
          credits: Math.max(0, (prev.credits ?? 100) - 4),
        }));
      }
    } catch (error) {
      console.error('Generation failed:', error);
    }
    
    setIsGenerating(false);
  };

  const handleVariation = async (image) => {
    setIsGenerating(true);
    
    try {
      const result = await base44.integrations.Core.GenerateImage({
        prompt: image.prompt + ' Variation with slight changes in pose or expression.',
      });
      
      const newImage = {
        id: `temp-${Date.now()}`,
        image_url: result.url,
        prompt: image.prompt,
        settings: image.settings,
        is_favorite: false,
        generator_type: 'avatar',
      };
      
      setGeneratedImages(prev => [newImage, ...prev.slice(0, 3)]);
      
      if (user) {
        await base44.auth.updateMe({
          credits: Math.max(0, (user.credits ?? 100) - 1),
          total_generations: (user.total_generations ?? 0) + 1,
        });
        setUser(prev => ({
          ...prev,
          credits: Math.max(0, (prev.credits ?? 100) - 1),
        }));
      }
    } catch (error) {
      console.error('Variation failed:', error);
    }
    
    setIsGenerating(false);
  };

  const handleFavorite = (image) => {
    setGeneratedImages(prev => 
      prev.map(img => 
        img.id === image.id ? { ...img, is_favorite: !img.is_favorite } : img
      )
    );
  };

  const handleRegenerate = () => {
    if (lastFormData) {
      handleGenerate(lastFormData);
    }
  };

  const handleSaveToProject = async () => {
    let projectId = selectedProject;
    
    if (selectedProject === 'new' && newProjectName) {
      const newProject = await base44.entities.Project.create({
        name: newProjectName,
        cover_image: generatedImages[0]?.image_url,
      });
      projectId = newProject.id;
      setProjects(prev => [newProject, ...prev]);
    }
    
    if (!projectId || projectId === 'new') return;
    
    const savePromises = generatedImages.map(img => 
      base44.entities.GeneratedAsset.create({
        ...img,
        project_id: projectId,
        id: undefined,
      })
    );
    
    await Promise.all(savePromises);
    setShowSaveDialog(false);
    setSelectedProject('');
    setNewProjectName('');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('Home')}>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">Avatar Creator</h1>
                  <p className="text-xs text-slate-500">Design unique characters & avatars</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {generatedImages.length > 0 && (
                <Button 
                  variant="outline" 
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  onClick={() => setShowSaveDialog(true)}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save to Project
                </Button>
              )}
              <CreditBadge credits={user?.credits ?? 100} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-6">Character Settings</h2>
            <AvatarForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          </motion.div>

          {/* Gallery Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-6">Generated Avatars</h2>
            <GenerationGallery
              images={generatedImages}
              onRegenerate={handleRegenerate}
              onVariation={handleVariation}
              onFavorite={handleFavorite}
              isGenerating={isGenerating}
            />
          </motion.div>
        </div>
      </div>

      {/* Save to Project Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Save to Project</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Select Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Choose a project" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="new" className="text-white hover:bg-slate-800">
                    <div className="flex items-center gap-2">
                      <FolderPlus className="w-4 h-4" />
                      Create New Project
                    </div>
                  </SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id} className="text-white hover:bg-slate-800">
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProject === 'new' && (
              <div className="space-y-2">
                <Label className="text-slate-300">Project Name</Label>
                <Input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="My Avatar Project"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowSaveDialog(false)} className="text-slate-400">
              Cancel
            </Button>
            <Button 
              onClick={handleSaveToProject}
              disabled={!selectedProject || (selectedProject === 'new' && !newProjectName)}
              className="bg-purple-600 hover:bg-purple-500"
            >
              <Save className="w-4 h-4 mr-2" />
              Save {generatedImages.length} Images
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}