import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STYLES = [
  { value: '3d_render', label: '3D Render' },
  { value: 'anime', label: 'Anime' },
  { value: 'pixel_art', label: 'Pixel Art' },
  { value: 'realistic', label: 'Realistic' },
  { value: 'cartoon', label: 'Cartoon' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'fantasy', label: 'Fantasy' },
];

const MOODS = [
  { value: 'happy', label: 'Happy & Cheerful' },
  { value: 'serious', label: 'Serious & Professional' },
  { value: 'mysterious', label: 'Mysterious' },
  { value: 'friendly', label: 'Friendly & Approachable' },
  { value: 'fierce', label: 'Fierce & Bold' },
  { value: 'calm', label: 'Calm & Peaceful' },
];

const BACKGROUNDS = [
  { value: 'transparent', label: 'Transparent' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'solid', label: 'Solid Color' },
  { value: 'abstract', label: 'Abstract Pattern' },
  { value: 'environment', label: 'Environmental' },
];

export default function AvatarForm({ onGenerate, isGenerating }) {
  const [formData, setFormData] = useState({
    characterDescription: '',
    style: '',
    mood: '',
    background: 'transparent',
    stylization: [70],
    referenceImage: null,
    additionalNotes: '',
  });
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, referenceImage: file_url });
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const isValid = formData.characterDescription && formData.style && formData.mood;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Character Description */}
      <div className="space-y-2">
        <Label className="text-slate-300">Character Description *</Label>
        <Textarea
          value={formData.characterDescription}
          onChange={(e) => setFormData({ ...formData, characterDescription: e.target.value })}
          placeholder="Describe your character: gender, age, features, clothing, accessories..."
          className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 min-h-[100px]"
        />
      </div>

      {/* Reference Image Upload */}
      <div className="space-y-2">
        <Label className="text-slate-300">Reference Image (optional)</Label>
        <div className="flex gap-3">
          <label className="flex-1 cursor-pointer">
            <div className={`flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-dashed transition-colors ${
              formData.referenceImage 
                ? 'border-purple-500 bg-purple-500/10' 
                : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
            }`}>
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              ) : formData.referenceImage ? (
                <span className="text-sm text-purple-400">Image uploaded ✓</span>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-400">Upload reference</span>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {formData.referenceImage && (
            <img 
              src={formData.referenceImage} 
              alt="Reference" 
              className="w-12 h-12 rounded-xl object-cover"
            />
          )}
        </div>
      </div>

      {/* Style & Mood */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-300">Art Style *</Label>
          <Select
            value={formData.style}
            onValueChange={(value) => setFormData({ ...formData, style: value })}
          >
            <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              {STYLES.map((style) => (
                <SelectItem key={style.value} value={style.value} className="text-white hover:bg-slate-800">
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Mood *</Label>
          <Select
            value={formData.mood}
            onValueChange={(value) => setFormData({ ...formData, mood: value })}
          >
            <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
              <SelectValue placeholder="Select mood" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              {MOODS.map((mood) => (
                <SelectItem key={mood.value} value={mood.value} className="text-white hover:bg-slate-800">
                  {mood.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Background */}
      <div className="space-y-2">
        <Label className="text-slate-300">Background</Label>
        <Select
          value={formData.background}
          onValueChange={(value) => setFormData({ ...formData, background: value })}
        >
          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            {BACKGROUNDS.map((bg) => (
              <SelectItem key={bg.value} value={bg.value} className="text-white hover:bg-slate-800">
                {bg.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stylization Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-slate-300">Stylization</Label>
          <span className="text-xs text-slate-500">
            {formData.stylization[0] < 33 ? 'Subtle' : formData.stylization[0] < 66 ? 'Balanced' : 'Stylized'}
          </span>
        </div>
        <Slider
          value={formData.stylization}
          onValueChange={(value) => setFormData({ ...formData, stylization: value })}
          max={100}
          step={1}
          className="py-2"
        />
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label className="text-slate-300">Additional Notes</Label>
        <Textarea
          value={formData.additionalNotes}
          onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
          placeholder="Specific colors, accessories, pose, expression..."
          className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 min-h-[60px]"
        />
      </div>

      {/* Generate Button */}
      <Button
        type="submit"
        disabled={!isValid || isGenerating}
        className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold rounded-xl disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Generate 4 Variations
          </>
        )}
      </Button>

      <p className="text-center text-xs text-slate-500">
        Uses 4 credits per generation
      </p>
    </form>
  );
}