import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, 
  FolderOpen, 
  Plus, 
  Search, 
  Grid3X3, 
  List,
  MoreVertical,
  Trash2,
  Pencil,
  Heart,
  Download,
  Filter,
  Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreditBadge from '@/components/ui/CreditBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ExportModal from '@/components/generators/ExportModal';

export default function Projects() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterType, setFilterType] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [exportImage, setExportImage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      
      const userProjects = await base44.entities.Project.filter(
        { created_by: userData.email },
        '-created_date'
      );
      setProjects(userProjects);
      
      // Load all assets if no project selected
      const allAssets = await base44.entities.GeneratedAsset.filter(
        { created_by: userData.email },
        '-created_date'
      );
      setAssets(allAssets);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const loadProjectAssets = async (projectId) => {
    const projectAssets = await base44.entities.GeneratedAsset.filter(
      { project_id: projectId },
      '-created_date'
    );
    setAssets(projectAssets);
    setSelectedProject(projects.find(p => p.id === projectId));
  };

  const handleCreateProject = async () => {
    if (!newProject.name) return;
    
    const created = await base44.entities.Project.create(newProject);
    setProjects(prev => [created, ...prev]);
    setShowCreateDialog(false);
    setNewProject({ name: '', description: '' });
  };

  const handleDeleteProject = async (projectId) => {
    await base44.entities.Project.delete(projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
      loadData();
    }
  };

  const handleToggleFavorite = async (asset) => {
    await base44.entities.GeneratedAsset.update(asset.id, {
      is_favorite: !asset.is_favorite,
    });
    setAssets(prev => 
      prev.map(a => a.id === asset.id ? { ...a, is_favorite: !a.is_favorite } : a)
    );
  };

  const handleDeleteAsset = async (assetId) => {
    await base44.entities.GeneratedAsset.delete(assetId);
    setAssets(prev => prev.filter(a => a.id !== assetId));
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.prompt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                          filterType === 'favorites' && asset.is_favorite ||
                          asset.generator_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getGeneratorBadge = (type) => {
    const badges = {
      logo: { label: 'Logo', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
      avatar: { label: 'Avatar', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      architecture: { label: 'Architecture', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
      product: { label: 'Product', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    };
    return badges[type] || { label: type, color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">
                    {selectedProject ? selectedProject.name : 'My Projects'}
                  </h1>
                  <p className="text-xs text-slate-500">
                    {selectedProject ? `${filteredAssets.length} assets` : `${projects.length} projects`}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="bg-cyan-600 hover:bg-cyan-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
              <CreditBadge credits={user?.credits ?? 100} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Projects List */}
          <div className="w-64 flex-shrink-0">
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedProject(null);
                  loadData();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  !selectedProject 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="text-sm font-medium">All Assets</span>
              </button>
              
              <button
                onClick={() => {
                  setSelectedProject(null);
                  setFilterType('favorites');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  filterType === 'favorites' && !selectedProject
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">Favorites</span>
              </button>

              <div className="h-px bg-slate-800 my-4" />

              <p className="px-4 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                Projects
              </p>

              {projects.map(project => (
                <div
                  key={project.id}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                    selectedProject?.id === project.id 
                      ? 'bg-slate-800 text-white' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                  onClick={() => loadProjectAssets(project.id)}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-700 overflow-hidden flex-shrink-0">
                    {project.cover_image ? (
                      <img src={project.cover_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FolderOpen className="w-4 h-4 text-slate-500" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium flex-1 truncate">{project.name}</span>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-slate-400"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-900 border-slate-700">
                      <DropdownMenuItem 
                        className="text-red-400 focus:text-red-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}

              {projects.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-slate-500">
                  No projects yet
                </p>
              )}
            </div>
          </div>

          {/* Main Content - Assets Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by prompt..."
                  className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40 bg-slate-900 border-slate-700 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="all" className="text-white">All Types</SelectItem>
                  <SelectItem value="logo" className="text-white">Logos</SelectItem>
                  <SelectItem value="avatar" className="text-white">Avatars</SelectItem>
                  <SelectItem value="favorites" className="text-white">Favorites</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border border-slate-700 rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-none ${viewMode === 'grid' ? 'bg-slate-800' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-none ${viewMode === 'list' ? 'bg-slate-800' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Assets Grid */}
            {filteredAssets.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                : 'space-y-3'
              }>
                <AnimatePresence mode="popLayout">
                  {filteredAssets.map((asset, idx) => (
                    <motion.div
                      key={asset.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03 }}
                      className={viewMode === 'grid'
                        ? 'group relative aspect-square rounded-xl overflow-hidden bg-slate-800'
                        : 'group flex items-center gap-4 p-3 rounded-xl bg-slate-900/50 border border-slate-800'
                      }
                    >
                      {viewMode === 'grid' ? (
                        <>
                          <img
                            src={asset.image_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Badge */}
                          <div className="absolute top-2 left-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getGeneratorBadge(asset.generator_type).color}`}>
                              {getGeneratorBadge(asset.generator_type).label}
                            </span>
                          </div>

                          {/* Favorite */}
                          {asset.is_favorite && (
                            <div className="absolute top-2 right-2">
                              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                            </div>
                          )}

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white"
                                onClick={() => handleToggleFavorite(asset)}
                              >
                                <Heart className={`w-4 h-4 ${asset.is_favorite ? 'fill-red-500 text-red-500' : ''}`} />
                              </Button>
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 bg-cyan-500/80 hover:bg-cyan-500 text-white"
                                  onClick={() => setExportImage(asset)}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 bg-white/10 hover:bg-red-500/80 text-white"
                                  onClick={() => handleDeleteAsset(asset.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={asset.image_url} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border mb-1 ${getGeneratorBadge(asset.generator_type).color}`}>
                              {getGeneratorBadge(asset.generator_type).label}
                            </span>
                            <p className="text-sm text-slate-300 line-clamp-1">{asset.prompt}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-slate-400 hover:text-white"
                              onClick={() => handleToggleFavorite(asset)}
                            >
                              <Heart className={`w-4 h-4 ${asset.is_favorite ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-slate-400 hover:text-cyan-400"
                              onClick={() => setExportImage(asset)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-slate-400 hover:text-red-400"
                              onClick={() => handleDeleteAsset(asset.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                  <Sparkles className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No assets yet</h3>
                <p className="text-slate-500 text-sm mb-6">
                  Start generating to build your asset library
                </p>
                <Link to={createPageUrl('Home')}>
                  <Button className="bg-cyan-600 hover:bg-cyan-500">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Creating
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Project Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Project</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Project Name</Label>
              <Input
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="My Awesome Project"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Description (optional)</Label>
              <Textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="What's this project about?"
                className="bg-slate-800 border-slate-700 text-white min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowCreateDialog(false)} className="text-slate-400">
              Cancel
            </Button>
            <Button 
              onClick={handleCreateProject}
              disabled={!newProject.name}
              className="bg-cyan-600 hover:bg-cyan-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <ExportModal
        image={exportImage}
        isOpen={!!exportImage}
        onClose={() => setExportImage(null)}
      />
    </div>
  );
}