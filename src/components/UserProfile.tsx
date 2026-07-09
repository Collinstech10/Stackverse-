import React, { useState } from "react";
import { motion } from "motion/react";
import { useUser } from "@clerk/clerk-react";
import {
  Trophy,
  Sparkles,
  GitPullRequest,
  BookOpen,
  Code2,
  Calendar,
  Layers,
  Award,
  Star,
  Cpu,
  Bookmark,
  CheckCircle,
  ExternalLink
} from "lucide-react";

export default function UserProfile({ isClerkConfigured = false }: { isClerkConfigured?: boolean }) {
  if (isClerkConfigured) {
    return <ClerkUserProfileWrapper />;
  }
  
  return (
    <UserProfileContent 
      username="eniolaayobamidele0" 
      avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
      email="Senior Developer & SaaS Founder"
    />
  );
}

function ClerkUserProfileWrapper() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <UserProfileContent 
        username="Guest Developer" 
        avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
        email="Guest Preview Mode"
      />
    );
  }

  const username = user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "Developer";
  const avatarUrl = user?.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";
  const email = user?.primaryEmailAddress?.emailAddress || "no-email@clerk.dev";

  return <UserProfileContent username={username} avatarUrl={avatarUrl} email={email} />;
}

function UserProfileContent({ username, avatarUrl, email }: { username: string; avatarUrl: string; email: string }) {
  const [activeTab, setActiveTab] = useState<"contributions" | "badges" | "courses">("contributions");

  // Simulated GitHub Contribution Grid data (52 weeks x 7 days)
  // Let's generate a realistic-looking mini grid representing recent pushes
  const contributionGrid = Array.from({ length: 24 }, () =>
    Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
  );

  const badges = [
    { id: "b1", name: "SaaS Pioneer", desc: "Successfully scaffolded first comprehensive PRD workspace", icon: "🚀", color: "text-indigo-400 bg-indigo-500/10" },
    { id: "b2", name: "Security Marshal", desc: "Decoded and verified cryptographic JWT signatures", icon: "🛡️", color: "text-emerald-400 bg-emerald-500/10" },
    { id: "b3", name: "Compiler Master", desc: "Completed 100% assertions on Algorithmic test stubs", icon: "💻", color: "text-amber-400 bg-amber-500/10" },
    { id: "b4", name: "Algorithmic Archmage", desc: "Earned more than 2000 total workspace experience XP", icon: "🔮", color: "text-rose-400 bg-rose-500/10" }
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* Portfolio Card Header */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <img
            src={avatarUrl}
            alt="Profile Avatar"
            className="h-20 w-20 rounded-2xl border-2 border-indigo-500 object-cover shadow-lg"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <h2 className="text-xl font-bold font-display text-slate-100">{username}</h2>
              <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase">
                Enterprise Architect
              </span>
            </div>
            <p className="text-xs text-slate-400 font-display">{email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-1">
              {["TypeScript", "React 19", "Express", "PostgreSQL", "Gemini AI"].map((tag) => (
                <span key={tag} className="text-[9px] font-mono font-bold bg-slate-950 border border-white/5 px-2 py-0.5 rounded text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 self-center md:self-auto shrink-0 font-display">
          <div className="text-center p-3.5 bg-slate-950/40 border border-white/5 rounded-2xl">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Completed</span>
            <span className="text-xl font-bold text-indigo-400 block">14 Tools</span>
          </div>
          <div className="text-center p-3.5 bg-slate-950/40 border border-white/5 rounded-2xl">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Workspace XP</span>
            <span className="text-xl font-bold text-indigo-400 block">2,450 XP</span>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="flex border-b border-white/5 bg-slate-950/20 px-4">
        {[
          { id: "contributions", label: "Commit Stream", icon: Calendar },
          { id: "badges", label: "Badges Cabinet", icon: Award },
          { id: "courses", label: "Curricula Metrics", icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-3 border-b-2 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Contributions */}
      {activeTab === "contributions" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Matrix */}
          <div className="lg:col-span-8 glass-panel p-6 rounded-3xl space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-slate-100 font-display">Workspace contribution map</h3>
              <p className="text-xs text-slate-400">Aggregated compilation triggers and git push schedules over last 24 weeks</p>
            </div>

            {/* Matrix Board */}
            <div className="overflow-x-auto pt-2">
              <div className="flex gap-1 min-w-[340px]">
                {contributionGrid.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1">
                    {week.map((day, dIdx) => {
                      let color = "bg-slate-900 border-white/5";
                      if (day === 1) color = "bg-emerald-950 border-emerald-900/40";
                      if (day === 2) color = "bg-emerald-800 border-emerald-700/40";
                      if (day === 3) color = "bg-emerald-600 border-emerald-500/40";
                      if (day === 4) color = "bg-emerald-400 border-emerald-300/40";

                      return (
                        <div
                          key={dIdx}
                          className={`h-3 w-3 rounded-[2px] border ${color}`}
                          title={`Contributions: ${day}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>Less</span>
              <div className="flex gap-1 items-center">
                <div className="h-2.5 w-2.5 rounded-[2px] bg-slate-900 border border-white/5" />
                <div className="h-2.5 w-2.5 rounded-[2px] bg-emerald-950" />
                <div className="h-2.5 w-2.5 rounded-[2px] bg-emerald-800" />
                <div className="h-2.5 w-2.5 rounded-[2px] bg-emerald-600" />
                <div className="h-2.5 w-2.5 rounded-[2px] bg-emerald-400" />
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Pinned repos */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pinned Repositories</h3>
            
            <div className="space-y-3">
              {[
                { name: "stackverse-gateway", desc: "High throughput CORS secure Express routers", stars: 42, language: "TypeScript" },
                { name: "prisma-composite-helper", desc: "Automate composite index migrations", stars: 18, language: "Rust" }
              ].map((repo) => (
                <div key={repo.name} className="p-4 rounded-2xl bg-slate-950 border border-white/5 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-200">{repo.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1.5 leading-normal">{repo.desc}</p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-3 border-t border-white/5 mt-3">
                    <span className="flex items-center gap-1 text-indigo-400 font-bold">{repo.language}</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-500 stroke-amber-500" />
                      {repo.stars} stars
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Badges */}
      {activeTab === "badges" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div key={badge.id} className="glass-panel p-5 rounded-3xl space-y-4 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="text-2xl">{badge.icon}</div>
                <span className="text-[8px] font-mono font-bold bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                  VERIFIED
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-slate-200">{badge.name}</h4>
                <p className="text-[11px] text-slate-400 leading-normal">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Courses */}
      {activeTab === "courses" && (
        <div className="glass-panel p-6 rounded-3xl space-y-4 max-w-3xl">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-bold text-sm text-slate-100 font-display">Curricula Milestones progress</h3>
            <p className="text-xs text-slate-400">Track finished tracks and checkpoint completion status</p>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { name: "Advanced React 19 & Compiler Optimization", progress: 66, status: "Active" },
              { name: "Vector Databases & Semantic Embeddings", progress: 0, status: "Locked" },
              { name: "Agentic Engineering Workflows", progress: 0, status: "Locked" }
            ].map((course) => (
              <div key={course.name} className="p-4 bg-slate-950 border border-white/5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">{course.name}</span>
                  <span className="text-indigo-400 font-semibold font-mono">{course.progress}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600" style={{ width: `${course.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
