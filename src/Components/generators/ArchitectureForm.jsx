import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Loader2, Home, Layout, Palette, Eye, Lightbulb, Armchair } from 'lucide-react';

const ROOM_TYPES = [
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'living_room', label: 'Living Room' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'home_office', label: 'Home Office' },
  { value: 'dining_room', label: 'Dining Room' },
];

const DESIGN_STYLES = [
  { value: 'modern', label: 'Modern' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'scandinavian', label: 'Scandinavian' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'bohemian', label: 'Bohemian' },
  { value: 'contemporary', label: 'Contemporary' },
  { value: 'rustic', label: 'Rustic' },
];

const FURNITURE_OPTIONS = {
  bedroom: ['centered_bed', 'side_nightstands', 'wardrobe', 'dresser', 'reading_chair', 'desk'],
  living_room: ['sofa_arrangement', 'coffee_table', 'entertainment_center', 'accent_chairs', 'bookshelf'],
  kitchen: ['island', 'dining_table', 'bar_stools', 'pantry', 'peninsula'],
  bathroom: ['double_vanity', 'freestanding_tub', 'walk_in_shower', 'storage_cabinet'],
  home_office: ['L_shaped_desk', 'ergonomic_chair', 'bookshelf', 'filing_cabinet', 'reading_nook'],
  dining_room: ['dining_table', 'buffet', 'china_cabinet', 'sideboard'],
};

const SPECIAL_FEATURES_OPTIONS = [
  'fireplace', 'built_in_shelving', 'accent_wall', 'indoor_plants', 
  'crown_molding', 'exposed_beams', 'statement_lighting', 'area_rug'
];

