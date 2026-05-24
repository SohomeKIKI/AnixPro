'use client'

import { motion } from 'framer-motion'

export default function AmbientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep space background matching the logo */}
      <div className="absolute inset-0 bg-[#080c1f]" />

      {/* Grid pattern with vignette */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 100%)'
        }}
      />

      {/* Floating Orbs matching logo gradient (Coral/Orange) */}
      <motion.div
        animate={{
          y: [0, -50, 0],
          x: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-[#ff5151]/10 rounded-full blur-[120px]"
      />
      
      <motion.div
        animate={{
          y: [0, 50, 0],
          x: [0, -40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-[#ff933b]/10 rounded-full blur-[120px]"
      />

      <motion.div
        animate={{
          y: [0, -20, 0],
          x: [0, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff5151]/5 rounded-full blur-[100px]"
      />

      {/* Static gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080c1f] via-transparent to-transparent opacity-80" />
    </div>
  )
}
