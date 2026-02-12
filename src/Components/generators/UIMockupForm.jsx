import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Loader2, Smartphone, Tablet, Monitor, Layout, Palette } from 'lucide-react';

const APP_TYPES = [
  { value: 'social_media', label: '📱 Social Media', screens: ['home_feed', 'profile', 'messaging', 'notifications', 'stories', 'explore'] },
  { value: 'ecommerce', label: '🛍️ E-Commerce', screens: ['product_listing', 'product_detail', 'cart', 'checkout', 'order_history', 'wishlist'] },
  { value: 'fitness', label: '💪 Fitness & Health', screens: ['dashboard', 'workout_tracker', 'progress_stats', 'meal_planner', 'goals', 'community'] },
  { value: 'finance', label: '💰 Finance & Banking', screens: ['account_overview', 'transaction_history', 'transfer_money', 'budget_tracker', 'analytics', 'cards'] },
  { value: 'productivity', label: '✅ Productivity', screens: ['task_list', 'calendar', 'project_board', 'notes', 'time_tracker', 'analytics'] },
  { value: 'streaming', label: '🎬 Media & Streaming', screens: ['browse_content', 'video_player', 'search', 'library', 'recommendations', 'downloads'] },
  { value: 'travel', label: '✈️ Travel & Booking', screens: ['search_destinations', 'booking_details', 'itinerary', 'map_view', 'reviews', 'my_trips'] },
  { value: 'food_delivery', label: '🍕 Food Delivery', screens: ['restaurant_list', 'menu', 'cart', 'order_tracking', 'favorites', 'reviews'] },
  { value: 'dating', label: '💕 Dating & Social', screens: ['swipe_cards', 'matches', 'chat', 'profile_edit', 'discover', 'events'] },
  { value: 'education', label: '📚 Education & Learning', screens: ['course_catalog', 'lesson_view', 'progress_tracker', 'quiz', 'certificates', 'discussion'] },
];

const UI_STYLES = [
  { value: 'modern_minimal', label: 'Modern Minimal', desc: 'Clean, spacious, simple' },
  { value: 'neumorphic', label: 'Neumorphic', desc: 'Soft shadows, 3D depth' },
  { value: 'glassmorphic', label: 'Glassmorphic', desc: 'Frosted glass, blur effects' },
  { value: 'material_design', label: 'Material Design', desc: 'Google-style cards & elevation' },
  { value: 'flat_design', label: 'Flat Design', desc: 'Bold colors, no shadows' },
  { value: 'gradient_modern', label: 'Gradient Modern', desc: 'Vibrant gradients, colorful' },
  { value: 'dark_luxury', label: 'Dark Luxury', desc: 'Premium dark theme' },
  { value: 'playful_rounded', label: 'Playful Rounded', desc: 'Rounded corners, fun' },
];

const COLOR_SCHEMES = [
  { value: 'blue_gradient', label: 'Blue Gradient', colors: '🔵 Blue to Purple' },
  { value: 'green_nature', label: 'Green Nature', colors: '🟢 Mint to Forest' },
  { value: 'purple_luxury', label: 'Purple Luxury', colors: '🟣 Purple to Pink' },
  { value: 'orange_energy', label: 'Orange Energy', colors: '🟠 Orange to Red' },
  { value: 'monochrome', label: 'Monochrome', colors: '⚫ Black & White' },
  { value: 'pastel_soft', label: 'Pastel Soft', colors: '🌸 Soft Pastels' },
  { value: 'dark_mode', label: 'Dark Mode', colors: '🌑 Dark Gray & Accent' },
  { value: 'vibrant_bold', label: 'Vibrant Bold', colors: '🌈 Multi-color Bold' },
];

const UI_ELEMENTS = [
  'navigation_bar', 'search_bar', 'filter_options', 'card_components',
  'floating_action_button', 'bottom_sheet', 'modal_dialogs', 'tab_bar',
  'carousel_slider', 'progress_indicators', 'badges_notifications', 'avatar_images'
];

