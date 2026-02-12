import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Download, 
  RefreshCw, 
  Expand, 
  Sparkles,
  Copy,
  Check,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ExportModal from './ExportModal';

export default function GenerationGallery({ 
  images, 
  onRegenerate, 
  onVariation, 
  onFavorite,
  isGenerating 
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [exportImage, setExportImage] = useState(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const copyPrompt = async () => {
    if (selectedImage?.prompt) {
      await navigator.clipboard.writeText(selectedImage.prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {images.map((image, idx) => (
            <motion.div
              key={image.id || idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.1 }}
              className="relative group aspect-square rounded-xl overflow-hidden bg-slate-800"
            >
              <img
                src={image.image_url}
                alt={`Generated ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                      onClick={() => onFavorite(image)}
                    >
                      <Heart className={`w-4 h-4 ${image.is_favorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                      onClick={() => setSelectedImage(image)}
                    >
                      <Expand className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                      onClick={() => onVariation(image)}
                      disabled={isGenerating}
                    >
                      <Sparkles className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-lg bg-cyan-500/80 hover:bg-cyan-500 text-white"
                      onClick={() => setExportImage(image)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Favorite indicator */}
              {image.is_favorite && (
                <div className="absolute top-2 right-2">
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400 text-sm">
            Your generated images will appear here
          </p>
        </div>
      )}

      {/* Regenerate All Button */}
      {images.length > 0 && (
        <Button
          onClick={onRegenerate}
          disabled={isGenerating}
          variant="outline"
          className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
          Regenerate All
        </Button>
      )}

      {/* Image Preview Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl bg-slate-900 border-slate-700 p-0 overflow-hidden">
          <div className="relative">
            <img
              src={selectedImage?.image_url}
              alt="Preview"
              className="w-full h-auto"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-1">Prompt</p>
                <p className="text-sm text-slate-300 line-clamp-2">{selectedImage?.prompt}</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-slate-400 hover:text-white"
                onClick={copyPrompt}
              >
                {copiedPrompt ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => onVariation(selectedImage)}
                disabled={isGenerating}
                className="flex-1 bg-slate-800 hover:bg-slate-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Variation
              </Button>
              <Button
                onClick={() => {
                  setExportImage(selectedImage);
                  setSelectedImage(null);
                }}
                className="flex-1 bg-cyan-600 hover:bg-cyan-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
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