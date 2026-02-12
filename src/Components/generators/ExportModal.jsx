import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Download, Check, Shield, Building, Globe } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const LICENSES = [
  {
    value: 'personal',
    label: 'Personal Use',
    description: 'For personal projects, portfolios, and non-commercial use',
    icon: Shield,
    credits: 0,
  },
  {
    value: 'commercial',
    label: 'Commercial License',
    description: 'For business use, marketing, and client projects',
    icon: Building,
    credits: 2,
  },
  {
    value: 'extended',
    label: 'Extended License',
    description: 'Unlimited use including merchandise and resale',
    icon: Globe,
    credits: 5,
  },
];

const FORMATS = [
  { value: 'png', label: 'PNG', description: 'Best for web, transparent background' },
  { value: 'jpg', label: 'JPG', description: 'Smaller file size, no transparency' },
];

export default function ExportModal({ image, isOpen, onClose }) {
  const [license, setLicense] = useState('personal');
  const [format, setFormat] = useState('png');
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    
    try {
      // Update the asset with license info
      if (image?.id) {
        await base44.entities.GeneratedAsset.update(image.id, {
          license_type: license,
          exported: true,
        });
      }

      // Trigger download
      const link = document.createElement('a');
      link.href = image.image_url;
      link.download = `generated-asset-${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExported(true);
      setTimeout(() => {
        onClose();
        setExported(false);
        setLicense('personal');
        setFormat('png');
      }, 1500);
    } catch (error) {
      console.error('Export failed:', error);
    }
    
    setExporting(false);
  };

  const selectedLicense = LICENSES.find(l => l.value === license);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Export Asset</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preview */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-xl overflow-hidden bg-slate-800">
              {image && (
                <img
                  src={image.image_url}
                  alt="Export preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* License Selection */}
          <div className="space-y-3">
            <Label className="text-slate-300">License Type</Label>
            <RadioGroup value={license} onValueChange={setLicense} className="space-y-2">
              {LICENSES.map((lic) => (
                <motion.label
                  key={lic.value}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    license === lic.value
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <RadioGroupItem value={lic.value} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <lic.icon className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-white">{lic.label}</span>
                      {lic.credits > 0 && (
                        <span className="text-xs text-amber-400">+{lic.credits} credits</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{lic.description}</p>
                  </div>
                </motion.label>
              ))}
            </RadioGroup>
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-slate-300">Format</Label>
            <div className="grid grid-cols-2 gap-2">
              {FORMATS.map((fmt) => (
                <button
                  key={fmt.value}
                  type="button"
                  onClick={() => setFormat(fmt.value)}
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    format === fmt.value
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <span className="font-medium text-white text-sm">{fmt.label}</span>
                  <p className="text-xs text-slate-500 mt-0.5">{fmt.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-slate-400">
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className={`min-w-[140px] ${
              exported 
                ? 'bg-green-600 hover:bg-green-600' 
                : 'bg-cyan-600 hover:bg-cyan-500'
            }`}
          >
            {exported ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download {selectedLicense?.credits > 0 && `(+${selectedLicense.credits})`}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}