import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Wand2, RotateCcw, Download, Trash2, Sparkles, Image, Paintbrush, Eraser, Sun, ArrowLeft } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

// Form primitives (Input, Label, etc. kept for form layout)
const Input = ({ value, onChange, placeholder, className, type = 'text' }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-3 py-2 rounded-lg ${className}`}
  />
);

const Label = ({ children, className }) => (
  <label className={`block text-sm font-medium mb-2 ${className}`}>{children}</label>
);

const Textarea = ({ value, onChange, placeholder, className, rows = 3 }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className={`w-full px-3 py-2 rounded-lg resize-none ${className}`}
  />
);

const Slider = ({ value, onChange, min, max, step, label, className }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-300 font-medium">{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer ${className}`}
    />
  </div>
);

const Tabs = ({ tabs, activeTab, onChange }) => (
  <div className="flex gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-700">
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
          activeTab === tab.id
            ? 'bg-violet-600 text-white'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {tab.icon && <tab.icon className="w-4 h-4 inline mr-2" />}
        {tab.label}
      </button>
    ))}
  </div>
);

// Image Editor Form Component
function ImageEditorForm({ originalImage, onEdit, isProcessing }) {
  const [activeTab, setActiveTab] = useState('ai_edit');
  const [formData, setFormData] = useState({
    editPrompt: '',
    editStrength: 0.75,
    removeBackground: false,
    enhanceQuality: false,
    upscale: false,
    brightness: 0,
    contrast: 0,
    saturation: 0,
    effectType: 'none',
    filterStrength: 0.5,
    objectToRemove: '',
  });

  const [quickEditPrompts] = useState([
    "Remove the background and make it transparent",
    "Change the background to a beach sunset",
    "Make it look like a professional headshot",
    "Add dramatic lighting",
    "Convert to black and white with high contrast",
    "Make it look like a vintage photo from the 1970s",
  ]);

  const tabs = [
    { id: 'ai_edit', label: 'AI Edit', icon: Wand2 },
    { id: 'quick_edits', label: 'Quick Edits', icon: Sparkles },
    { id: 'adjustments', label: 'Adjustments', icon: Sun },
    { id: 'effects', label: 'Effects', icon: Paintbrush },
    { id: 'remove', label: 'Remove Object', icon: Eraser },
  ];

  const effectTypes = [
    { value: 'none', label: 'None' },
    { value: 'blur', label: 'Blur' },
    { value: 'sharpen', label: 'Sharpen' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'cinematic', label: 'Cinematic' },
    { value: 'oil_painting', label: 'Oil Painting' },
    { value: 'sketch', label: 'Sketch' },
    { value: 'anime', label: 'Anime Style' },
  ];

  const handleApplyEdit = () => {
    onEdit(formData, activeTab);
  };

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'ai_edit' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 border border-violet-800/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wand2 className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-slate-300">AI-Powered Edits</span>
            </div>
            <div className="space-y-2">
              {quickEditPrompts.slice(0, 3).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setFormData(prev => ({ ...prev, editPrompt: prompt }))}
                  className="w-full text-left text-xs text-slate-400 hover:text-violet-300 transition-colors p-2 rounded bg-slate-800/50 hover:bg-slate-800 border border-slate-700"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-slate-300">Describe Your Edit</Label>
            <Textarea
              value={formData.editPrompt}
              onChange={(e) => setFormData(prev => ({ ...prev, editPrompt: e.target.value }))}
              placeholder="e.g., 'Change hair color to blonde', 'Add sunglasses', 'Make the sky more dramatic', 'Remove the person in the background'..."
              rows={4}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <Slider
              label="Edit Strength"
              value={formData.editStrength}
              onChange={(val) => setFormData(prev => ({ ...prev, editStrength: val }))}
              min={0.1}
              max={1}
              step={0.05}
              className="accent-violet-600"
            />
            <p className="text-xs text-slate-500 mt-1">
              Lower = subtle changes, Higher = dramatic changes
            </p>
          </div>
        </div>
      )}

      {activeTab === 'quick_edits' && (
        <div className="space-y-4">
          <div className="grid gap-3">
            <button
              onClick={() => setFormData(prev => ({ ...prev, removeBackground: !prev.removeBackground }))}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.removeBackground
                  ? 'border-violet-500 bg-violet-900/30'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-medium text-sm ${formData.removeBackground ? 'text-violet-300' : 'text-white'}`}>
                    Remove Background
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Make background transparent</div>
                </div>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  formData.removeBackground ? 'border-violet-500 bg-violet-600' : 'border-slate-600'
                }`}>
                  {formData.removeBackground && <span className="text-white text-xs">✓</span>}
                </div>
              </div>
            </button>

            <button
              onClick={() => setFormData(prev => ({ ...prev, enhanceQuality: !prev.enhanceQuality }))}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.enhanceQuality
                  ? 'border-violet-500 bg-violet-900/30'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-medium text-sm ${formData.enhanceQuality ? 'text-violet-300' : 'text-white'}`}>
                    Enhance Quality
                  </div>
                  <div className="text-xs text-slate-400 mt-1">AI-powered upscaling & sharpening</div>
                </div>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  formData.enhanceQuality ? 'border-violet-500 bg-violet-600' : 'border-slate-600'
                }`}>
                  {formData.enhanceQuality && <span className="text-white text-xs">✓</span>}
                </div>
              </div>
            </button>

            <button
              onClick={() => setFormData(prev => ({ ...prev, upscale: !prev.upscale }))}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.upscale
                  ? 'border-violet-500 bg-violet-900/30'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-medium text-sm ${formData.upscale ? 'text-violet-300' : 'text-white'}`}>
                    Upscale 2x
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Double the resolution</div>
                </div>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  formData.upscale ? 'border-violet-500 bg-violet-600' : 'border-slate-600'
                }`}>
                  {formData.upscale && <span className="text-white text-xs">✓</span>}
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'adjustments' && (
        <div className="space-y-4">
          <Slider
            label="Brightness"
            value={formData.brightness}
            onChange={(val) => setFormData(prev => ({ ...prev, brightness: val }))}
            min={-100}
            max={100}
            step={1}
            className="accent-violet-600"
          />
          <Slider
            label="Contrast"
            value={formData.contrast}
            onChange={(val) => setFormData(prev => ({ ...prev, contrast: val }))}
            min={-100}
            max={100}
            step={1}
            className="accent-violet-600"
          />
          <Slider
            label="Saturation"
            value={formData.saturation}
            onChange={(val) => setFormData(prev => ({ ...prev, saturation: val }))}
            min={-100}
            max={100}
            step={1}
            className="accent-violet-600"
          />
        </div>
      )}

      {activeTab === 'effects' && (
        <div className="space-y-4">
          <div>
            <Label className="text-slate-300">Effect Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {effectTypes.map(effect => (
                <button
                  key={effect.value}
                  onClick={() => setFormData(prev => ({ ...prev, effectType: effect.value }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.effectType === effect.value
                      ? 'border-violet-500 bg-violet-900/30 text-violet-300'
                      : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="text-sm font-medium">{effect.label}</div>
                </button>
              ))}
            </div>
          </div>

          {formData.effectType !== 'none' && (
            <Slider
              label="Effect Intensity"
              value={formData.filterStrength}
              onChange={(val) => setFormData(prev => ({ ...prev, filterStrength: val }))}
              min={0}
              max={1}
              step={0.05}
              className="accent-violet-600"
            />
          )}
        </div>
      )}

      {activeTab === 'remove' && (
        <div className="space-y-4">
          <div>
            <Label className="text-slate-300">Object to Remove</Label>
            <Input
              value={formData.objectToRemove}
              onChange={(e) => setFormData(prev => ({ ...prev, objectToRemove: e.target.value }))}
              placeholder="e.g., 'person in background', 'telephone pole', 'watermark', 'blemishes'..."
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
            <p className="text-xs text-slate-500 mt-2">
              Describe what you want to remove from the image
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-xs text-slate-300 leading-relaxed">
              <p className="font-medium text-white mb-2">💡 Tips for best results:</p>
              <ul className="space-y-1 list-disc list-inside text-slate-400">
                <li>Be specific about what to remove</li>
                <li>Works best with distinct objects</li>
                <li>Background will be intelligently filled</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={handleApplyEdit}
        disabled={isProcessing || !originalImage}
        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
            Processing...
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4 mr-2 inline" />
            Apply Edit (2 Credits)
          </>
        )}
      </Button>
    </div>
  );
}

// Main Component
export default function ImageEditor() {
  const [user, setUser] = useState({ credits: 100 });
  const [originalImage, setOriginalImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [editHistory, setEditHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target.result);
        setEditedImage(null);
        setEditHistory([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const buildEditPrompt = (formData, editType) => {
    let prompt = '';

    switch (editType) {
      case 'ai_edit':
        prompt = `Edit this image: ${formData.editPrompt}. Strength: ${formData.editStrength}`;
        break;
      
      case 'quick_edits':
        const edits = [];
        if (formData.removeBackground) edits.push('remove background, transparent background');
        if (formData.enhanceQuality) edits.push('enhance quality, sharpen details, improve clarity');
        if (formData.upscale) edits.push('upscale 2x resolution, high quality');
        prompt = `Apply these edits: ${edits.join(', ')}`;
        break;
      
      case 'adjustments':
        const adjustments = [];
        if (formData.brightness !== 0) adjustments.push(`brightness ${formData.brightness > 0 ? 'increase' : 'decrease'} by ${Math.abs(formData.brightness)}%`);
        if (formData.contrast !== 0) adjustments.push(`contrast ${formData.contrast > 0 ? 'increase' : 'decrease'} by ${Math.abs(formData.contrast)}%`);
        if (formData.saturation !== 0) adjustments.push(`saturation ${formData.saturation > 0 ? 'increase' : 'decrease'} by ${Math.abs(formData.saturation)}%`);
        prompt = `Adjust image: ${adjustments.join(', ')}`;
        break;
      
      case 'effects':
        if (formData.effectType !== 'none') {
          prompt = `Apply ${formData.effectType.replace(/_/g, ' ')} effect with ${formData.filterStrength * 100}% intensity`;
        }
        break;
      
      case 'remove':
        prompt = `Remove ${formData.objectToRemove} from image, intelligently fill background`;
        break;
    }

    return prompt;
  };

  const handleEdit = async (formData, editType) => {
    setIsProcessing(true);
    const prompt = buildEditPrompt(formData, editType);

    setTimeout(() => {
      const newEdit = {
        id: Date.now(),
        image: `https://picsum.photos/seed/${Date.now()}/800/600`,
        prompt,
        editType,
        timestamp: new Date().toISOString(),
      };

      setEditedImage(newEdit.image);
      setEditHistory(prev => [newEdit, ...prev]);
      setUser(prev => ({ ...prev, credits: Math.max(0, prev.credits - 2) }));
      setIsProcessing(false);
    }, 2000);
  };

  const handleReset = () => {
    setEditedImage(null);
    setEditHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to={createPageUrl('Home')}>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Image className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">AI Image Editor</h1>
                <p className="text-xs text-slate-500">Upload & transform your photos</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-white">{user.credits} Credits</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Edit Controls</h2>
            
            {!originalImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 rounded-xl p-12 text-center cursor-pointer hover:border-violet-500 transition-colors"
              >
                <Upload className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-sm mb-2">Click to upload an image</p>
                <p className="text-slate-600 text-xs">PNG, JPG up to 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <>
                <div className="mb-6 relative">
                  <img 
                    src={originalImage} 
                    alt="Original" 
                    className="w-full h-48 object-cover rounded-lg border border-slate-700"
                  />
                  <button
                    onClick={() => {
                      setOriginalImage(null);
                      setEditedImage(null);
                      setEditHistory([]);
                    }}
                    className="absolute top-2 right-2 p-2 bg-slate-900/90 rounded-lg border border-slate-700 hover:bg-red-900/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                  </button>
                </div>

                <ImageEditorForm 
                  originalImage={originalImage}
                  onEdit={handleEdit}
                  isProcessing={isProcessing}
                />
              </>
            )}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Preview</h2>
              {editedImage && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleReset}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1"
                  >
                    <RotateCcw className="w-3 h-3 mr-1 inline" />
                    Reset
                  </Button>
                  <Button
                    className="text-xs bg-violet-600 hover:bg-violet-500 text-white px-3 py-1"
                  >
                    <Download className="w-3 h-3 mr-1 inline" />
                    Download
                  </Button>
                </div>
              )}
            </div>

            {!originalImage ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                  <Image className="w-10 h-10 text-slate-600" />
                </div>
                <p className="text-slate-400 text-sm">Upload an image to start editing</p>
              </div>
            ) : (
              <div className="space-y-4">
                {editedImage ? (
                  <div className="relative">
                    <img 
                      src={editedImage} 
                      alt="Edited" 
                      className="w-full rounded-lg border border-slate-700"
                    />
                    <div className="absolute top-2 left-2 px-2 py-1 bg-violet-600 rounded text-xs text-white font-medium">
                      Edited
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 text-center border-2 border-dashed border-slate-700 rounded-lg">
                    <Wand2 className="w-12 h-12 text-slate-600 mb-3" />
                    <p className="text-slate-400 text-sm">Your edited image will appear here</p>
                  </div>
                )}

                {editHistory.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-slate-300 mb-3">Edit History</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {editHistory.map((edit, idx) => (
                        <div 
                          key={edit.id}
                          onClick={() => setEditedImage(edit.image)}
                          className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-violet-600 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img 
                              src={edit.image} 
                              alt={`Edit ${idx + 1}`}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-slate-300 truncate">{edit.prompt}</div>
                              <div className="text-xs text-slate-500 mt-1">
                                {new Date(edit.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}