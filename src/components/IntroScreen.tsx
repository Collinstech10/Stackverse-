import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Terminal, Cpu } from "lucide-react";
// @ts-ignore
import companyLogo from "../assets/images/stackverse_logo_1783604713811.jpg";

interface IntroScreenProps {
  onComplete: () => void;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing Core Systems...");

  // Progress counter simulation
  useEffect(() => {
    const duration = 2800; // total animation time in ms
    const intervalTime = 30;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Stagger loading messages for immersion
  useEffect(() => {
    const textTimer1 = setTimeout(() => setLoadingText("Synchronizing Neural Clusters..."), 700);
    const textTimer2 = setTimeout(() => setLoadingText("Loading StackVerse Sandboxes..."), 1400);
    const textTimer3 = setTimeout(() => setLoadingText("Optimizing GPU Shaders..."), 2100);
    const textTimer4 = setTimeout(() => setLoadingText("Authentication Handshake Ready."), 2600);

    return () => {
      clearTimeout(textTimer1);
      clearTimeout(textTimer2);
      clearTimeout(textTimer3);
      clearTimeout(textTimer4);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      {/* Immersive Cosmic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: "12s" }} />
        
        {/* Soft Grid Overlay */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" 
          style={{ maskImage: "radial-gradient(circle at center, black 40%, transparent 100%)", WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 100%)" }}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center max-w-lg px-6 text-center">
        {/* Animated Logo Shield */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, rotate: -5 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 70,
            damping: 15,
            delay: 0.2
          }}
          className="relative group mb-8"
        >
          {/* Logo Outer Halo Glow */}
          <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-[32px] blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />
          
          <div className="relative h-44 w-44 sm:h-48 sm:w-48 bg-slate-900 border border-white/10 rounded-[30px] p-1.5 flex items-center justify-center overflow-hidden shadow-2xl">
            {/* Subtle rotating inner background ring */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-900/40 to-slate-900" />
            
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ 
                scale: [0.95, 1.02, 0.95],
                rotate: [0, 1, -1, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              src={companyLogo}
              alt="StackVerse Logo"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover rounded-[24px] shadow-inner relative z-10"
            />
          </div>
        </motion.div>

        {/* Brand Text Reveal */}
        <div className="space-y-2 mb-10 overflow-hidden">
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.6 }}
            className="text-3xl sm:text-4xl font-extrabold font-display tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-indigo-100 to-slate-200"
          >
            STACKVERSE
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="text-[11px] sm:text-xs font-mono tracking-[0.25em] text-indigo-300 uppercase"
          >
            SaaS Developer Engine
          </motion.p>
        </div>

        {/* Loading HUD Interface */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="w-64 sm:w-72 space-y-3"
        >
          {/* Progress Bar Container */}
          <div className="h-[5px] w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 rounded-full"
              style={{ width: `${progress}%` }}
              layoutId="progressBar"
            />
          </div>

          {/* Status Indicators */}
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 px-0.5">
            <span className="flex items-center gap-1.5">
              <Terminal className="h-3 w-3 text-indigo-400 animate-pulse" />
              {loadingText}
            </span>
            <span className="font-bold text-slate-400">{Math.round(progress)}%</span>
          </div>
        </motion.div>
      </div>

      {/* Skip Button - positioned elegantly in the bottom right corner */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        whileHover={{ opacity: 0.8, scale: 1.05 }}
        onClick={onComplete}
        className="absolute bottom-6 right-6 px-4 py-2 border border-white/10 hover:border-white/20 bg-white/5 rounded-xl text-[10px] font-mono tracking-widest uppercase text-slate-400 hover:text-white transition cursor-pointer z-50 flex items-center gap-1.5"
      >
        Skip System Intro
      </motion.button>
    </div>
  );
}