export default function ArchitectureForm({ onGenerate, isGenerating }) {
  const [formData, setFormData] = useState({
    roomType: 'bedroom',
    roomSize: 'medium',
    designStyle: 'modern',
    colorPalette: 'neutral',
    lighting: 'natural_light',
    windowConfig: 'single_window',
    viewAngle: 'corner_view',
    furniturePlacement: [],
    specialFeatures: [],
    additionalNotes: '',
  });

  const toggleFurniture = (item) => {
    setFormData(prev => ({
      ...prev,
      furniturePlacement: prev.furniturePlacement.includes(item)
        ? prev.furniturePlacement.filter(f => f !== item)
        : [...prev.furniturePlacement, item]
    }));
  };

  const toggleFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      specialFeatures: prev.specialFeatures.includes(feature)
        ? prev.specialFeatures.filter(f => f !== feature)
        : [...prev.specialFeatures, feature]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Room Type */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          <Layout className="w-4 h-4 inline mr-2" />
          Room Type *
        </Label>
        <Select
          value={formData.roomType}
          onValueChange={(value) => setFormData(prev => ({ ...prev, roomType: value, furniturePlacement: [] }))}
        >
          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            {ROOM_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value} className="text-white hover:bg-slate-800">
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Room Size */}
      <div className="space-y-2">
        <Label className="text-slate-300">Room Size *</Label>
        <Select
          value={formData.roomSize}
          onValueChange={(value) => setFormData(prev => ({ ...prev, roomSize: value }))}
        >
          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            <SelectItem value="small" className="text-white">Small (10x10 ft)</SelectItem>
            <SelectItem value="medium" className="text-white">Medium (15x15 ft)</SelectItem>
            <SelectItem value="large" className="text-white">Large (20x20 ft)</SelectItem>
            <SelectItem value="extra_large" className="text-white">Extra Large (25x25+ ft)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Design Style */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          <Palette className="w-4 h-4 inline mr-2" />
          Design Style *
        </Label>
        <Select
          value={formData.designStyle}
          onValueChange={(value) => setFormData(prev => ({ ...prev, designStyle: value }))}
        >
          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            {DESIGN_STYLES.map(style => (
              <SelectItem key={style.value} value={style.value} className="text-white hover:bg-slate-800">
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Furniture Placement */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          <Armchair className="w-4 h-4 inline mr-2" />
          Furniture Placement
        </Label>
        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
          {FURNITURE_OPTIONS[formData.roomType]?.map(item => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox
                id={item}
                checked={formData.furniturePlacement.includes(item)}
                onCheckedChange={() => toggleFurniture(item)}
              />
              <label
                htmlFor={item}
                className="text-sm text-slate-300 cursor-pointer"
              >
                {item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Window Configuration */}
      <div className="space-y-2">
        <Label className="text-slate-300">Window Configuration</Label>
        <Select
          value={formData.windowConfig}
          onValueChange={(value) => setFormData(prev => ({ ...prev, windowConfig: value }))}
        >
          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            <SelectItem value="no_windows" className="text-white">No Windows</SelectItem>
            <SelectItem value="single_window" className="text-white">Single Window</SelectItem>
            <SelectItem value="multiple_windows" className="text-white">Multiple Windows</SelectItem>
            <SelectItem value="floor_to_ceiling" className="text-white">Floor-to-Ceiling Windows</SelectItem>
            <SelectItem value="bay_window" className="text-white">Bay Window</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lighting */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          <Lightbulb className="w-4 h-4 inline mr-2" />
          Lighting Preference
        </Label>
        <Select
          value={formData.lighting}
          onValueChange={(value) => setFormData(prev => ({ ...prev, lighting: value }))}
        >
          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            <SelectItem value="natural_light" className="text-white">Natural Light Dominant</SelectItem>
            <SelectItem value="ambient" className="text-white">Soft Ambient Lighting</SelectItem>
            <SelectItem value="task_lighting" className="text-white">Task Lighting</SelectItem>
            <SelectItem value="dramatic" className="text-white">Dramatic/Moody Lighting</SelectItem>
            <SelectItem value="layered" className="text-white">Layered Lighting</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Color Palette */}
      <div className="space-y-2">
        <Label className="text-slate-300">Color Palette</Label>
        <Select
          value={formData.colorPalette}
          onValueChange={(value) => setFormData(prev => ({ ...prev, colorPalette: value }))}
        >
          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            <SelectItem value="neutral" className="text-white">Neutral (White, Beige, Gray)</SelectItem>
            <SelectItem value="warm" className="text-white">Warm (Earth Tones, Browns)</SelectItem>
            <SelectItem value="cool" className="text-white">Cool (Blues, Greens)</SelectItem>
            <SelectItem value="bold" className="text-white">Bold (Vibrant Colors)</SelectItem>
            <SelectItem value="monochromatic" className="text-white">Monochromatic</SelectItem>
            <SelectItem value="pastel" className="text-white">Pastel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* View Angle */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          <Eye className="w-4 h-4 inline mr-2" />
          View Angle
        </Label>
        <Select
          value={formData.viewAngle}
          onValueChange={(value) => setFormData(prev => ({ ...prev, viewAngle: value }))}
        >
          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            <SelectItem value="corner_view" className="text-white">Corner View (3D)</SelectItem>
            <SelectItem value="front_view" className="text-white">Front View</SelectItem>
            <SelectItem value="birds_eye" className="text-white">Bird's Eye / Floor Plan</SelectItem>
            <SelectItem value="eye_level" className="text-white">Eye Level Perspective</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Special Features */}
      <div className="space-y-2">
        <Label className="text-slate-300">Special Features</Label>
        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
          {SPECIAL_FEATURES_OPTIONS.map(feature => (
            <div key={feature} className="flex items-center space-x-2">
              <Checkbox
                id={feature}
                checked={formData.specialFeatures.includes(feature)}
                onCheckedChange={() => toggleFeature(feature)}
              />
              <label
                htmlFor={feature}
                className="text-sm text-slate-300 cursor-pointer"
              >
                {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label className="text-slate-300">Additional Details (Optional)</Label>
        <Textarea
          value={formData.additionalNotes}
          onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
          placeholder="E.g., specific materials, textures, or design preferences..."
          className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 min-h-[80px]"
        />
      </div>

      {/* Generate Button */}
      <Button
        type="submit"
        disabled={isGenerating}
        className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold rounded-xl disabled:opacity-50"
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

