import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Loader2, Package, Lightbulb } from 'lucide-react';

const PRODUCT_CATEGORIES = [
  { value: 'furniture', label: '🪑 Furniture' },
  { value: 'electronics', label: '📱 Electronics' },
  { value: 'kitchen_appliances', label: '🍳 Kitchen Appliances' },
  { value: 'outdoor_gear', label: '⛺ Outdoor Gear' },
  { value: 'office_supplies', label: '📎 Office Supplies' },
  { value: 'home_decor', label: '🖼️ Home Decor' },
  { value: 'tools', label: '🔧 Tools & Equipment' },
  { value: 'accessories', label: '👜 Accessories' },
  { value: 'toys', label: '🧸 Toys & Games' },
  { value: 'custom', label: '✨ Custom Product' },
];

const VISUAL_STYLES = [
  { value: 'realistic', label: 'Photorealistic', desc: 'Camera-quality product shot' },
  { value: 'technical', label: 'Technical Drawing', desc: 'Blueprint/CAD style' },
  { value: 'sketch', label: 'Concept Sketch', desc: 'Hand-drawn concept' },
  { value: 'render', label: '3D Render', desc: 'Clean 3D visualization' },
  { value: 'exploded', label: 'Exploded View', desc: 'Show all components' },
  { value: 'lifestyle', label: 'Lifestyle Shot', desc: 'Product in use context' },
];

const VIEW_ANGLES = [
  { value: 'front', label: 'Front View' },
  { value: 'three_quarter', label: 'Three-Quarter View' },
  { value: 'top_down', label: 'Top Down' },
  { value: 'side', label: 'Side Profile' },
  { value: 'isometric', label: 'Isometric' },
  { value: 'multiple_angles', label: 'Multiple Angles' },
];

const BACKGROUNDS = [
  { value: 'white_studio', label: 'White Studio' },
  { value: 'gradient', label: 'Gradient Background' },
  { value: 'environment', label: 'Environmental Context' },
  { value: 'transparent', label: 'Transparent/Isolated' },
  { value: 'lifestyle', label: 'Lifestyle Setting' },
  { value: 'minimal', label: 'Minimal Shadow' },
];

const MATERIAL_OPTIONS = [
  'wood', 'metal', 'plastic', 'glass', 'leather', 
  'fabric', 'ceramic', 'rubber', 'carbon_fiber', 'aluminum'
];

const COLOR_SCHEMES = [
  { value: 'neutral', label: 'Neutral (Black/White/Gray)' },
  { value: 'bold', label: 'Bold & Vibrant' },
  { value: 'pastel', label: 'Soft Pastels' },
  { value: 'earth_tones', label: 'Earth Tones' },
  { value: 'metallic', label: 'Metallic Finishes' },
  { value: 'custom', label: 'Custom/Mixed' },
];