export default function UIMockupForm({ onGenerate, isGenerating }) {
  const [formData, setFormData] = useState({
    appType: 'social_media',
    screenType: 'home_feed',
    uiStyle: 'modern_minimal',
    colorScheme: 'blue_gradient',
    deviceType: 'mobile',
    themeMode: 'light',
    componentDensity: 'balanced',
    includeElements: [],
    primaryAction: '',
    appName: '',
    additionalNotes: '',
  });

  const currentAppType = APP_TYPES.find(app => app.value === formData.appType);

  const toggleElement = (element) => {
    setFormData(prev => ({
      ...prev,
      includeElements: prev.includeElements.includes(element)
        ? prev.includeElements.filter(e => e !== element)
        : [...prev.includeElements, element]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* App Type */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          <Layout className="w-4 h-4 inline mr-2" />
          App Type
        </Label>
        <Select
          value={formData.appType}
          onValueChange={(value) => {
            const selectedApp = APP_TYPES.find(a => a.value === value);
            setFormData(prev => ({ 
              ...prev, 
              appType: value, 
              screenType: selectedApp?.screens[0] || 'home_feed' 
            }));
          }}
        >
          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            {APP_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value} className="text-white hover:bg-slate-800">
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Screen Type */}
      <div className="space-y-2">
        <Label className="text-slate-300">Screen Type</Label>
        <Select
          value={formData.screenType}
          onValueChange={(value) => setFormData(prev => ({ ...prev, screenType: value }))}
        >
          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            {currentAppType?.screens.map(screen => (
              <SelectItem key={screen} value={screen} className="text-white hover:bg-slate-800">
                {screen.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* App Name */}
      <div className="space-y-2">
        <Label className="text-slate-300">App Name (Optional)</Label>
        <Input
          value={formData.appName}
          onChange={(e) => setFormData(prev => ({ ...prev, appName: e.target.value }))}
          placeholder="e.g., FitTrack, ShopEase, TaskMaster..."
          className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
        />
      </div>

      {/* Device Type */}
      <div className="space-y-2">
        <Label className="text-slate-300">Device Type</Label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'mobile', icon: Smartphone, label: 'Mobile' },
            { value: 'tablet', icon: Tablet, label: 'Tablet' },
            { value: 'desktop', icon: Monitor, label: 'Desktop' }
          ].map(device => {
            const Icon = device.icon;
            return (
              <button
                key={device.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, deviceType: device.value }))}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.deviceType === device.value
                    ? 'border-cyan-500 bg-cyan-900/30'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-1 ${formData.deviceType === device.value ? 'text-cyan-400' : 'text-slate-400'}`} />
                <div className={`text-xs ${formData.deviceType === device.value ? 'text-cyan-300' : 'text-slate-400'}`}>
                  {device.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* UI Style */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          <Palette className="w-4 h-4 inline mr-2" />
          UI Design Style
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {UI_STYLES.map(style => (
            <button
              key={style.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, uiStyle: style.value }))}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                formData.uiStyle === style.value
                  ? 'border-cyan-500 bg-cyan-900/30'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div className={`font-medium text-sm ${formData.uiStyle === style.value ? 'text-cyan-300' : 'text-white'}`}>
                {style.label}
              </div>
              <div className="text-xs text-slate-400 mt-1">{style.desc}</div>
            </button>
          ))}
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
                  ? 'border-cyan-500 bg-cyan-900/30'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div className={`font-medium text-sm ${formData.colorScheme === scheme.value ? 'text-cyan-300' : 'text-white'}`}>
                {scheme.label}
              </div>
              <div className="text-xs text-slate-400 mt-1">{scheme.colors}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Theme Mode */}
      <div className="space-y-2">
        <Label className="text-slate-300">Theme Mode</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, themeMode: 'light' }))}
            className={`p-3 rounded-lg border-2 transition-all ${
              formData.themeMode === 'light'
                ? 'border-cyan-500 bg-cyan-900/30'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }`}
          >
            <div className={`text-sm font-medium ${formData.themeMode === 'light' ? 'text-cyan-300' : 'text-white'}`}>
              ☀️ Light Mode
            </div>
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, themeMode: 'dark' }))}
            className={`p-3 rounded-lg border-2 transition-all ${
              formData.themeMode === 'dark'
                ? 'border-cyan-500 bg-cyan-900/30'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }`}
          >
            <div className={`text-sm font-medium ${formData.themeMode === 'dark' ? 'text-cyan-300' : 'text-white'}`}>
              🌙 Dark Mode
            </div>
          </button>
        </div>
      </div>

      {/* Component Density */}
      <div className="space-y-2">
        <Label className="text-slate-300">Component Density</Label>
        <div className="grid grid-cols-3 gap-2">
          {['compact', 'balanced', 'spacious'].map(density => (
            <button
              key={density}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, componentDensity: density }))}
              className={`p-2 rounded-lg border-2 transition-all ${
                formData.componentDensity === density
                  ? 'border-cyan-500 bg-cyan-900/30 text-cyan-300'
                  : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className="text-xs font-medium capitalize">{density}</div>
            </button>
          ))}
        </div>
      </div>

      {/* UI Elements to Include */}
      <div className="space-y-2">
        <Label className="text-slate-300">UI Elements to Include</Label>
        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700 max-h-48 overflow-y-auto">
          {UI_ELEMENTS.map(element => (
            <div key={element} className="flex items-center space-x-2">
              <Checkbox
                id={element}
                checked={formData.includeElements.includes(element)}
                onCheckedChange={() => toggleElement(element)}
              />
              <label
                htmlFor={element}
                className="text-sm text-slate-300 cursor-pointer"
              >
                {element.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Action */}
      <div className="space-y-2">
        <Label className="text-slate-300">Primary Action/CTA (Optional)</Label>
        <Input
          value={formData.primaryAction}
          onChange={(e) => setFormData(prev => ({ ...prev, primaryAction: e.target.value }))}
          placeholder="e.g., 'Add to Cart', 'Start Workout', 'Send Message'..."
          className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
        />
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label className="text-slate-300">Additional Design Notes (Optional)</Label>
        <Textarea
          value={formData.additionalNotes}
          onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
          placeholder="Any specific layouts, interactions, or visual preferences..."
          rows={3}
          className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 min-h-[60px]"
        />
      </div>

      {/* Generate Button */}
      <Button
        type="submit"
        disabled={isGenerating}
        className="w-full h-12 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Smartphone className="w-5 h-5 mr-2" />
            Generate UI Mockup (4 Credits)
          </>
        )}
      </Button>

      <p className="text-center text-xs text-slate-500">
        Uses 4 credits per generation
      </p>
    </form>
  );
}

