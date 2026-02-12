import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Loader2, Heart, Users, Paintbrush } from 'lucide-react';

const TATTOO_STYLES = [
  { value: 'traditional', label: 'Traditional/Old School', desc: 'Bold lines, classic colors' },
  { value: 'japanese', label: 'Japanese (Irezumi)', desc: 'Dragons, koi, waves, flowers' },
  { value: 'realistic', label: 'Realistic/Portrait', desc: 'Photorealistic details' },
  { value: 'geometric', label: 'Geometric/Sacred', desc: 'Patterns, mandalas, shapes' },
  { value: 'watercolor', label: 'Watercolor', desc: 'Soft, artistic, colorful' },
  { value: 'minimalist', label: 'Minimalist Line Art', desc: 'Simple, clean lines' },
  { value: 'tribal', label: 'Tribal/Polynesian', desc: 'Bold black patterns' },
  { value: 'neo_traditional', label: 'Neo-Traditional', desc: 'Modern twist on classic' },
  { value: 'blackwork', label: 'Blackwork/Dotwork', desc: 'Solid black, stippling' },
  { value: 'new_school', label: 'New School', desc: 'Cartoonish, exaggerated' },
];

const BODY_PLACEMENTS = [
  { value: 'forearm', label: '💪 Forearm', size: 'Medium', visibility: 'High' },
  { value: 'upper_arm', label: '💪 Upper Arm/Bicep', size: 'Medium-Large', visibility: 'Medium' },
  { value: 'shoulder', label: '🏋️ Shoulder', size: 'Medium', visibility: 'Medium' },
  { value: 'chest', label: '🫀 Chest', size: 'Large', visibility: 'Low' },
  { value: 'back', label: '🔙 Back/Spine', size: 'Large', visibility: 'Low' },
  { value: 'leg', label: '🦵 Thigh/Calf', size: 'Large', visibility: 'Medium' },
  { value: 'ankle', label: '👟 Ankle', size: 'Small', visibility: 'Medium' },
  { value: 'wrist', label: '⌚ Wrist', size: 'Small', visibility: 'High' },
  { value: 'neck', label: '🦒 Neck', size: 'Small-Medium', visibility: 'Very High' },
  { value: 'ribcage', label: '🫁 Ribcage/Side', size: 'Large', visibility: 'Low' },
  { value: 'hand', label: '✋ Hand/Fingers', size: 'Small', visibility: 'Very High' },
  { value: 'full_sleeve', label: '👔 Full Sleeve', size: 'Extra Large', visibility: 'High' },
];

const DESIGN_SUBJECTS = [
  { category: 'Animals', items: ['Dragon', 'Lion', 'Wolf', 'Eagle', 'Snake', 'Tiger', 'Koi Fish', 'Owl', 'Bear', 'Phoenix'] },
  { category: 'Nature', items: ['Rose', 'Lotus', 'Cherry Blossom', 'Tree', 'Mountains', 'Ocean Waves', 'Sun/Moon', 'Forest', 'Leaves'] },
  { category: 'Symbols', items: ['Skull', 'Cross', 'Anchor', 'Compass', 'Arrow', 'Crown', 'Heart', 'Eye', 'Clock', 'Feather'] },
  { category: 'Abstract', items: ['Mandala', 'Geometric Patterns', 'Sacred Geometry', 'Tribal Patterns', 'Celtic Knots', 'Abstract Art'] },
  { category: 'Cultural', items: ['Japanese Wave', 'Polynesian Patterns', 'Norse Runes', 'Egyptian Symbols', 'Aztec Designs', 'Maori Patterns'] },
];

const COLOR_SCHEMES = [
  { value: 'black_and_gray', label: 'Black & Gray', desc: 'Classic, timeless' },
  { value: 'full_color', label: 'Full Color', desc: 'Vibrant, bold' },
  { value: 'limited_palette', label: 'Limited Palette', desc: '2-3 accent colors' },
  { value: 'black_only', label: 'Solid Black', desc: 'Blackwork style' },
  { value: 'red_accent', label: 'Black with Red Accent', desc: 'Traditional style' },
  { value: 'blue_tones', label: 'Blue Tones', desc: 'Ocean, water themes' },
];