export default function ProductForm({ onGenerate, isGenerating }) {
  const [formData, setFormData] = useState({
    productCategory: 'furniture',
    productDescription: '',
    visualStyle: 'realistic',
    viewAngle: 'three_quarter',
    background: 'white_studio',
    materials: [],
    colorScheme: 'neutral',
    detailLevel: [3],
    includeDimensions: false,
    includeAnnotations: false,
    additionalFeatures: '',
  });

  const [examplePrompts] = useState([
    "A sleek desk with 3 drawers on the right, built-in LED lamp, two storage sections on left, adjustable height mechanism",
    "Modern ergonomic office chair with lumbar support, adjustable armrests, breathable mesh back, chrome base with wheels",
    "Minimalist smartphone with edge-to-edge display, triple camera system, ceramic body, wireless charging pad on back",
    "Portable coffee maker with thermal carafe, built-in grinder, programmable timer, compact fold-down design for travel",
  ]);

  const toggleMaterial = (material) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material]
    }));
  };

  const useExamplePrompt = (prompt) => {
    setFormData(prev => ({ ...prev, productDescription: prompt }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const isValid = formData.productDescription.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Example Prompts */}
      <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-800/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-slate-300">Example Ideas</span>
        </div>
        <div className="space-y-2">
          {examplePrompts.slice(0, 2).map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => useExamplePrompt(prompt)}
              className="w-full text-left text-xs text-slate-400 hover:text-indigo-300 transition-colors p-2 rounded bg-slate-800/50 hover:bg-slate-800 border border-slate-700"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Product Category */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          <Package className="w-4 h-4 inline mr-2" />
          Product Category
        </Label>
        <Select
          value={formData.productCategory}
          onValueChange={(value) => setFormData(prev => ({ ...prev, productCategory: value }))}
        >
          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            {PRODUCT_CATEGORIES.map(cat => (
              <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-slate-800">
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Product Description */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          <Sparkles className="w-4 h-4 inline mr-2" />
          Describe Your Product Idea *
        </Label>
        <Textarea
          value={formData.productDescription}
          onChange={(e) => setFormData(prev => ({ ...prev, productDescription: e.target.value }))}
          placeholder="E.g., A desk with 3 drawers on the right side, built-in LED lamp, two storage sections on the left, and a slate to lift the main portion of the desk..."
          rows={5}
          className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 min-h-[100px]"
        />
        <p className="text-xs text-slate-500">
          Be specific about features, components, placement, and functionality
        </p>
      </div>

      {/* Visual Style */}
      <div className="space-y-2">
        <Label className="text-slate-300">Visual Style</Label>
        <div className="grid grid-cols-2 gap-2">
          {VISUAL_STYLES.map(style => (
            <button
              key={style.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, visualStyle: style.value }))}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                formData.visualStyle === style.value
                  ? 'border-indigo-500 bg-indigo-900/30'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div className="font-medium text-sm text-white">{style.label}</div>
              <div className="text-xs text-slate-400 mt-1">{style.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* View Angle */}
      <div className="space-y-2">
        <Label className="text-slate-300">View Angle</Label>
        <Select
          value={formData.viewAngle}
          onValueChange={(value) => setFormData(prev => ({ ...prev, viewAngle: value }))}
        >
          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            {VIEW_ANGLES.map(angle => (
              <SelectItem key={angle.value} value={angle.value} className="text-white hover:bg-slate-800">
                {angle.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Background */}
      <div className="space-y-2">
        <Label className="text-slate-300">Background Setting</Label>
        <Select
          value={formData.background}
          onValueChange={(value) => setFormData(prev => ({ ...prev, background: value }))}
        >
          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            {BACKGROUNDS.map(bg => (
              <SelectItem key={bg.value} value={bg.value} className="text-white hover:bg-slate-800">
                {bg.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Materials */}
      <div className="space-y-2">
        <Label className="text-slate-300">Materials (Optional)</Label>
        <div className="grid grid-cols-3 gap-2">
          {MATERIAL_OPTIONS.map(material => (
            <div key={material} className="flex items-center space-x-2">
              <Checkbox
                id={material}
                checked={formData.materials.includes(material)}
                onCheckedChange={() => toggleMaterial(material)}
              />
              <label
                htmlFor={material}
                className="text-sm text-slate-300 cursor-pointer"
              >
                {material.replace(/_/g, ' ')}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Color Scheme */}
      <div className="space-y-2">
        <Label className="text-slate-300">Color Scheme</Label>
        <Select
          value={formData.colorScheme}
          onValueChange={(value) => setFormData(prev => ({ ...prev, colorScheme: value }))}
        >
          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            {COLOR_SCHEMES.map(scheme => (
              <SelectItem key={scheme.value} value={scheme.value} className="text-white hover:bg-slate-800">
                {scheme.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Detail Level */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-slate-300">Detail Level</Label>
          <span className="text-xs text-slate-500">
            {formData.detailLevel[0] === 1 ? 'Simple' : formData.detailLevel[0] === 2 ? 'Balanced' : 'Ultra Detailed'}
          </span>
        </div>
        <Slider
          value={formData.detailLevel}
          onValueChange={(value) => setFormData(prev => ({ ...prev, detailLevel: value }))}
          min={1}
          max={3}
          step={1}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>Simple</span>
          <span>Balanced</span>
          <span>Ultra Detailed</span>
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="dimensions"
            checked={formData.includeDimensions}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeDimensions: checked }))}
          />
          <label htmlFor="dimensions" className="flex-1 cursor-pointer">
            <div className="text-sm text-white">Include Dimensions</div>
            <div className="text-xs text-slate-400">Show measurements on the product</div>
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="annotations"
            checked={formData.includeAnnotations}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeAnnotations: checked }))}
          />
          <label htmlFor="annotations" className="flex-1 cursor-pointer">
            <div className="text-sm text-white">Feature Annotations</div>
            <div className="text-xs text-slate-400">Label key features and components</div>
          </label>
        </div>
      </div>

      {/* Additional Features */}
      <div className="space-y-2">
        <Label className="text-slate-300">Additional Features (Optional)</Label>
        <Textarea
          value={formData.additionalFeatures}
          onChange={(e) => setFormData(prev => ({ ...prev, additionalFeatures: e.target.value }))}
          placeholder="Any specific textures, patterns, branding elements, or special details..."
          rows={3}
          className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 min-h-[60px]"
        />
      </div>

      {/* Generate Button */}
      <Button
        type="submit"
        disabled={!isValid || isGenerating}
        className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Package className="w-5 h-5 mr-2" />
            Generate Product Visuals (4 Credits)
          </>
        )}
      </Button>

      <p className="text-center text-xs text-slate-500">
        Uses 4 credits per generation
      </p>
    </form>
  );
}

