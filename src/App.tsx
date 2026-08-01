import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Cpu,
  Wrench,
  Globe,
  BookOpen,
  Users,
  Rocket,
  CreditCard,
  User,
  Settings,
  Menu,
  X,
  Sparkles,
  Layers,
  Terminal,
  Activity,
} from "lucide-react";

// Component imports
import Dashboard from "./components/Dashboard";
import AIWorkspace from "./components/AIWorkspace";
import ProjectGenerator from "./components/ProjectGenerator";
import DeveloperToolbox from "./components/DeveloperToolbox";
import APIHub from "./components/APIHub";
import LearningCenter from "./components/LearningCenter";
import Community from "./components/Community";
import LaunchCenter from "./components/LaunchCenter";
import Pricing from "./components/Pricing";
import UserProfile from "./components/UserProfile";
import SettingsComponent from "./components/Settings";
import IntroScreen from "./components/IntroScreen";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return <IntroScreen onComplete={() => setShowIntro(false)} />;
  }

  // Tab definitions
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, category: "Core" },
    { id: "ai-workspace", label: "AI Workspace", icon: Cpu, category: "Core" },
    { id: "project-gen", label: "Scaffold Generator", icon: Sparkles, category: "Core" },
    { id: "toolbox", label: "Dev Toolbox", icon: Wrench, category: "Utilities" },
    { id: "api-hub", label: "API Registry", icon: Globe, category: "Utilities" },
    { id: "learning", label: "Learning Center", icon: BookOpen, category: "Growth" },
    { id: "community", label: "Developers Forum", icon: Users, category: "Growth" },
    { id: "launch", label: "Launch Pad", icon: Rocket, category: "DevOps" },
    { id: "pricing", label: "SaaS Billing", icon: CreditCard, category: "DevOps" },
    { id: "profile", label: "Dev Portfolio", icon: User, category: "Account" },
    { id: "settings", label: "Preferences", icon: Settings, category: "Account" }
  ];

  const categories = ["Core", "Utilities", "Growth", "DevOps", "Account"];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveTab} />;
      case "ai-workspace":
        return <AIWorkspace />;
      case "project-gen":
        return <ProjectGenerator />;
      case "toolbox":
        return <DeveloperToolbox />;
      case "api-hub":
        return <APIHub />;
      case "learning":
        return <LearningCenter />;
      case "community":
        return <Community />;
      case "launch":
        return <LaunchCenter />;
      case "pricing":
        return <Pricing />;
      case "profile":
        return <UserProfile />;
      case "settings":
        return <SettingsComponent />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  const getActiveTabTitle = () => {
    const tab = tabs.find(t => t.id === activeTab);
    return tab ? tab.label : "Dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-indigo-500/20 overflow-hidden">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-slate-950/80 backdrop-blur-md z-30 relative h-screen">
        {/* Sidebar Brand header */}
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow shadow-indigo-500/20 shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-sans font-bold tracking-tight text-slate-100 text-sm">StackVerse Hub</h1>
            <p className="font-mono text-[9px] text-slate-500 tracking-wider uppercase">SaaS DEVELOPER ENGINE</p>
          </div>
        </div>

        {/* Sidebar Navigation items */}
        <div className="flex-grow overflow-y-auto p-4 space-y-5">
          {categories.map((cat) => (
            <div key={cat} className="space-y-1.5">
              <span className="text-[9px] font-mono font-bold uppercase text-slate-500 tracking-wider px-2">
                {cat}
              </span>
              <div className="space-y-0.5">
                {tabs
                  .filter((t) => t.category === cat)
                  .map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition-all text-xs cursor-pointer ${
                          isActive
                            ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                            : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                      >
                        <Icon className={`h-4.5 w-4.5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                        <span className="font-semibold">{tab.label}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* User context footer */}
        <SidebarUserFooter />
      </aside>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            {/* Menu container */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-slate-950 border-r border-white/5 z-50 p-5 flex flex-col justify-between lg:hidden"
            >
              <div className="space-y-6 flex-grow overflow-y-auto">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-indigo-500" />
                    <span className="font-bold text-sm text-slate-200">StackVerse Hub</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded bg-slate-900 border border-white/5">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {categories.map((cat) => (
                    <div key={cat} className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">{cat}</span>
                      <div className="space-y-0.5">
                        {tabs
                          .filter((t) => t.category === cat)
                          .map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                              <button
                                key={tab.id}
                                onClick={() => {
                                  setActiveTab(tab.id);
                                  setIsMobileMenuOpen(false);
                                }}
                                className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition-all text-xs cursor-pointer ${
                                  isActive ? "bg-indigo-600/10 text-indigo-400" : "text-slate-400 hover:text-slate-200"
                                }`}
                              >
                                <Icon className="h-4.5 w-4.5" />
                                <span>{tab.label}</span>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Workspace Frame container */}
      <div className="flex-grow flex flex-col min-w-0 h-screen relative z-10">
        
        {/* Core Header */}
        <header className="h-16 border-b border-white/5 bg-slate-950/40 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-900 border border-white/5 text-slate-300"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
            <div className="space-y-0.5">
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wide font-mono flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                {getActiveTabTitle()}
              </h2>
            </div>
          </div>

          {/* Infrastructure Health Indicator */}
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-slate-900/80 border border-white/5 rounded-lg text-slate-400">
              <Activity className="h-3.5 w-3.5 text-indigo-400" />
              <span>PROXY STAGE: ACTIVE (PORT 3000)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>READY</span>
            </div>
          </div>
        </header>

        {/* Content viewport area */}
        <main className="flex-grow p-6 overflow-y-auto relative h-[calc(100vh-64px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderActiveComponent()}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

    </div>
  );
}

// Sidebar User Footer Helper Component
function SidebarUserFooter() {
  return (
    <div className="p-4 border-t border-white/5 bg-slate-950/40">
      <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/40 border border-white/5">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
          alt="Avatar"
          className="h-8 w-8 rounded-lg object-cover border border-indigo-500/30"
          referrerPolicy="no-referrer"
        />
        <div className="truncate flex-grow">
          <p className="text-xs font-bold text-slate-200 truncate">eniolaayobamidele0</p>
          <span className="text-[9px] font-mono text-indigo-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Developer Mode
          </span>
        </div>
      </div>
    </div>
  );
}
