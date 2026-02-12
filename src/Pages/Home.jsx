import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import GeneratorCard from '@/components/ui/GeneratorCard';
import CreditBadge from '@/components/ui/CreditBadge';
import { 
  Sparkles, 
  Palette, 
  User, 
  Building2, 
  Package, 
  Smartphone,
  Share2, 
  Wand2,
  Paintbrush,
  FolderOpen,
  ChevronRight,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";

const GENERATORS = [
  {
    title: 'Logo & Brand',
    description: 'Create stunning logos and brand identities with guided controls for style, color, and complexity.',
    icon: Palette,
    gradient: 'from-cyan-500 to-blue-600',
    page: 'LogoGenerator',
  },
  {
    title: 'Avatar Creator',
    description: 'Design unique characters and avatars in any art style, perfect for profiles and games.',
    icon: User,
    gradient: 'from-purple-500 to-pink-600',
    page: 'AvatarGenerator',
  },
  {
    title: 'Architecture',
    description: 'Visualize architectural concepts and interior designs with photorealistic renders.',
    icon: Building2,
    gradient: 'from-emerald-500 to-teal-600',
    page: 'ArchitectureGenerator',
    comingSoon: false,
  },
  {
    title: 'Product Designer',
    description: 'Transform ideas into product visuals with detailed controls for style, materials, and presentation.',
    icon: Package,
    gradient: 'from-indigo-500 to-purple-600',
    page: 'ProductGenerator',
    comingSoon: false,
  },
  {
    title: 'UI Mockup Designer',
    description: 'Create professional app interfaces and UI mockups for mobile, tablet, and desktop applications.',
    icon: Smartphone,
    gradient: 'from-cyan-500 to-blue-600',
    page: 'AppUiGenerator',
    comingSoon: false,
  },
  {
    title: 'Tattoo Design Studio',
    description: 'Create & visualize professional tattoo designs with style, placement, and detail controls.',
    icon: Sparkles,
    gradient: 'from-rose-500 to-purple-600',
    page: 'TattooGenerator',
    comingSoon: false,
  },
  {
    title: 'Image Editor',
    description: 'Upload photos and transform them with AI—edit, enhance, remove objects, and apply effects.',
    icon: Paintbrush,
    gradient: 'from-amber-500 to-orange-600',
    page: 'ImageEditor',
    comingSoon: false,
  },
  {
    title: 'Social Content',
    description: 'Create scroll-stopping social media graphics and marketing visuals.',
    icon: Share2,
    gradient: 'from-pink-500 to-rose-600',
    page: 'Home',
    comingSoon: true,
  },
  {
    title: 'Concept Art',
    description: 'Explore creative concepts and illustrations for games, films, and storytelling.',
    icon: Wand2,
    gradient: 'from-violet-500 to-indigo-600',
    page: 'Home',
    comingSoon: true,
  },
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [recentAssets, setRecentAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        
        const assets = await base44.entities.GeneratedAsset.filter(
          { created_by: userData.email },
          '-created_date',
          6
        );
        setRecentAssets(assets);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">GenR8</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('Projects')}>
                <Button variant="ghost" className="text-slate-400 hover:text-white">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  My Projects
                </Button>
              </Link>
              <CreditBadge credits={user?.credits ?? 100} />
            </div>
          </div>

          {/* Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Professional AI Assets,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Purpose-Built
              </span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Skip the prompt engineering. Use specialized generators with guided controls 
              to create export-ready logos, avatars, and visual assets in minutes.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Generators Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-white">Choose a Generator</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GENERATORS.map((gen, idx) => (
            <motion.div
              key={gen.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GeneratorCard {...gen} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Creations */}
      {recentAssets.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Creations</h2>
            <Link to={createPageUrl('Projects')}>
              <Button variant="ghost" className="text-slate-400 hover:text-white text-sm">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {recentAssets.map((asset, idx) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="aspect-square rounded-xl overflow-hidden bg-slate-800 group cursor-pointer"
              >
                <img
                  src={asset.image_url}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Reproducible Results',
                description: 'Every generation saves prompt, seed, and settings so you can recreate and iterate on any result.',
              },
              {
                icon: FolderOpen,
                title: 'Project Workspace',
                description: 'Organize assets by project, favorite your best creations, and access full generation history.',
              },
              {
                icon: Building2,
                title: 'Clear Licensing',
                description: 'Choose your license at export—personal, commercial, or extended—with transparent terms.',
              },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}