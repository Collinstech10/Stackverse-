import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Users,
  MessageSquare,
  Heart,
  Share2,
  Plus,
  Send,
  Code,
  Tag,
  Trophy,
  Calendar,
  Sparkles,
  ExternalLink,
  Cpu,
  Bookmark,
  CheckCircle
} from "lucide-react";
import { ForumPost } from "../types";

export default function Community() {
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: "fp1",
      author: {
        name: "alex_architect",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80",
        title: "Principal Cloud Engineer"
      },
      content: "Just migrated our entire event ingestion stream from Lambda to an Express gateway running on port :3000. Under active load tests of 50k req/sec, we are seeing 99.98% successful responses. Composite index query overhead decreased to <4ms!\n\nHere is our database schema definition:\n\n```typescript\nimport { pgTable, serial, varchar } from 'drizzle-orm';\nexport const gatewayLogs = pgTable('gateway_logs', {\n  id: serial('id').primaryKey(),\n  path: varchar('path', { length: 256 }),\n  latencyMs: serial('latency_ms')\n});\n```",
      likes: 42,
      hasLiked: false,
      comments: [
        { author: "sara_dev", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80", content: "Super clean schema design! Are you seeing memory bottlenecks under peak heap allocations?", time: "2h ago" }
      ],
      tags: ["express", "drizzle", "database", "scale"],
      time: "4h ago",
      projectShowcase: {
        name: "Gateway Engine SDK",
        tagline: "High-performance Express pipeline monitoring telemetry",
        link: "https://github.com/alex/gateway-sdk"
      }
    },
    {
      id: "fp2",
      author: {
        name: "julia_front",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80",
        title: "Lead UI/UX Architect"
      },
      content: "React 19 state transitions are a complete game-changer. Moving all our asynchronous form actions over to useActionState has shaved 120 lines off our standard validation handlers. Highly recommend implementing optimistic actions on instant comment replies!",
      likes: 29,
      hasLiked: true,
      comments: [],
      tags: ["react19", "frontend", "optimization"],
      time: "6h ago"
    }
  ]);

  // Create post states
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTags, setNewPostTags] = useState("saas, framework");
  const [showCompose, setShowCompose] = useState(false);
  const [showCommentId, setShowCommentId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: ForumPost = {
      id: "fp_" + Date.now(),
      author: {
        name: "stackverse_creator",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
        title: "StackVerse Resident Builder"
      },
      content: newPostContent,
      likes: 0,
      hasLiked: false,
      comments: [],
      tags: newPostTags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean),
      time: "Just now"
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setShowCompose(false);
  };

  const handleLike = (id: string) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.hasLiked ? p.likes - 1 : p.likes + 1,
          hasLiked: !p.hasLiked
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;

    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              author: "stackverse_creator",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
              content: commentInput,
              time: "Just now"
            }
          ]
        };
      }
      return p;
    }));
    setCommentInput("");
  };

  const renderContentWithCode = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("```")) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const codeText = match ? match[2] : part.slice(3, -3);
        const lang = match ? match[1] : "code";
        return (
          <pre key={idx} className="my-3 p-3.5 bg-slate-950 border border-white/5 rounded-xl text-[10px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
            <span className="text-indigo-400 font-bold uppercase tracking-wide block mb-1.5 font-sans border-b border-white/5 pb-1">{lang}</span>
            <code>{codeText}</code>
          </pre>
        );
      }
      return <p key={idx} className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{part}</p>;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
      
      {/* Forum Feed Column */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Banner with Compose Button */}
        <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2.5">
            <Users className="h-5 w-5 text-indigo-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-100 font-display">StackVerse Developer Forums</h2>
              <p className="text-[11px] text-slate-500">Collaborate on open architectural structures and SaaS releases</p>
            </div>
          </div>

          <button
            onClick={() => setShowCompose(!showCompose)}
            className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Post Thread</span>
          </button>
        </div>

        {/* Compose Form */}
        {showCompose && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleCreatePost}
            className="p-5 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-3.5"
          >
            <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wide">Compose New Engineering Thread</h3>
            <textarea
              rows={4}
              placeholder="What are you building? You can wrap code blocks inside triple backticks like:\n```typescript\nconsole.log('Deploy success!')\n```"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full text-xs p-3.5 bg-slate-950 border border-white/5 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Tags: saas, nextjs, drizzle"
                value={newPostTags}
                onChange={(e) => setNewPostTags(e.target.value)}
                className="flex-grow text-xs px-3.5 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-slate-300"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition-colors shrink-0"
              >
                Broadcast Thread
              </button>
            </div>
          </motion.form>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="glass-panel p-5 rounded-3xl space-y-4">
              {/* Post Author info */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img src={post.author.avatar} alt="Avatar" className="h-9 w-9 rounded-xl border border-white/10" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{post.author.name}</h4>
                    <span className="text-[10px] text-slate-500">{post.author.title} • {post.time}</span>
                  </div>
                </div>
              </div>

              {/* Content with code representation */}
              <div className="space-y-3 pl-1">
                {renderContentWithCode(post.content)}
              </div>

              {/* Post attached project showcase */}
              {post.projectShowcase && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 flex justify-between items-center group hover:border-indigo-500/20 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-indigo-400">Attached Product:</span>
                    <h5 className="font-bold text-xs text-slate-200">{post.projectShowcase.name}</h5>
                    <p className="text-[11px] text-slate-500">{post.projectShowcase.tagline}</p>
                  </div>
                  <a
                    href={post.projectShowcase.link}
                    target="_blank"
                    className="p-2 rounded-lg bg-slate-900 border border-white/5 text-slate-400 group-hover:text-white group-hover:bg-indigo-600/10 group-hover:border-indigo-500/20 transition-all cursor-pointer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pl-1">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-[9px] font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-white/5 uppercase">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Action bar (Likes / Comments toggle) */}
              <div className="flex gap-4 border-t border-white/5 pt-3.5 pl-1 text-slate-500 font-mono text-[11px] font-semibold">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${post.hasLiked ? "text-rose-400" : "hover:text-slate-200"}`}
                >
                  <Heart className={`h-4.5 w-4.5 ${post.hasLiked ? "fill-rose-400" : ""}`} />
                  <span>{post.likes} Likes</span>
                </button>

                <button
                  onClick={() => setShowCommentId(showCommentId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 hover:text-slate-200 cursor-pointer"
                >
                  <MessageSquare className="h-4.5 w-4.5" />
                  <span>{post.comments.length} Discussion Logs</span>
                </button>
              </div>

              {/* Collapsible Comments Area */}
              {showCommentId === post.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 pt-4 border-t border-white/5 bg-slate-950/20 p-4 rounded-2xl"
                >
                  {post.comments.length > 0 && (
                    <div className="space-y-3">
                      {post.comments.map((comm, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                          <img src={comm.avatar} alt="Commenter" className="h-6 w-6 rounded-lg shrink-0 mt-0.5" referrerPolicy="no-referrer" />
                          <div className="space-y-0.5">
                            <div className="flex gap-2 text-[10px]">
                              <span className="font-bold text-slate-300">{comm.author}</span>
                              <span className="text-slate-500 font-mono">{comm.time}</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-normal">{comm.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add comment form */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Contribute to discussion..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="flex-grow text-xs px-3 py-2 bg-slate-950 border border-slate-900 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-semibold text-xs cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          ))}
        </div>

      </div>

      {/* Events / Hackathons column */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Hackathon Widget */}
        <div className="glass-panel p-5 rounded-3xl space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            <h3 className="font-bold text-sm text-slate-100 font-display">Active Virtual Hackathons</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Assemble development crews, bootstrap folder trees in our scaffolding engine, deploy API keys, and test routes to win cash rewards!
          </p>

          <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 relative overflow-hidden space-y-2.5">
            <div>
              <span className="text-[8px] font-mono font-bold text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                JULY 2026 EDITION
              </span>
              <h4 className="font-bold text-xs text-slate-200 mt-1.5">StackVerse SaaS Accelerator</h4>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>Prize Pool: $15,000</span>
              <span>42 teams registered</span>
            </div>
            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors">
              Register Team Crew
            </button>
          </div>
        </div>

        {/* Tech Events Scheduler */}
        <div className="glass-panel p-5 rounded-3xl space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-100 font-display">Developer Meetups</h3>
          </div>
          <div className="space-y-3">
            {[
              { title: "React 19 Hooks deep-dive", time: "July 12 • 18:30 UTC" },
              { title: "Scale Express beyond 10M rows", time: "July 18 • 16:00 UTC" }
            ].map((meet, i) => (
              <div key={i} className="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-indigo-400 font-bold">{meet.time}</span>
                <p className="text-xs font-semibold text-slate-300">{meet.title}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
