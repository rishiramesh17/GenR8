import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from 'lucide-react';

const INDUSTRIES = [
  { value: 'tech', label: 'Technology' },
  { value: 'finance', label: 'Finance' },
  { value: 'health', label: 'Healthcare' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'education', label: 'Education' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'sports', label: 'Sports' },
  { value: 'other', label: 'Other' },
];

const STYLES = [
  { value: 'minimal', label: 'Minimal & Clean' },
  { value: 'bold', label: 'Bold & Modern' },
  { value: 'elegant', label: 'Elegant & Luxury' },
  { value: 'playful', label: 'Playful & Fun' },
  { value: 'geometric', label: 'Geometric' },
  { value: 'vintage', label: 'Vintage & Retro' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'mascot', label: 'Mascot / Character' },
];

const COLOR_PRESETS = [
  { name: 'Ocean', colors: ['#0EA5E9', '#06B6D4', '#14B8A6'] },
  { name: 'Sunset', colors: ['#F97316', '#EF4444', '#EC4899'] },
  { name: 'Forest', colors: ['#22C55E', '#10B981', '#14B8A6'] },
  { name: 'Royal', colors: ['#8B5CF6', '#A855F7', '#D946EF'] },
  { name: 'Monochrome', colors: ['#1F2937', '#4B5563', '#9CA3AF'] },
  { name: 'Gold', colors: ['#F59E0B', '#D97706', '#B45309'] },
];

export default function LogoForm({ onGenerate, isGenerating }) {
  const [formData, setFormData] = useState({
    brandName: '',
    tagline: '',
    industry: '',
    style: '',
    colorPreset: null,
    complexity: [50],
    additionalNotes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const isValid = formData.brandName && formData.industry && formData.style;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Brand Name */}
      <div className="space-y-2">
        <Label className="text-slate-300">Brand Name *</Label>
        <Input
          value={formData.brandName}
          onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
          placeholder="e.g., Nexus AI"
          className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
        />
      </div>

      {/* Tagline */}
      <div className="space-y-2">
        <Label className="text-slate-300">Tagline (optional)</Label>
        <Input
          value={formData.tagline}
          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          placeholder="e.g., Intelligence Reimagined"
          className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
        />
      </div>

      {/* Industry & Style */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-300">Industry *</Label>
          <Select
            value={formData.industry}
            onValueChange={(value) => setFormData({ ...formData, industry: value })}
          >
            <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              {INDUSTRIES.map((ind) => (
                <SelectItem key={ind.value} value={ind.value} className="text-white hover:bg-slate-800">
                  {ind.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Style *</Label>
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
      </div>

      {/* Color Presets */}
      <div className="space-y-3">
        <Label className="text-slate-300">Color Palette</Label>
        <div className="grid grid-cols-3 gap-3">
          {COLOR_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setFormData({ ...formData, colorPreset: preset })}
              className={`p-3 rounded-xl border transition-all ${
                formData.colorPreset?.name === preset.name
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
              }`}
            >
              <div className="flex gap-1 mb-2">
                {preset.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Complexity Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-slate-300">Complexity</Label>
          <span className="text-xs text-slate-500">
            {formData.complexity[0] < 33 ? 'Simple' : formData.complexity[0] < 66 ? 'Balanced' : 'Detailed'}
          </span>
        </div>
        <Slider
          value={formData.complexity}
          onValueChange={(value) => setFormData({ ...formData, complexity: value })}
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
          placeholder="Any specific elements, symbols, or concepts you'd like to include..."
          className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 min-h-[80px]"
        />
      </div>

      {/* Generate Button */}
      <Button
        type="submit"
        disabled={!isValid || isGenerating}
        className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-xl disabled:opacity-50"
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