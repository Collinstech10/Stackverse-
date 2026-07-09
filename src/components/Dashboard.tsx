import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  Activity,
  Calendar,
  Layers,
  Sparkles,
  Terminal,
  Bell,
  CheckSquare,
  Plus,
  Play,
  TrendingUp,
  Cpu,
  RefreshCw,
  FolderOpen,
  ArrowRight,
  Bookmark,
  CheckCircle,
  X,
} from "lucide-react";
import {
  getStoredXP,
  addXP,
  getStoredTokens,
  addTokens,
  getStoredProjects,
  saveStoredProjects,
  getStoredTasks,
  saveStoredTasks,
  getStoredCalendar,
  saveStoredCalendar,
  DEMO_PROJECTS,
  DEMO_TASKS,
  DEMO_CALENDAR,
  Project,
  Task,
  CalendarEvent,
} from "../utils/workspace";
import { useToast } from "./ToastContext";

interface DashboardProps {
  onNavigate: (page: any) => void;
  onSelectProjectTemplate?: (template: string) => void;
}

export default function Dashboard({ onNavigate, onSelectProjectTemplate }: DashboardProps) {
  const toast = useToast();

  // Load from localStorage via our dynamic workspace storage system
  const [projects, setProjects] = useState<Project[]>(() => getStoredProjects());
  const [tasks, setTasks] = useState<Task[]>(() => getStoredTasks());
  const [calendarEvents, setCalendarEvents] = useState<Record<string, CalendarEvent[]>>(() => getStoredCalendar());

  const [xp, setXp] = useState(() => getStoredXP());
  const [tokens, setTokens] = useState(() => getStoredTokens());

  // Interactivity state
  const [newProjName, setNewProjName] = useState("");
  const [newProjTech, setNewProjTech] = useState("React, Tailwind");
  const [showAddProj, setShowAddProj] = useState(false);

  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");

  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>("2026-07-08");
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("12:00");
  const [newEventDate, setNewEventDate] = useState("2026-07-08");

  // Sync state between pages (e.g. Project Generator updates projects list)
  useEffect(() => {
    const handleSync = () => {
      setProjects(getStoredProjects());
      setXp(getStoredXP());
      setTokens(getStoredTokens());
    };
    window.addEventListener("stackverse_projects_update", handleSync);
    window.addEventListener("stackverse_xp_update", handleSync);
    window.addEventListener("stackverse_token_update", handleSync);
    return () => {
      window.removeEventListener("stackverse_projects_update", handleSync);
      window.removeEventListener("stackverse_xp_update", handleSync);
      window.removeEventListener("stackverse_token_update", handleSync);
    };
  }, []);

  // Save changes to storage whenever states are modified
  useEffect(() => {
    saveStoredProjects(projects);
  }, [projects]);

  useEffect(() => {
    saveStoredTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveStoredCalendar(calendarEvents);
  }, [calendarEvents]);

  // Demo Template loading
  const handleLoadDemoData = () => {
    setProjects(DEMO_PROJECTS);
    setTasks(DEMO_TASKS);
    setCalendarEvents(DEMO_CALENDAR);
    
    // Add nice starting XP and token usage to demo the graphs
    const extraXP = addXP(2450);
    const extraTokens = addTokens(365200);
    setXp(extraXP);
    setTokens(extraTokens);

    toast.success("Demo templates loaded", "Successfully populated your sandbox with simulated metrics and pipelines.");
  };

  const handleClearWorkspace = () => {
    setProjects([]);
    setTasks([]);
    setCalendarEvents({});
    localStorage.removeItem("stackverse_xp");
    localStorage.removeItem("stackverse_token_usage");
    setXp(0);
    setTokens(0);
    toast.info("Workspace Reset", "Pristine developer playground state restored.");
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName) return;
    const newProj: Project = {
      id: "p_" + Date.now(),
      name: newProjName.toLowerCase().replace(/\s+/g, "-"),
      status: "Deployed",
      tech: newProjTech,
      commits: 1,
      lastDeployed: "Just now",
    };
    const updated = [newProj, ...projects];
    setProjects(updated);
    setNewProjName("");
    setShowAddProj(false);
    
    // Gain XP
    const nextXp = addXP(150);
    setXp(nextXp);
    toast.success("Project generated", `Successfully provisioned pipeline for "${newProj.name}"! (+150 XP)`);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText) return;
    const newTask: Task = {
      id: "t_" + Date.now(),
      text: newTaskText,
      done: false,
      priority: newTaskPriority,
    };
    setTasks([...tasks, newTask]);
    setNewTaskText("");

    // Gain XP
    const nextXp = addXP(50);
    setXp(nextXp);
    toast.success("Task Created", "New checklist item registered successfully. (+50 XP)");
  };

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map((t) => {
      if (t.id === id) {
        const nextDone = !t.done;
        if (nextDone) {
          const nextXp = addXP(100);
          setXp(nextXp);
          toast.success("Task Completed", `Scrum task item cleared! (+100 XP)`);
        }
        return { ...t, done: nextDone };
      }
      return t;
    });
    setTasks(updatedTasks);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle) return;
    const list = calendarEvents[newEventDate] || [];
    const updatedEvents = {
      ...calendarEvents,
      [newEventDate]: [...list, { title: newEventTitle, time: newEventTime, type: "manual" }],
    };
    setCalendarEvents(updatedEvents);
    setNewEventTitle("");

    // Gain XP
    const nextXp = addXP(75);
    setXp(nextXp);
    toast.success("Milestone Scheduled", "Release milestone successfully mapped to calendar. (+75 XP)");
  };

  // Sample analytics data dynamically scaling based on activity
  const apiTrafficData = [
    { name: "Mon", requests: projects.length > 0 ? 1200 : 0, latency: projects.length > 0 ? 45 : 0 },
    { name: "Tue", requests: projects.length > 0 ? 1850 : 0, latency: projects.length > 0 ? 42 : 0 },
    { name: "Wed", requests: projects.length > 0 ? 2400 : 0, latency: projects.length > 0 ? 38 : 0 },
    { name: "Thu", requests: projects.length > 0 ? 3100 : 0, latency: projects.length > 0 ? 40 : 0 },
    { name: "Fri", requests: projects.length > 0 ? 2900 : 0, latency: projects.length > 0 ? 41 : 0 },
    { name: "Sat", requests: projects.length > 0 ? 1500 : 0, latency: projects.length > 0 ? 35 : 0 },
    { name: "Sun", requests: projects.length > 0 ? 2100 + (projects.length * 300) : 0, latency: projects.length > 0 ? 39 : 0 },
  ];

  const aiUsageData = [
    { name: "Workspace", tokens: tokens > 0 ? Math.floor(tokens * 0.23) : 0 },
    { name: "Project Gen", tokens: tokens > 0 ? Math.floor(tokens * 0.39) : 0 },
    { name: "API Docs", tokens: tokens > 0 ? Math.floor(tokens * 0.12) : 0 },
    { name: "Toolbox", tokens: tokens > 0 ? Math.floor(tokens * 0.07) : 0 },
    { name: "Learning", tokens: tokens > 0 ? Math.floor(tokens * 0.19) : 0 },
  ];

  // State: System Logs
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "Initialize StackVerse container on port :3000",
    "Loaded secure Gemini-3.5-flash AI proxy service",
    "Prisma schema successfully migrated to local PostgreSQL mirror",
    "Build job for project [stripe-bento-checkout] started",
    "API Gateway listening on standard incoming pipelines",
  ]);

  useEffect(() => {
    const logs = [
      "Auto-scaling group generated 1 new server node",
      "Git Push detected from eniolaayobamidele0 -> main branch",
      "Lighthouse SEO score recalculated to 98/100",
      "SSL certification renewed for *.stackverse.io",
      "Cache invalidated successfully for API Hub documentation",
    ];
    const interval = setInterval(() => {
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setSystemLogs(prev => [randomLog, ...prev.slice(0, 7)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Active Deployments",
            value: projects.length.toString(),
            change: projects.length === 0 ? "No active pipelines" : `+${projects.filter(p => p.status === "Deployed").length} live nodes`,
            icon: Layers,
            color: "text-indigo-400"
          },
          {
            label: "AI API Token Usage",
            value: tokens > 0 ? `${(tokens / 1000).toFixed(1)}k` : "0",
            change: tokens === 0 ? "Fresh quota available" : `${Math.min(100, Math.round((tokens / 1000000) * 100))}% of monthly quota`,
            icon: Sparkles,
            color: "text-violet-400"
          },
          {
            label: "Developer Workspace XP",
            value: `${xp.toLocaleString()} XP`,
            change: `Level ${Math.floor(xp / 500) + 1} Sandbox Arch-Mage`,
            icon: Cpu,
            color: "text-amber-400"
          },
          {
            label: "Gateway Status",
            value: projects.length === 0 ? "Inactive" : "99.98%",
            change: projects.length === 0 ? "No active sandbox gate" : "Healthy (14ms latency)",
            icon: Activity,
            color: "text-emerald-400"
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={item.label}
              className="glass-panel p-5 rounded-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">{item.label}</p>
                  <p className="text-2xl font-bold font-display mt-1 text-slate-100">{item.value}</p>
                </div>
                <div className={`p-2 rounded-xl bg-slate-900/60 ${item.color} border border-slate-800`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-slate-400 gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${projects.length > 0 ? "bg-emerald-500" : "bg-slate-600"}`} />
                {item.change}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Grid: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* API Traffic Chart */}
        <div className="glass-panel p-5 rounded-2xl lg:col-span-8 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-400" />
                API Traffic & Gateway Latency
              </h3>
              <p className="text-xs text-slate-400">Aggregated metric stream of production server gateways</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={apiTrafficData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Area type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRequests)" name="Requests" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Usage Breakdown */}
        <div className="glass-panel p-5 rounded-2xl lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-100 flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-violet-400" />
              AI Ecosystem Usage
            </h3>
            <p className="text-xs text-slate-400 mb-4">Total Tokens consumed per ecosystem module</p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aiUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                />
                <Bar dataKey="tokens" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Tokens Used">
                  {aiUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#6366f1" : "#a78bfa"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
            <Cpu className="h-3 w-3 text-slate-400" />
            Active Model: <span className="text-violet-300 font-semibold font-mono">gemini-3.5-flash</span>
          </div>
        </div>
      </div>

      {/* Workspace Management Bar (Visible only when empty or to reset state) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-indigo-950/20 border border-indigo-500/15 rounded-2xl">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-display">Sandbox Playground Controller</h4>
          <p className="text-[11px] text-slate-400">Pristine account state enabled. Switch between empty live slate and demo datasets.</p>
        </div>
        <div className="flex gap-2">
          {projects.length > 0 && (
            <button
              onClick={handleClearWorkspace}
              className="px-3.5 py-2 bg-slate-900 border border-white/5 hover:bg-slate-800 hover:border-rose-500/30 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Reset to Clean State
            </button>
          )}
          {projects.length === 0 && (
            <button
              onClick={handleLoadDemoData}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              Load Demo Template Workspace
            </button>
          )}
        </div>
      </div>

      {/* Grid: Projects & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Projects List */}
        <div className="glass-panel p-5 rounded-2xl lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-indigo-400" />
                  Active Workspace Projects
                </h3>
                <p className="text-xs text-slate-400">Develop and trace active SaaS structures</p>
              </div>
              <button
                onClick={() => setShowAddProj(!showAddProj)}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Project
              </button>
            </div>

            {showAddProj && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                onSubmit={handleAddProject}
                className="mb-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Project Name</label>
                    <input
                      type="text"
                      placeholder="my-saas-platform"
                      value={newProjName}
                      onChange={(e) => setNewProjName(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Tech Stack</label>
                    <input
                      type="text"
                      placeholder="React, Tailwind, Express"
                      value={newProjTech}
                      onChange={(e) => setNewProjTech(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProj(false)}
                    className="text-xs px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    Provision Project
                  </button>
                </div>
              </motion.form>
            )}

            {projects.length === 0 ? (
              <div className="py-12 text-center bg-slate-900/20 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-4">
                <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400">
                  <FolderOpen className="h-8 w-8 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 font-display">No active sandbox projects yet</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                    Your fresh sandbox is ready. Synthesize a structure in our AI Generator or load templates.
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => onNavigate("project-generator")}
                    className="text-xs px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer transition-all shadow-md"
                  >
                    Open AI Generator
                  </button>
                  <button
                    onClick={handleLoadDemoData}
                    className="text-xs px-4 py-2 bg-slate-900 border border-white/5 hover:border-indigo-500/30 text-slate-300 rounded-xl font-semibold cursor-pointer transition-all"
                  >
                    Load Demo Data
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-200 group-hover:text-indigo-400 transition-colors">
                          {proj.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-white/5">
                          {proj.tech}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{proj.commits} commits</span>
                        <span>•</span>
                        <span>Deploys: {proj.lastDeployed}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                          proj.status === "Deployed" || proj.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : proj.status === "Building"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
                            : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                        }`}
                      >
                        {proj.status}
                      </span>
                      <button
                        onClick={() => onNavigate("project-generator")}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white transition-all"
                        title="Manage or generate more details"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer" onClick={() => onNavigate("project-generator")}>
            <span className="flex items-center gap-1">
              Create modular structures in the AI Project Generator
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        {/* Interactive Kanban Board Tasks */}
        <div className="glass-panel p-5 rounded-2xl lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-100 flex items-center gap-2 mb-1">
              <CheckSquare className="h-4 w-4 text-indigo-400" />
              Interactive Kanban Checklist
            </h3>
            <p className="text-xs text-slate-400 mb-4">Track task checklists or active Scrum backlogs</p>

            <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="New task title..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="flex-grow text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="text-xs px-2 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Med</option>
                <option value="Low">Low</option>
              </select>
              <button
                type="submit"
                className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer animate-pulse"
              >
                <Plus className="h-4 w-4" />
              </button>
            </form>

            {tasks.length === 0 ? (
              <div className="py-12 text-center bg-slate-900/20 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-4">
                <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400">
                  <CheckSquare className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 font-display">Your backlog is clear</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                    All pipelines synchronized. Register a custom task above to begin tracking milestones.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="p-3 rounded-xl bg-slate-950/40 border border-white/5 hover:border-white/10 transition-all flex items-center gap-3 cursor-pointer group"
                  >
                    <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition-all ${
                      task.done ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-700 hover:border-indigo-500"
                    }`}>
                      {task.done && <CheckCircle className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-grow">
                      <p className={`text-xs ${task.done ? "line-through text-slate-500" : "text-slate-200"}`}>
                        {task.text}
                      </p>
                    </div>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      task.priority === "High"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : task.priority === "Medium"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-500 flex justify-between">
            <span>{tasks.filter(t => t.done).length} completed</span>
            <span>{tasks.filter(t => !t.done).length} active</span>
          </div>
        </div>
      </div>

      {/* Grid: Calendar & Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Releases Calendar */}
        <div className="glass-panel p-5 rounded-2xl lg:col-span-5">
          <h3 className="font-semibold text-slate-100 flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-indigo-400" />
            Interactive Releases Calendar
          </h3>
          <p className="text-xs text-slate-400 mb-4">View scheduled milestones and register sync deadlines</p>

          <div className="grid grid-cols-2 gap-4">
            {/* Calendar list */}
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {Object.keys(calendarEvents).sort().map((dateStr) => (
                <div
                  key={dateStr}
                  onClick={() => setSelectedCalendarDate(dateStr)}
                  className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                    selectedCalendarDate === dateStr
                      ? "bg-indigo-600/20 border-indigo-500"
                      : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <p className="text-xs font-semibold text-indigo-400">{dateStr}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {calendarEvents[dateStr].length} events registered
                  </p>
                </div>
              ))}
            </div>

            {/* Selected Date Details */}
            <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-300 border-b border-white/5 pb-1 mb-2">
                  {selectedCalendarDate} Events
                </p>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {calendarEvents[selectedCalendarDate]?.length > 0 ? (
                    calendarEvents[selectedCalendarDate].map((ev, i) => (
                      <div key={i} className="text-[10px] p-1.5 rounded bg-slate-900 border border-white/5">
                        <span className="font-mono text-indigo-400 font-semibold block">{ev.time}</span>
                        <p className="text-slate-300 font-medium leading-tight">{ev.title}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-slate-500">No events registered</p>
                  )}
                </div>
              </div>

              <form onSubmit={handleAddEvent} className="mt-3 space-y-1.5">
                <input
                  type="text"
                  placeholder="Sync task..."
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full text-[10px] px-2 py-1 bg-slate-950 border border-slate-800 rounded text-slate-200"
                />
                <div className="flex gap-1">
                  <input
                    type="text"
                    placeholder="15:00"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-1/2 text-[10px] px-2 py-1 bg-slate-950 border border-slate-800 rounded text-slate-200"
                  />
                  <button
                    type="submit"
                    className="w-1/2 text-[10px] bg-indigo-600 hover:bg-indigo-500 rounded text-white"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Active Operations Logs */}
        <div className="glass-panel p-5 rounded-2xl lg:col-span-7 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-100 flex items-center gap-2 mb-1">
              <Terminal className="h-4 w-4 text-emerald-400" />
              Active Operations Logs
            </h3>
            <p className="text-xs text-slate-400 mb-4">Simulated telemetry of server processes and build pipelines</p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2 h-44 overflow-y-auto">
              {systemLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold select-none">&gt;</span>
                  <span className={idx === 0 ? "text-emerald-400 font-semibold animate-pulse" : ""}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Server Listening on PORT 3000</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
