import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Terminal,
  Send,
  Trash2,
  FileText,
  Copy,
  Check,
  ChevronRight,
  Code2,
  Database,
  Layers,
  Wrench,
  BookOpen,
  Image as ImageIcon,
  Paperclip,
  Download,
  Plus,
  RefreshCw,
  Cpu
} from "lucide-react";
import { ChatMessage, WorkspaceMode, WorkspaceSession } from "../types";

export default function AIWorkspace() {
  const [activeMode, setActiveMode] = useState<WorkspaceMode>("chat");
  const [input, setInput] = useState("");
  const [sessions, setSessions] = useState<WorkspaceSession[]>([
    {
      id: "s1",
      title: "Optimizing PostgreSQL indexing schemas",
      mode: "sql",
      createdAt: "10m ago",
      messages: [
        { id: "m1", role: "user", content: "I have a table with 10M rows and queries on user_id and created_at are slow. What indices should I add?", timestamp: "10:15" },
        {
          id: "m2",
          role: "assistant",
          content: `To optimize queries filtering or ordering by both \`user_id\` and \`created_at\`, you should create a composite (multi-column) index.

Here is the highly optimized SQL migration script:

\`\`\`sql
CREATE INDEX idx_users_created_at 
ON user_activities (user_id, created_at DESC);
\`\`\`

### Why this composite index works:
1. **Left-to-Right Matching**: PostgreSQL reads composite indexes from left to right. This index accelerates queries where both \`user_id\` is matched exactly and \`created_at\` is filtered or sorted.
2. **Sort Optimization**: Adding \`DESC\` to \`created_at\` allows rapid queries fetching recent active events.`,
          timestamp: "10:16"
        }
      ]
    },
    {
      id: "s2",
      title: "API Gateway rate limiter architecture",
      mode: "architecture",
      createdAt: "1 hour ago",
      messages: [
        { id: "m3", role: "user", content: "Explain how to build a token bucket rate limiter in Node.js.", timestamp: "09:00" },
        { id: "m4", role: "assistant", content: "A token bucket rate limiter permits traffic bursts while enforcing strict overall limits. Let's write a robust implementation utilizing Redis.", timestamp: "09:02" }
      ]
    }
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>("s1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, isGenerating]);

  // Handle mode switches
  const handleModeChange = (mode: WorkspaceMode) => {
    setActiveMode(mode);
    // Create new session automatically on mode switch if requested
    const newSess: WorkspaceSession = {
      id: "s_" + Date.now(),
      title: `New ${mode.toUpperCase()} Assistant`,
      mode,
      messages: [],
      createdAt: "Just now"
    };
    setSessions([newSess, ...sessions]);
    setActiveSessionId(newSess.id);
  };

  // Create new session manually
  const handleNewSession = () => {
    const newSess: WorkspaceSession = {
      id: "s_" + Date.now(),
      title: "Unsaved workspace conversation",
      mode: activeMode,
      messages: [],
      createdAt: "Just now"
    };
    setSessions([newSess, ...sessions]);
    setActiveSessionId(newSess.id);
  };

  // Delete active session
  const handleDeleteSession = (id: string) => {
    if (sessions.length <= 1) {
      alert("At least one workspace session is required.");
      return;
    }
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    setActiveSessionId(filtered[0].id);
  };

  // Secure API Call
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() && !selectedFile) return;

    const userMessageContent = input + (selectedFile ? `\n\n[Attached File: ${selectedFile.name} (${selectedFile.size})]` : "");
    const newUserMsg: ChatMessage = {
      id: "m_u_" + Date.now(),
      role: "user",
      content: userMessageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update session locally with user message
    const updatedMessages = [...activeSession.messages, newUserMsg];
    const sessionIndex = sessions.findIndex(s => s.id === activeSessionId);
    
    // Auto-update conversation title if it was default
    let newTitle = activeSession.title;
    if (activeSession.title.startsWith("New") || activeSession.title.startsWith("Unsaved")) {
      newTitle = input.substring(0, 32) + (input.length > 32 ? "..." : "");
    }

    const updatedSessions = [...sessions];
    updatedSessions[sessionIndex] = {
      ...activeSession,
      title: newTitle,
      messages: updatedMessages
    };
    setSessions(updatedSessions);
    
    setInput("");
    setSelectedFile(null);
    setIsGenerating(true);

    try {
      // Call actual server-side proxy
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessageContent,
          history: updatedMessages.slice(0, -1).map(m => ({
            role: m.role,
            content: m.content
          })),
          mode: activeMode
        })
      });

      if (!response.ok) {
        throw new Error("Gateway failed to generate text response.");
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: "m_a_" + Date.now(),
        role: "assistant",
        content: data.text || "No output received.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalSessions = [...updatedSessions];
      finalSessions[sessionIndex] = {
        ...finalSessions[sessionIndex],
        messages: [...updatedMessages, assistantMsg]
      };
      setSessions(finalSessions);

    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: "m_err_" + Date.now(),
        role: "assistant",
        content: `⚠️ **System Integration Error**: ${err.message || "Failed to process prompt. The sandbox server might be starting or experiencing rate limits."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const finalSessions = [...updatedSessions];
      finalSessions[sessionIndex] = {
        ...finalSessions[sessionIndex],
        messages: [...updatedMessages, errorMsg]
      };
      setSessions(finalSessions);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Mock File Attachments
  const triggerMockFile = (type: "image" | "file") => {
    if (type === "image") {
      setSelectedFile({
        name: "dashboard-wireframe-v2.png",
        size: "2.4 MB",
        type: "image/png"
      });
    } else {
      setSelectedFile({
        name: "prisma.schema",
        size: "14 KB",
        type: "text/plain"
      });
    }
  };

  // Export conversations as standard Markdown (.md)
  const handleExportMarkdown = () => {
    let mdContent = `# StackVerse Workspace Session: ${activeSession.title}\n\n`;
    mdContent += `*Mode: ${activeSession.mode.toUpperCase()}* | *Created: ${activeSession.createdAt}*\n\n---\n\n`;

    activeSession.messages.forEach(m => {
      mdContent += `### **${m.role === "user" ? "Developer" : "StackVerse Assistant"}** (${m.timestamp})\n\n`;
      mdContent += `${m.content}\n\n`;
      mdContent += `---\n\n`;
    });

    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${activeSession.title.toLowerCase().replace(/\s+/g, "-")}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy code blocks utility
  const copyToClipboard = (text: string, blockId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBlockId(blockId);
    setTimeout(() => setCopiedBlockId(null), 2000);
  };

  // Custom regex block parser to render lists and code blocks elegantly
  const renderMessageContent = (msg: string) => {
    // Regex split codeblocks
    const parts = msg.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const language = match ? match[1] : "code";
        const codeText = match ? match[2] : part.slice(3, -3);
        const blockId = `block_${index}`;

        return (
          <div key={index} className="my-4 rounded-xl overflow-hidden border border-white/5 bg-slate-950">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-white/5 text-[11px] font-mono text-slate-400">
              <span className="uppercase text-indigo-400 font-semibold">{language || "text"}</span>
              <button
                onClick={() => copyToClipboard(codeText, blockId)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copiedBlockId === blockId ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs overflow-x-auto font-mono text-slate-300 leading-relaxed max-w-full">
              <code>{codeText}</code>
            </pre>
          </div>
        );
      } else {
        // Simple inline markdown parsing for bold and code
        const formatted = part
          .split(/(\*\*.*?\*\*)/g)
          .map((boldPart, bIdx) => {
            if (boldPart.startsWith("**") && boldPart.endsWith("**")) {
              return <strong key={bIdx} className="font-bold text-slate-100">{boldPart.slice(2, -2)}</strong>;
            }
            return boldPart;
          });

        return (
          <p key={index} className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
            {formatted}
          </p>
        );
      }
    });
  };

  const modeGuides = {
    chat: "Standard intelligent chat for complex tasks, setups, or general help.",
    bugfix: "Find vulnerabilities, logic leaks, performance drops, and optimize snippets.",
    explain: "Get architectural step-by-step breakdowns of legacy or foreign code.",
    sql: "Generate compound indices, optimized join schemas, and SQL migration scripts.",
    api: "Design compliant REST modules, custom handlers, or GraphQL blueprints.",
    doc: "Auto-format OpenAPI schema parameters, build clean README blocks, or release notes.",
    architecture: "Examine high-availability cloud setups, scale systems, and structure schemas."
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[500px]">
      
      {/* Sidebar: Sub-modes and Past Conversations */}
      <div className="lg:col-span-3 flex flex-col gap-4 h-full">
        {/* Sub-modes Select Grid */}
        <div className="glass-panel p-4 rounded-2xl space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assistant Submodes</h3>
          <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
            {[
              { id: "chat", label: "General Architect", icon: Sparkles, color: "text-indigo-400" },
              { id: "bugfix", label: "Code Debugger", icon: Wrench, color: "text-rose-400" },
              { id: "explain", label: "Code Explainer", icon: BookOpen, color: "text-emerald-400" },
              { id: "sql", label: "SQL Generator", icon: Database, color: "text-cyan-400" },
              { id: "api", label: "API Designer", icon: Code2, color: "text-violet-400" },
              { id: "doc", label: "Doc Generator", icon: FileText, color: "text-amber-400" },
              { id: "architecture", label: "System Architect", icon: Layers, color: "text-fuchsia-400" },
            ].map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id as WorkspaceMode)}
                  className={`w-full text-left p-2.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                    activeMode === mode.id
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                      : "bg-slate-900/40 border-white/5 text-slate-300 hover:bg-slate-900/85 hover:border-slate-800"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${mode.color}`} />
                  <span className="text-xs font-semibold">{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Saved Sessions list */}
        <div className="glass-panel p-4 rounded-2xl flex-grow flex flex-col justify-between h-48 lg:h-auto">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saved Sessions</h3>
              <button
                onClick={handleNewSession}
                className="p-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer"
                title="New Session"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-1.5 max-h-56 lg:max-h-[220px] overflow-y-auto pr-1">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  onClick={() => setActiveSessionId(sess.id)}
                  className={`group p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-2 ${
                    activeSessionId === sess.id
                      ? "bg-indigo-600/10 border-indigo-500/50 text-indigo-200"
                      : "bg-slate-950/40 border-white/5 text-slate-300 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="truncate space-y-0.5 flex-grow">
                    <p className="text-xs font-medium truncate leading-tight">{sess.title}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wide">{sess.mode}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSession(sess.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-900 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500">
            <span className="flex items-center gap-1 font-mono">
              <Cpu className="h-3 w-3" />
              ACTIVE: {activeMode.toUpperCase()}
            </span>
            <span>{sessions.length} open tabs</span>
          </div>
        </div>
      </div>

      {/* Main Workspace: Chat Window */}
      <div className="lg:col-span-9 glass-panel rounded-3xl flex flex-col justify-between overflow-hidden relative">
        {/* Active Session Header Info */}
        <div className="px-6 py-4 bg-slate-900/60 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100 font-display">{activeSession.title}</h2>
              <p className="text-xs text-slate-400">{modeGuides[activeMode]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-white/5 text-xs text-slate-300 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-grow p-6 overflow-y-auto space-y-6">
          {activeSession.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="h-16 w-16 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <Terminal className="h-8 w-8" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="font-semibold text-slate-100 text-base font-display">Workspace Active & Isolated</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Start coding, ask specialized architecture queries, request PostgreSQL tuning advice, or structure database schemas.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setInput("Write a Node.js REST API using TypeScript for complete user registration with password salting.")}
                    className="text-[10px] bg-slate-950 hover:bg-slate-900 border border-white/5 text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    🚀 Write a TypeScript REST API
                  </button>
                  <button
                    onClick={() => setInput("What indexes should I apply to speed up aggregate queries on a table of 50M records?")}
                    className="text-[10px] bg-slate-950 hover:bg-slate-900 border border-white/5 text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    📊 PostgreSQL Indexing guide
                  </button>
                </div>
              </div>
            </div>
          ) : (
            activeSession.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="h-8.5 w-8.5 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs shrink-0 shadow-md">
                    <Terminal className="h-4.5 w-4.5" />
                  </div>
                )}
                <div className={`p-4 rounded-2xl border max-w-2xl ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white border-indigo-500"
                    : "bg-slate-950/60 text-slate-300 border-white/5"
                }`}>
                  <div className="flex items-center justify-between mb-2 border-b border-white/5 pb-1">
                    <span className="text-[10px] font-mono tracking-wide uppercase font-semibold">
                      {msg.role === "user" ? "Developer Agent" : `StackVerse ${activeMode.toUpperCase()}`}
                    </span>
                    <span className="text-[9px] opacity-60">{msg.timestamp}</span>
                  </div>
                  <div className="space-y-2">
                    {renderMessageContent(msg.content)}
                  </div>
                </div>
              </div>
            ))
          )}

          {isGenerating && (
            <div className="flex gap-4 items-start">
              <div className="h-8.5 w-8.5 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs shrink-0 animate-spin">
                <RefreshCw className="h-4.5 w-4.5" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 text-slate-300 max-w-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                  <p className="text-xs font-semibold">AI is compiling answers...</p>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 bg-slate-900/40 border-t border-white/5 space-y-2">
          {selectedFile && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
              <div className="flex items-center gap-2">
                <Paperclip className="h-3.5 w-3.5" />
                <span className="font-semibold truncate">{selectedFile.name}</span>
                <span className="text-[10px] opacity-60">({selectedFile.size})</span>
              </div>
              <button onClick={() => setSelectedFile(null)} className="hover:text-white cursor-pointer">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="flex gap-3">
            <div className="flex-grow relative flex items-center bg-slate-950 border border-white/5 rounded-2xl focus-within:border-indigo-500/50">
              {/* File Attachment Triggers */}
              <div className="absolute left-3 flex gap-1.5 items-center">
                <button
                  type="button"
                  onClick={() => triggerMockFile("image")}
                  className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer"
                  title="Simulate Image Mockup Attachment"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => triggerMockFile("file")}
                  className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer"
                  title="Attach Workspace Code File"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
              </div>

              <input
                type="text"
                placeholder={`Instruct ${activeMode} assistant...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full pl-20 pr-4 py-3.5 bg-transparent border-none text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-5 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 font-semibold text-xs shadow-md cursor-pointer shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Compile</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
