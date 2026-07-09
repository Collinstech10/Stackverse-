import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  CheckCircle,
  FileSearch,
  CheckSquare,
  Globe,
  Terminal,
  Clock,
  ExternalLink,
  Cpu,
  Bookmark,
  RefreshCw,
  Search,
  XCircle,
  AlertCircle
} from "lucide-react";
import { DeploymentChecklistItem, WebAuditReport } from "../types";

export default function LaunchCenter() {
  const [activeTab, setActiveTab] = useState<"checklist" | "audit" | "domains" | "timeline">("checklist");
  
  // 1. Checklist State
  const [checklist, setChecklist] = useState<DeploymentChecklistItem[]>([
    { id: "c1", task: "Generate production JWT salting secrets in server environment config", category: "Security", checked: true },
    { id: "c2", task: "Apply CORS whitelist parameters on /api proxy nodes", category: "Security", checked: false },
    { id: "c3", task: "Compile Gzip compression middleware inside Node.js listener loop", category: "Performance", checked: false },
    { id: "c4", task: "Optimise static image bundle files using Sharp compressor", category: "Performance", checked: true },
    { id: "c5", task: "Establish Google Search console tracking sitemap.xml records", category: "SEO", checked: false },
    { id: "c6", task: "Migrate composite indexes inside PostgreSQL database schemas", category: "Database", checked: true }
  ]);

  const toggleChecklistItem = (id: string) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  // 2. SEO Auditor State
  const [auditUrl, setAuditUrl] = useState("https://stackverse.io");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState<WebAuditReport | null>({
    seoScore: 92,
    performanceScore: 84,
    accessibilityScore: 89,
    securityScore: 95,
    metaCheck: {
      title: "Found: 'StackVerse Hub | Developer Ecosystem' length: 38 chars - Good",
      description: "Found: 'AI-powered builder sandbox...' length: 154 chars - Compliant",
      openGraph: "Found: og:title, og:image representation verified",
      robotsTxt: "Found robots.txt indexing configuration",
      sitemap: "Verified sitemap.xml link inside schema directives"
    },
    findings: [
      {
        category: "Performance",
        title: "Missing critical image layout constraints",
        impact: "High",
        description: "Dashboard vector hero element missing explicit layout height and width dimensions. Triggers cumulative layout shift (CLS).",
        remediation: "Add explicit width/height inline markers or Tailwind aspect ratio wrappers to prevent page jumping."
      },
      {
        category: "SEO",
        title: "Incomplete H1 element structure",
        impact: "Medium",
        description: "Homepage has 2 H1 nodes under active rendering tabs. Search algorithms restrict content indices on multi-H1 schemas.",
        remediation: "Ensure only 1 logical H1 exists representing the central tagline. Swap auxiliary blocks into H2 or H3 structures."
      },
      {
        category: "Accessibility",
        title: "Contrast ratio leaks on active footer nodes",
        impact: "Low",
        description: "Gray caption markers have contrast rating of 3.8:1, leaking WCAG AA target parameters (4.5:1).",
        remediation: "Increase contrast rating by altering footer colors into slate-400 or slate-300."
      }
    ],
    recommendations: [
      "Merge multiple H1 titles to establish perfect SEO parsing hierarchy.",
      "Optimise index images by compressing layout size bounds.",
      "Declare explicit width-height criteria on layout vectors."
    ]
  });

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditUrl.trim()) return;

    setIsAuditing(true);
    setAuditReport(null);

    try {
      const response = await fetch("/api/gemini/launch-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: auditUrl })
      });

      if (!response.ok) {
        throw new Error("Audit pipeline failed. Verify URL configuration.");
      }

      const data = await response.json();
      setAuditReport(data);

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to audit website.");
    } finally {
      setIsAuditing(false);
    }
  };

  // 3. Domain Suggestion State
  const [domainKeyword, setDomainKeyword] = useState("stackverse");
  const [domainSuggestions, setDomainSuggestions] = useState<any[]>([
    { name: "stackverse.io", status: "Taken", price: "$14.99/yr", action: "Whois Check" },
    { name: "stackverse.dev", status: "Taken", price: "$12.00/yr", action: "Whois Check" },
    { name: "stackverse.ai", status: "Available", price: "$49.99/yr", action: "Register" },
    { name: "stackversehub.com", status: "Available", price: "$8.99/yr", action: "Register" },
    { name: "stackverseapp.net", status: "Available", price: "$10.50/yr", action: "Register" }
  ]);

  const handleDomainSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const kw = domainKeyword.trim().toLowerCase().replace(/\s+/g, "");
    if (!kw) return;

    setDomainSuggestions([
      { name: `${kw}.io`, status: "Taken", price: "$14.99/yr", action: "Whois" },
      { name: `${kw}.dev`, status: "Taken", price: "$12.00/yr", action: "Whois" },
      { name: `${kw}.ai`, status: "Available", price: "$49.99/yr", action: "Register" },
      { name: `${kw}hub.com`, status: "Available", price: "$8.99/yr", action: "Register" },
      { name: `${kw}hq.net`, status: "Available", price: "$10.50/yr", action: "Register" }
    ]);
  };

  // 4. Staging timeline state
  const timelineStages = [
    { title: "Alpha Sandboxed", date: "Jul 10, 2026", status: "Completed", desc: "Validate basic gateway routers, load JWT security salts." },
    { title: "Beta Staging Run", date: "Jul 15, 2026", status: "In Progress", desc: "Initiate live database migrations and test Stripe hooks." },
    { title: "Public Deployment Deploy", date: "Jul 25, 2026", status: "Scheduled", desc: "Configure custom domains and broadcast SaaS. Hub operational." }
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* Upper Panel: Launch Pad Metadata */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="h-4.5 w-4.5 animate-pulse" />
            <span>Launch Pad Telemetry</span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-100">Production Launch Assistant</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Verify checklists, evaluate active landing urls inside our Gemini SEO Auditor, plan staging timeline schedules, and find premium available domains.
          </p>
        </div>

        {/* Tab Navigator */}
        <div className="flex border border-white/5 bg-slate-950/20 p-1 rounded-xl shrink-0">
          {[
            { id: "checklist", label: "Checklist" },
            { id: "audit", label: "SEO Auditor" },
            { id: "domains", label: "Domains" },
            { id: "timeline", label: "Planner" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === tab.id ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Checklist */}
      {activeTab === "checklist" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Checklist Area */}
          <div className="lg:col-span-8 glass-panel rounded-3xl p-6 space-y-4">
            <div className="border-b border-white/5 pb-3">
              <h3 className="font-bold text-sm text-slate-100 font-display">SaaS Production Audit Criteria</h3>
              <p className="text-xs text-slate-400">Validate all boxes to ensure standard security compliance</p>
            </div>

            <div className="space-y-2.5">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5 hover:border-indigo-500/10 cursor-pointer flex items-start gap-3 transition-all group"
                >
                  <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition-all mt-0.5 ${
                    item.checked ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-700 group-hover:border-indigo-500"
                  }`}>
                    {item.checked && <CheckCircle className="h-3.5 w-3.5" />}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {item.category}
                    </span>
                    <p className={`text-xs mt-1.5 ${item.checked ? "line-through text-slate-500" : "text-slate-200"}`}>
                      {item.task}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist stats card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-5 rounded-3xl flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-100 font-display mb-1">Audit Scorecard</h4>
                <p className="text-xs text-slate-400 mb-4">Total criteria completed accurately</p>
              </div>

              <div className="relative h-32 flex items-center justify-center border border-white/5 bg-slate-950/40 rounded-2xl py-4">
                <div className="text-center space-y-1">
                  <p className="text-3xl font-bold font-display text-indigo-400">
                    {Math.round((checklist.filter(c => c.checked).length / checklist.length) * 100)}%
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono">CRITERIA COMPLETED</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mt-4">
                Achieve 100% completion metrics before scheduling staging server runs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: SEO Web Auditor */}
      {activeTab === "audit" && (
        <div className="space-y-6">
          {/* Audit URL query */}
          <form onSubmit={handleRunAudit} className="glass-panel p-5 rounded-3xl flex flex-col sm:flex-row gap-3">
            <div className="flex-grow relative flex items-center bg-slate-950 border border-white/5 rounded-2xl">
              <Globe className="absolute left-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="https://stackverse.io"
                value={auditUrl}
                onChange={(e) => setAuditUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent border-none text-xs text-slate-200"
              />
            </div>
            <button
              type="submit"
              disabled={isAuditing}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-2xl text-xs font-bold shrink-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAuditing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileSearch className="h-4 w-4" />}
              <span>{isAuditing ? "Auditing Website..." : "Run SEO & Vitals Audit"}</span>
            </button>
          </form>

          {/* Audit results */}
          {auditReport && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Score indicators */}
              <div className="lg:col-span-4 space-y-4">
                <div className="glass-panel p-5 rounded-3xl space-y-3">
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wide">Web Vitals Scorecard</h4>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {[
                      { label: "SEO Score", score: auditReport.seoScore, color: "text-emerald-400" },
                      { label: "Performance", score: auditReport.performanceScore, color: "text-amber-400" },
                      { label: "Accessibility", score: auditReport.accessibilityScore, color: "text-emerald-400" },
                      { label: "Security Guard", score: auditReport.securityScore, color: "text-emerald-400" },
                    ].map((vit) => (
                      <div key={vit.label} className="p-3 rounded-xl bg-slate-950 border border-white/5 text-center space-y-1">
                        <span className="text-[10px] text-slate-500 font-semibold block">{vit.label}</span>
                        <p className={`text-xl font-bold font-display ${vit.color}`}>{vit.score}/100</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metadata checking report */}
                <div className="glass-panel p-5 rounded-3xl space-y-3">
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wide">HTML Meta Tags Inspection</h4>
                  <div className="space-y-2 font-mono text-[10px] text-slate-300">
                    <p className="p-2 rounded bg-slate-950 border border-white/5 truncate">ℹ️ {auditReport.metaCheck.title}</p>
                    <p className="p-2 rounded bg-slate-950 border border-white/5 truncate">ℹ️ {auditReport.metaCheck.description}</p>
                    <p className="p-2 rounded bg-slate-950 border border-white/5 truncate">ℹ️ {auditReport.metaCheck.openGraph}</p>
                  </div>
                </div>
              </div>

              {/* Finding reports */}
              <div className="lg:col-span-8 glass-panel rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-sm text-slate-100 font-display">System Findings & Remediation Steps</h3>
                
                <div className="space-y-3">
                  {auditReport.findings.map((find, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono font-bold uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          {find.category}
                        </span>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          find.impact === "High"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {find.impact} Impact
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-200 mt-1">{find.title}</h4>
                      <p className="text-xs text-slate-400 leading-normal">{find.description}</p>
                      
                      <div className="pt-2 border-t border-white/5 text-[11px] text-slate-500 leading-normal">
                        <strong className="text-indigo-400">Remediation action:</strong> {find.remediation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

        </div>
      )}

      {/* Tab: Domains suggestions */}
      {activeTab === "domains" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form and list */}
          <div className="lg:col-span-8 glass-panel p-6 rounded-3xl space-y-4">
            <div className="border-b border-white/5 pb-3">
              <h3 className="font-bold text-sm text-slate-100 font-display">Domain Suggestions Suggestions</h3>
              <p className="text-xs text-slate-400">Locate available premium domain options for your SaaS launch</p>
            </div>

            <form onSubmit={handleDomainSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="stackverse"
                value={domainKeyword}
                onChange={(e) => setDomainKeyword(e.target.value)}
                className="flex-grow text-xs px-3 py-2 bg-slate-950 border border-white/5 rounded-xl text-slate-200"
              />
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shrink-0">
                Generate Suggestions
              </button>
            </form>

            <div className="space-y-2">
              {domainSuggestions.map((dom) => (
                <div key={dom.name} className="p-3 rounded-xl bg-slate-950/40 border border-white/5 flex items-center justify-between font-mono text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-200">{dom.name}</span>
                    <span className="text-[10px] text-slate-500 block">Pricing: {dom.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      dom.status === "Available"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}>
                      {dom.status}
                    </span>
                    <button className="text-[10px] px-2.5 py-1 bg-slate-900 border border-slate-800 text-indigo-400 hover:text-white rounded hover:bg-indigo-600">
                      {dom.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="glass-panel p-5 rounded-3xl text-xs text-slate-400 space-y-2 leading-relaxed">
              <h3 className="font-semibold text-slate-200">Registration Best Practices:</h3>
              <ol className="list-decimal pl-4 space-y-1.5">
                <li>Choose <strong className="text-indigo-400">.com</strong> or <strong className="text-indigo-400">.io</strong> extensions to preserve enterprise confidence metrics.</li>
                <li>Avoid combining auxiliary hyphen nodes.</li>
                <li>Verify sitemaps immediately inside console configurations.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Staging timeline */}
      {activeTab === "timeline" && (
        <div className="glass-panel p-6 rounded-3xl space-y-6 max-w-3xl">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-bold text-sm text-slate-100 font-display">Release Timeline Planner</h3>
            <p className="text-xs text-slate-400">Coordinate and staging launch operations</p>
          </div>

          <div className="space-y-6 relative pl-4 border-l border-indigo-500/20 py-2">
            {timelineStages.map((stage, idx) => (
              <div key={idx} className="relative space-y-1">
                {/* Bullet */}
                <div className="absolute -left-6.5 top-0 h-4 w-4 rounded-full bg-slate-950 border border-indigo-500 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                </div>

                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-slate-200">{stage.title}</h4>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                    stage.status === "Completed"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : stage.status === "In Progress"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                      : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                  }`}>
                    {stage.status}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono block">{stage.date}</span>
                <p className="text-xs text-slate-400 leading-normal">{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
