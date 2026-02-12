import React from 'react';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CreditBadge({ credits, showLabel = true }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30"
    >
      <Zap className="w-4 h-4 text-amber-400" />
      <span className="text-sm font-semibold text-amber-300">{credits}</span>
      {showLabel && <span className="text-xs text-amber-400/70">credits</span>}
    </motion.div>
  );
}