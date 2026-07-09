import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Terminal,
  Layers,
  FolderTree,
  FileText,
  ListTodo,
  Calendar,
  ChevronRight,
  ChevronDown,
  Download,
  Plus,
  RefreshCw,
  Cpu,
  Bookmark,
  CheckCircle,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { ProjectBlueprint } from "../types";

// Recursive File Tree Node Renderer
interface TreeNodeProps {
  key?: string;
  name: string;
  value: any;
  depth: number;
}

function FileTreeNode({ name, value, depth }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = typeof value === "object" && value !== null;

  return (
    <div className="select-none font-mono text-xs">
      <div
        onClick={() => isFolder && setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 py-1 px-2 rounded-lg transition-colors cursor-pointer ${
          isFolder ? "text-indigo-300 hover:bg-white/5" : "text-slate-400"
        }`}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
      >
        {isFolder ? (
          <>
            {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            <span className="font-semibold">📁 {name}</span>
          </>
        ) : (
          <>
            <span className="w-3.5" />
            <span>📄 {name}</span>
            <span className="text-[10px] text-slate-500 italic ml-2">({value})</span>
          </>
        )}
      </div>

      {isFolder && isOpen && (
        <div className="space-y-0.5">
          {Object.entries(value).map(([childName, childValue]) => (
            <FileTreeNode
              key={childName}
              name={childName}
              value={childValue}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectGenerator() {
  const [projectIdea, setProjectIdea] = useState("");
  const [projectPlatform, setProjectPlatform] = useState("Full-stack SaaS");
  const [techPreferences, setTechPreferences] = useState("React 19, TypeScript, PostgreSQL, Gemini API");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"architecture" | "tree" | "prd" | "stories" | "roadmap">("architecture");

  // State: Currently active generated project blueprint
  const [blueprint, setBlueprint] = useState<ProjectBlueprint | null>({
    title: "StackVerse Launcher",
    tagline: "Build the Digital Universe, One Stack at a Time.",
    description: "A centralized sandbox orchestration and AI project-generation platform built for rapid developers. Combines automated structural scaffolding, mock databases, and telemetry-aware workspace managers to bootstrap standard SaaS apps in seconds.",
    techStack: [
      { name: "React 19 + Vite", category: "Frontend Framework", reason: "Ultra-fast developer feedback loop and direct rendering." },
      { name: "Express + Node.js", category: "Backend Engine", reason: "Lightweight, robust server capable of proxying secure APIs and managing websocket channels." },
      { name: "PostgreSQL with Prisma", category: "Database ORM", reason: "Provides ACID compliance, relational schemas, type-safe migrations, and scalable querying." },
      { name: "Google Gemini-3.5-flash", category: "AI Capability", reason: "Lightning-fast and highly competent JSON schema generation and technical chat orchestration." }
    ],
    folderStructure: {
      "package.json": "Workspace configuration & project metadata",
      "tsconfig.json": "TypeScript module path parameters",
      "server.ts": "Main entry Express server",
      "src": {
        "main.tsx": "Vite client compiler",
        "App.tsx": "Primary layout node",
        "types.ts": "Global workspace types and contracts",
        "components": {
          "Dashboard.tsx": "Workspace telemetry cards",
          "AIWorkspace.tsx": "Gemini-powered chat engine",
          "DeveloperToolbox.tsx": "Comprehensive local utilities suite"
        },
        "db": {
          "schema.ts": "Prisma entity models",
          "connection.ts": "Drizzle/PostgreSQL pool manager"
        }
      }
    },
    prd: {
      overview: "Standard product requirements detailing the creation of a micro-service launcher pipeline.",
      targetAudience: ["Full-stack developers", "SaaS founders", "Tech leads"],
      features: [
        { title: "AI-Powered Project Synthesis", description: "Takes natural language inputs and outputs visual filesystems and blueprints.", priority: "P0" },
        { title: "Interactive Developer Tool Cabinet", description: "Provides JSON parsers, JWT decoders, QR generators, and CORS proxies.", priority: "P0" },
        { title: "Telemetry Operation Logs", description: "Streams sandbox gateway metrics and active builds.", priority: "P1" }
      ],
      nonFunctional: [
        "Response time for AI chat under 2.5 seconds.",
        "Total bundle size under 350KB Gzipped."
      ]
    },
    userStories: [
      "As a Developer, I want to describe my SaaS idea so that I can immediately view an appropriate filesystem scaffolding.",
      "As an Architect, I want to review the database indexing strategy so that our query execution overhead stays low."
    ],
    roadmap: [
      { milestone: "Phase 1: Architecture Blueprinting", duration: "1 week", tasks: ["Finalize folder architecture schemas", "Load Gemini-3.5-flash SDK connections"] },
      { milestone: "Phase 2: Core Tool Deployment", duration: "2 weeks", tasks: ["Deploy JSON and Regex utility engines", "Establish proxy channels"] }
    ]
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectIdea.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/gemini/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: projectIdea,
          platform: projectPlatform,
          techPreferences
        })
      });

      if (!response.ok) {
        throw new Error("Failed to compile project blueprint. Check API keys and server health.");
      }

      const data = await response.json();
      setBlueprint(data);
      setActiveTab("architecture");

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to generate project structure.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Export current blueprint as JSON
  const handleExportJSON = () => {
    if (!blueprint) return;
    const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${blueprint.title.toLowerCase().replace(/\s+/g, "-")}-blueprint.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Upper Panel: Form Wizard */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <Layers className="h-44 w-44" />
        </div>

        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="h-4.5 w-4.5" />
            <span>AI Scaffolding Engine</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-100">AI Project Scaffolder</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Generate high-fidelity, complete project specifications. Simply describe your software idea, specify your preferred tech nodes, and let Gemini compile a production blueprint complete with PRDs, user stories, architecture diagrams, and folder layouts.
          </p>

          <form onSubmit={handleGenerate} className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-semibold">Target Platform / Deployment Goal</label>
                <select
                  value={projectPlatform}
                  onChange={(e) => setProjectPlatform(e.target.value)}
                  className="w-full text-xs px-3.5 py-3 bg-slate-950 border border-white/5 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Full-stack SaaS (React + Express)">Full-stack SaaS (React + Express)</option>
                  <option value="Next.js 15 Web Application">Next.js 15 Web Application</option>
                  <option value="Mobile Application (React Native / iOS & Android)">Mobile Application (React Native)</option>
                  <option value="Secure Serverless API Hub (Node / Rust)">Secure Serverless API Hub</option>
                  <option value="E-Commerce Custom Storefront">E-Commerce Storefront</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-semibold">Stack Preferences / Constraints</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js 15, Prisma ORM, PostgreSQL, Tailwind v4"
                  value={techPreferences}
                  onChange={(e) => setTechPreferences(e.target.value)}
                  className="w-full text-xs px-3.5 py-3 bg-slate-950 border border-white/5 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1.5 font-semibold font-display">Product Description & Key Features</label>
              <textarea
                rows={3}
                placeholder="Describe your SaaS, mobile app, API suite, or portfolio. Be specific about features, database models, and design guidelines..."
                value={projectIdea}
                onChange={(e) => setProjectIdea(e.target.value)}
                className="w-full text-xs px-3.5 py-3.5 bg-slate-950 border border-white/5 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isGenerating}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                    <span>Compiling Architecture...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4.5 w-4.5" />
                    <span>Synthesize Workspace Blueprint</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Lower Panel: Render Blueprint */}
      {blueprint && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Main Visualizer Panel */}
          <div className="lg:col-span-8 glass-panel rounded-3xl overflow-hidden flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="px-6 py-4 bg-slate-900/60 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-indigo-400 text-xs uppercase font-mono tracking-wider">Active Blueprint</span>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">JSON Spec Approved</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 font-display">{blueprint.title}</h3>
                  <p className="text-xs text-slate-400 italic">{blueprint.tagline}</p>
                </div>

                <button
                  onClick={handleExportJSON}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-white/5 text-slate-300 hover:bg-slate-900 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-white/5 bg-slate-950/20 px-4">
                {[
                  { id: "architecture", label: "Tech Stack", icon: Layers },
                  { id: "tree", label: "Folder Tree", icon: FolderTree },
                  { id: "prd", label: "PRD Specs", icon: FileText },
                  { id: "stories", label: "Backlog / Stories", icon: ListTodo },
                  { id: "roadmap", label: "Gantt Roadmap", icon: Calendar },
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

              {/* Tab Contents */}
              <div className="p-6">
                {activeTab === "architecture" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-slate-300 leading-relaxed">
                      <p className="font-semibold text-indigo-400 mb-1">Architecture Overview:</p>
                      {blueprint.description}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {blueprint.techStack.map((tech) => (
                        <div
                          key={tech.name}
                          className="p-4 rounded-xl bg-slate-950/50 border border-white/5 flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                              {tech.category}
                            </span>
                            <h4 className="font-bold text-sm text-slate-100 mt-2">{tech.name}</h4>
                          </div>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tech.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "tree" && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 overflow-x-auto">
                    <p className="text-[10px] text-slate-500 font-mono mb-4 border-b border-white/5 pb-2">
                      ROOT DIRECTORY DIRECT MAP:
                    </p>
                    <div className="space-y-0.5">
                      {Object.entries(blueprint.folderStructure).map(([name, val]) => (
                        <FileTreeNode key={name} name={name} value={val} depth={0} />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "prd" && (
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Target Audience</h4>
                      <div className="flex flex-wrap gap-2">
                        {blueprint.prd.targetAudience.map((aud, i) => (
                          <span key={i} className="text-xs bg-slate-950 border border-white/5 px-2.5 py-1 rounded-lg text-slate-300">
                            🎯 {aud}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Feature Scopes</h4>
                      <div className="space-y-2">
                        {blueprint.prd.features.map((feat, i) => (
                          <div key={i} className="p-3 rounded-xl bg-slate-950/40 border border-white/5 flex items-start gap-3">
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border mt-0.5 ${
                              feat.priority === "P0"
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/25"
                                : feat.priority === "P1"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                                : "bg-indigo-500/10 text-indigo-400 border-indigo-500/25"
                            }`}>
                              {feat.priority}
                            </span>
                            <div className="space-y-0.5">
                              <h5 className="font-bold text-xs text-slate-200">{feat.title}</h5>
                              <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide font-display">Non-Functional Scopes</h4>
                      <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1">
                        {blueprint.prd.nonFunctional.map((nf, i) => (
                          <li key={i}>{nf}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "stories" && (
                  <div className="space-y-3">
                    {blueprint.userStories.map((story, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-slate-950/50 border border-white/5 flex items-start gap-3 hover:border-indigo-500/20 transition-all"
                      >
                        <div className="h-5 w-5 rounded bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-mono text-[10px] font-bold">
                          {i + 1}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-mono italic">
                          "{story}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "roadmap" && (
                  <div className="space-y-6 relative pl-4 border-l border-indigo-500/20 py-2">
                    {blueprint.roadmap.map((road, i) => (
                      <div key={i} className="relative space-y-2">
                        {/* Circle bullet */}
                        <div className="absolute -left-6.5 top-0 h-4.5 w-4.5 rounded-full bg-slate-950 border border-indigo-500 flex items-center justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                            ⏳ {road.duration}
                          </span>
                          <h4 className="font-bold text-sm text-slate-100 mt-1">{road.milestone}</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                          {road.tasks.map((task, tIdx) => (
                            <div key={tIdx} className="text-xs p-2.5 rounded-lg bg-slate-950/50 border border-white/5 flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                              <span className="text-slate-400">{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-900/40 border-t border-white/5 flex justify-between items-center text-xs text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <Cpu className="h-3.5 w-3.5" />
                SYSTEM: DYNAMIC SCAFFOLDER
              </span>
              <span>Workspace structure fully validated</span>
            </div>
          </div>

          {/* Quick Actions / Integration Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-5 rounded-3xl space-y-4">
              <h3 className="font-bold text-sm text-slate-100 font-display">Workspace Actions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Quickly bootstrap files generated from this blueprint into the live development workspace container on port :3000.
              </p>

              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-between transition-colors">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold">Deploy Mock PostgreSQL</p>
                    <p className="text-[10px] text-indigo-200">Generate Prisma entity models</p>
                  </div>
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>

                <button className="w-full text-left p-3 rounded-xl bg-slate-950 border border-white/5 text-slate-300 hover:border-indigo-500/30 flex items-center justify-between transition-all">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold">Auditor Sandbox Check</p>
                    <p className="text-[10px] text-slate-500">Examine CORS rate limit limits</p>
                  </div>
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-3xl text-xs space-y-3">
              <h3 className="font-semibold text-slate-200">How to scaffold this blueprint:</h3>
              <ol className="list-decimal pl-4 space-y-2 text-slate-400 leading-relaxed">
                <li>Create the files exactly corresponding to the generated <span className="text-indigo-400 font-mono">Folder Tree</span>.</li>
                <li>Add dependencies specified in the <span className="text-indigo-400 font-mono">package.json</span> block inside your project tree.</li>
                <li>Write endpoints and controllers matching the <span className="text-indigo-400 font-mono">PRD Spec</span> parameters.</li>
                <li>Verify structural deployment status under the active <span className="text-indigo-400 font-mono">Gantt Roadmap</span>.</li>
              </ol>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
