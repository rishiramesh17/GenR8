import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function GeneratorCard({ 
  title, 
  description, 
  icon: Icon, 
  gradient, 
  page,
  comingSoon = false 
}) {
  const content = (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`relative group overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-[1px] cursor-pointer`}
    >
      <div className="relative h-full bg-slate-950/90 backdrop-blur-xl rounded-2xl p-6 overflow-hidden">
        {/* Glow effect */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${gradient} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-500`} />
        
        {/* Icon */}
        <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} p-[1px] mb-5`}>
          <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center">
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Content */}
        <h3 className="relative text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="relative text-slate-400 text-sm leading-relaxed mb-4">{description}</p>

        {/* CTA */}
        <div className="relative flex items-center gap-2 text-sm font-medium">
          {comingSoon ? (
            <span className="text-slate-500">Coming Soon</span>
          ) : (
            <>
              <span className="text-white group-hover:text-cyan-400 transition-colors">
                Start Creating
              </span>
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </div>

        {comingSoon && (
          <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-slate-800 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            Soon
          </div>
        )}
      </div>
    </motion.div>
  );

  if (comingSoon) return content;

  return (
    <Link to={createPageUrl(page)}>
      {content}
    </Link>
  );
}