export default function TattooForm({ onGenerate, isGenerating }) {
  const [formData, setFormData] = useState({
    tattooStyle: 'traditional',
    designSubject: '',
    bodyPlacement: 'forearm',
    size: [2], // Using array for slider
    colorScheme: 'black_and_gray',
    detailLevel: [1], // Using array for slider
    designMode: 'single',
    gender: 'neutral',
    coverUpMode: false,
    additionalElements: '',
  });

  const [inspirationPrompts] = useState([
    "Japanese dragon with cherry blossoms and waves",
    "Geometric mandala with sacred geometry patterns",
    "Realistic portrait of a lion with a crown",
    "Minimalist mountain range with pine trees",
    "Traditional rose with thorns and banner",
    "Watercolor phoenix rising from ashes",
  ]);

  const useInspirationPrompt = (prompt) => {
    setFormData(prev => ({ ...prev, designSubject: prompt }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const isValid = formData.designSubject.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Inspiration Prompts */}
      <div className="bg-gradient-to-br from-rose-900/20 to-purple-900/20 border border-rose-800/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-slate-300">Need Inspiration?</span>
        </div>
        <div className="space-y-2">
          {inspirationPrompts.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => useInspirationPrompt(prompt)}
              className="w-full text-left text-xs text-slate-400 hover:text-rose-300 transition-colors p-2 rounded bg-slate-800/50 hover:bg-slate-800 border border-slate-700"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Design Mode */}
      <div className="space-y-2">
        <Label className="text-slate-300">Design Mode</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, designMode: 'single' }))}
            className={`p-3 rounded-lg border-2 transition-all ${
              formData.designMode === 'single'
                ? 'border-rose-500 bg-rose-900/30'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }`}
          >
            <Heart className={`w-5 h-5 mx-auto mb-1 ${formData.designMode === 'single' ? 'text-rose-400' : 'text-slate-400'}`} />
            <div className={`text-xs ${formData.designMode === 'single' ? 'text-rose-300' : 'text-slate-400'}`}>
              Single Design
            </div>
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, designMode: 'matching' }))}
            className={`p-3 rounded-lg border-2 transition-all ${
              formData.designMode === 'matching'
                ? 'border-rose-500 bg-rose-900/30'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }`}
          >
            <Users className={`w-5 h-5 mx-auto mb-1 ${formData.designMode === 'matching' ? 'text-rose-400' : 'text-slate-400'}`} />
            <div className={`text-xs ${formData.designMode === 'matching' ? 'text-rose-300' : 'text-slate-400'}`}>
              Matching/Couple
            </div>
          </button>
        </div>
      </div>

      {/* Tattoo Style */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          <Paintbrush className="w-4 h-4 inline mr-2" />
          Tattoo Style
        </Label>
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2 bg-slate-900/50 rounded-lg border border-slate-700">
          {TATTOO_STYLES.map(style => (
            <button
              key={style.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, tattooStyle: style.value }))}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                formData.tattooStyle === style.value
                  ? 'border-rose-500 bg-rose-900/30'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div className={`font-medium text-sm ${formData.tattooStyle === style.value ? 'text-rose-300' : 'text-white'}`}>
                {style.label}
              </div>
              <div className="text-xs text-slate-400 mt-1">{style.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Design Subject */}
      <div className="space-y-2">
        <Label className="text-slate-300">Design Description *</Label>
        <Textarea
          value={formData.designSubject}
          onChange={(e) => setFormData(prev => ({ ...prev, designSubject: e.target.value }))}
          placeholder="Describe your tattoo idea... e.g., 'A fierce wolf howling at the moon with forest silhouette in background'"
          rows={4}
          className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-rose-500 min-h-[100px]"
        />
        
        {/* Quick Subject Buttons */}
        <div className="mt-3 space-y-2">
          {DESIGN_SUBJECTS.map(category => (
            <div key={category.category}>
              <div className="text-xs text-slate-500 mb-1">{category.category}:</div>
              <div className="flex flex-wrap gap-1">
                {category.items.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      designSubject: prev.designSubject ? `${prev.designSubject}, ${item}` : item 
                    }))}
                    className="text-xs px-2 py-1 bg-slate-800 hover:bg-rose-900/30 text-slate-400 hover:text-rose-300 rounded border border-slate-700 hover:border-rose-600 transition-all"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Body Placement */}
      <div className="space-y-2">
        <Label className="text-slate-300">Body Placement</Label>
        <Select
          value={formData.bodyPlacement}
          onValueChange={(value) => setFormData(prev => ({ ...prev, bodyPlacement: value }))}
        >
          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            {BODY_PLACEMENTS.map(placement => (
              <SelectItem key={placement.value} value={placement.value} className="text-white hover:bg-slate-800">
                {placement.label} - {placement.size} ({placement.visibility} visibility)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-slate-500">
          Placement affects recommended size and design orientation
        </p>
      </div>

      {/* Size */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-slate-300">Tattoo Size</Label>
          <span className="text-xs text-slate-500">
            {formData.size[0] === 1 ? 'Small' : formData.size[0] === 2 ? 'Medium' : 'Large'}
          </span>
        </div>
        <Slider
          value={formData.size}
          onValueChange={(value) => setFormData(prev => ({ ...prev, size: value }))}
          min={1}
          max={3}
          step={1}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>Small</span>
          <span>Medium</span>
          <span>Large</span>
        </div>
      </div>

      {/* Color Scheme */}
      <div className="space-y-2">
        <Label className="text-slate-300">Color Scheme</Label>
        <div className="grid grid-cols-2 gap-2">
          {COLOR_SCHEMES.map(scheme => (
            <button
              key={scheme.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, colorScheme: scheme.value }))}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                formData.colorScheme === scheme.value
                  ? 'border-rose-500 bg-rose-900/30'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div className={`font-medium text-sm ${formData.colorScheme === scheme.value ? 'text-rose-300' : 'text-white'}`}>
                {scheme.label}
              </div>
              <div className="text-xs text-slate-400 mt-1">{scheme.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Level */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-slate-300">Detail Level</Label>
          <span className="text-xs text-slate-500">
            {formData.detailLevel[0] === 0 ? 'Simple' : formData.detailLevel[0] === 1 ? 'Moderate' : 'Intricate'}
          </span>
        </div>
        <Slider
          value={formData.detailLevel}
          onValueChange={(value) => setFormData(prev => ({ ...prev, detailLevel: value }))}
          min={0}
          max={2}
          step={1}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>Simple</span>
          <span>Moderate</span>
          <span>Intricate</span>
        </div>
      </div>

      {/* Gender for Placement Visual */}
      <div className="space-y-2">
        <Label className="text-slate-300">Body Type for Placement Preview</Label>
        <div className="grid grid-cols-3 gap-2">
          {['male', 'female', 'neutral'].map(gender => (
            <button
              key={gender}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, gender }))}
              className={`p-2 rounded-lg border-2 transition-all capitalize ${
                formData.gender === gender
                  ? 'border-rose-500 bg-rose-900/30 text-rose-300'
                  : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
              }`}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      {/* Cover-up Mode */}
      <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="coverUp"
            checked={formData.coverUpMode}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, coverUpMode: checked }))}
          />
          <label htmlFor="coverUp" className="flex-1 cursor-pointer">
            <div className="text-sm text-white">Cover-Up Design Mode</div>
            <div className="text-xs text-slate-400">Design to cover existing tattoo</div>
          </label>
        </div>
      </div>

      {/* Additional Elements */}
      <div className="space-y-2">
        <Label className="text-slate-300">Additional Elements (Optional)</Label>
        <Textarea
          value={formData.additionalElements}
          onChange={(e) => setFormData(prev => ({ ...prev, additionalElements: e.target.value }))}
          placeholder="Banner text, dates, names, specific symbols, background elements..."
          rows={2}
          className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-rose-500 min-h-[60px]"
        />
      </div>

      {/* Generate Button */}
      <Button
        type="submit"
        disabled={!isValid || isGenerating}
        className="w-full h-12 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-semibold rounded-xl disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Tattoo Design (4 Credits)
          </>
        )}
      </Button>

      {formData.designMode === 'matching' && (
        <p className="text-xs text-center text-slate-400">
          💑 Matching mode will create complementary designs for couples
        </p>
      )}

      <p className="text-center text-xs text-slate-500">
        Uses 4 credits per generation
      </p>
    </form>
  );
}

