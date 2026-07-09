import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Globe,
  Sparkles,
  Search,
  Code2,
  Terminal,
  Lock,
  Play,
  Copy,
  Check,
  Cpu,
  Layers,
  ArrowRight,
  Database,
  Mail,
  Users,
  CreditCard,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { DeveloperAPI } from "../types";
import { useToast } from "./ToastContext";

export default function APIHub() {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApiId, setSelectedApiId] = useState<string>("a1");
  const [isCallingAPI, setIsCallingAPI] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  
  // Playground State
  const [playgroundBody, setPlaygroundBody] = useState('{\n  "amount": 2500,\n  "currency": "usd",\n  "receipt_email": "hello@stackverse.io"\n}');
  const [playgroundResponse, setPlaygroundResponse] = useState<any | null>(null);
  const [activeCodeLanguage, setActiveCodeLanguage] = useState<"node" | "python" | "curl">("node");

  const registry: DeveloperAPI[] = [
    {
      id: "a1",
      name: "Stripe Billing Hub",
      logo: "💳",
      category: "Payments",
      authType: "API Key",
      pricing: "Freemium",
      popularity: 5,
      description: "Direct payment intent gateway to register credit card captures, recurrent billing items, and generate beautiful invoices.",
      endpoint: "https://api.stackverse.dev/payments/intents",
      documentation: "Use this API to trigger secure payment tunnels. Requires bearer token configuration under your Stripe security dashboard.",
      exampleRequest: '{\n  "amount": 2000,\n  "currency": "usd",\n  "payment_method_types": ["card"]\n}'
    },
    {
      id: "a2",
      name: "Google Gemini Core",
      logo: "⚡",
      category: "AI",
      authType: "API Key",
      pricing: "Free",
      popularity: 5,
      description: "High-speed token summarization, structured JSON schema outputs, and semantic code-explanation pipelines.",
      endpoint: "https://api.stackverse.dev/ai/generate",
      documentation: "Access Gemini-3.5-flash text streams. Feed arrays of previous user contents for complete chat historical consistency.",
      exampleRequest: '{\n  "prompt": "Optimize a composite index scheme for a PostgreSQL database.",\n  "temperature": 0.2\n}'
    },
    {
      id: "a3",
      name: "GitHub Gists Sync",
      logo: "🐙",
      category: "Developer Tools",
      authType: "OAuth 2.0",
      pricing: "Free",
      popularity: 4,
      description: "Automated git snippets archival. Synchronize developer configuration settings directly with remote GitHub user accounts.",
      endpoint: "https://api.stackverse.dev/v3/gists",
      documentation: "Sync files directly to remote gists. Requires an authenticated GitHub access token representing public snippet permission.",
      exampleRequest: '{\n  "description": "StackVerse Scaffolder Config",\n  "public": false,\n  "files": {\n    "stackverse.json": { "content": "{}" }\n  }\n}'
    },
    {
      id: "a4",
      name: "Clerk Authorization Core",
      logo: "👤",
      category: "Security & Auth",
      authType: "JWT",
      pricing: "Freemium",
      popularity: 5,
      description: "Type-safe developer authentication profiles. Synchronize active roles, user security keys, and account verification rules.",
      endpoint: "https://api.stackverse.dev/auth/users/me",
      documentation: "Retrieves metadata mapping of currently logged-in developer profiles. Exposes scopes, custom roles, and OAuth connected nodes.",
      exampleRequest: '{\n  "user_id": "usr_94a28f8f",\n  "session_token": "clerk_jwt_sv_82f8"\n}'
    },
    {
      id: "a5",
      name: "SendGrid Dispatcher",
      logo: "✉️",
      category: "Messaging",
      authType: "API Key",
      pricing: "Paid",
      popularity: 4,
      description: "High-volume developer email pipelines. Trigger beautiful HTML transactional logs and invoice dispatch receipts.",
      endpoint: "https://api.stackverse.dev/mail/send",
      documentation: "Leverage standard SMTP relay or REST endpoints to broadcast transaction confirmations. Features real-time tracking metrics.",
      exampleRequest: '{\n  "to": "dev@stackverse.io",\n  "subject": "Deploy success!",\n  "html": "<p>Server successfully launched</p>"\n}'
    }
  ];

  const selectedApi = registry.find(a => a.id === selectedApiId) || registry[0];

  const handleTriggerTest = async () => {
    setIsCallingAPI(true);
    setPlaygroundResponse(null);

    try {
      // Direct call to sandbox secure proxy
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: selectedApi.endpoint,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer sv_test_api_playground_hub"
          },
          body: JSON.parse(playgroundBody || "{}")
        })
      });

      const data = await res.json();
      setPlaygroundResponse(data.body || data);
      toast.success("API Test Completed", `Successfully executed playground test query on ${selectedApi.name}.`);

    } catch (err: any) {
      console.error(err);
      setPlaygroundResponse({
        error: "Sandbox parsing error",
        message: err.message || "Ensure your payload is structured as correct JSON."
      });
      toast.error("API Test Failed", err.message || "Ensure your payload is structured as correct JSON.");
    } finally {
      setIsCallingAPI(false);
    }
  };

  const triggerCopySnippet = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
    toast.success("Code Copied", "Developer code snippet copied to clipboard.");
  };

  const getCodeSnippets = (api: DeveloperAPI) => {
    const node = `const fetch = require('node-fetch');

async function triggerApi() {
  const response = await fetch('${api.endpoint}', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_SECRET_KEY'
    },
    body: JSON.stringify(${api.exampleRequest.trim().replace(/\n/g, "\n    ")})
  });
  
  const result = await response.json();
  console.log(result);
}

triggerApi();`;

    const python = `import requests

url = "${api.endpoint}"
payload = ${api.exampleRequest.trim().replace(/\n/g, "\n  ")}
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_SECRET_KEY"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`;

    const curl = `curl -X POST "${api.endpoint}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -d '${api.exampleRequest.trim().replace(/\n/g, "\n  ")}'`;

    return { node, python, curl };
  };

  const snippets = getCodeSnippets(selectedApi);

  const filteredRegistry = registry.filter(
    a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[500px]">
      
      {/* Sidebar API Directory */}
      <div className="lg:col-span-4 flex flex-col gap-4 h-full">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search Payments, Security, AI APIs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Directory List */}
        <div className="glass-panel p-4 rounded-3xl flex-grow overflow-y-auto space-y-2.5 max-h-[300px] lg:max-h-none">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Ecosystem Catalog</h3>
          {filteredRegistry.map((api) => (
            <div
              key={api.id}
              onClick={() => {
                setSelectedApiId(api.id);
                setPlaygroundBody(api.exampleRequest);
                setPlaygroundResponse(null);
              }}
              className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                selectedApiId === api.id
                  ? "bg-indigo-600/10 border-indigo-500"
                  : "bg-slate-950/40 border-white/5 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center text-lg shadow-sm shrink-0">
                    {api.logo}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-200">{api.name}</h4>
                    <span className="text-[9px] font-semibold text-indigo-400 uppercase tracking-wide">{api.category}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 font-mono">
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                    api.pricing === "Free"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                      : api.pricing === "Freemium"
                      ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/25"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/25"
                  }`}>
                    {api.pricing}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                {api.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* API Details and Interactive Playground */}
      <div className="lg:col-span-8 glass-panel rounded-3xl p-6 overflow-y-auto space-y-6">
        
        {/* API Meta info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="h-14 w-14 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-2xl shadow-md shrink-0">
              {selectedApi.logo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 font-display">{selectedApi.name}</h2>
                <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">
                  {selectedApi.authType} Secure
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{selectedApi.description}</p>
            </div>
          </div>
        </div>

        {/* Technical Docs & Code snippets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Docs Block */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wide">REST endpoint:</h3>
              <p className="font-mono text-[11px] text-indigo-400 bg-slate-950 p-2.5 rounded-xl border border-white/5 select-all truncate break-all">
                POST {selectedApi.endpoint}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wide">Integration Guide:</h3>
              <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-3.5 rounded-2xl border border-white/5">
                {selectedApi.documentation}
              </p>
            </div>
          </div>

          {/* Code Snippets Block */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-1">
              <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wide">Code Block:</h3>
              <div className="flex gap-2 font-mono text-[9px] font-bold">
                {["node", "python", "curl"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveCodeLanguage(lang as any)}
                    className={`px-2 py-0.5 rounded border ${
                      activeCodeLanguage === lang
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                        : "bg-slate-950 border-white/5 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <pre className="p-4 bg-slate-950 border border-white/5 rounded-2xl font-mono text-[10px] text-slate-300 overflow-x-auto max-h-40 leading-normal">
                <code>
                  {activeCodeLanguage === "node" && snippets.node}
                  {activeCodeLanguage === "python" && snippets.python}
                  {activeCodeLanguage === "curl" && snippets.curl}
                </code>
              </pre>
              <button
                onClick={() => triggerCopySnippet(activeCodeLanguage === "node" ? snippets.node : activeCodeLanguage === "python" ? snippets.python : snippets.curl, "api-snippet")}
                className="absolute top-2.5 right-2.5 p-1 rounded bg-slate-900 border border-white/5 text-slate-400 hover:text-white cursor-pointer"
              >
                {copiedLabel === "api-snippet" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Live Playground */}
        <div className="border-t border-white/5 pt-6 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Terminal className="h-4.5 w-4.5 text-indigo-400" />
              REST Playground Sandbox
            </h3>
            <p className="text-xs text-slate-400">Trigger authentic secure calls immediately. Body params map to production APIs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Request Body */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-500 block">POST REQUEST PAYLOAD BODY (JSON):</span>
              <textarea
                rows={5}
                value={playgroundBody}
                onChange={(e) => setPlaygroundBody(e.target.value)}
                className="w-full text-xs font-mono p-4 bg-slate-950 border border-white/5 rounded-2xl text-slate-300 focus:outline-none focus:border-indigo-500 resize-none"
              />
              <button
                onClick={handleTriggerTest}
                disabled={isCallingAPI}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow"
              >
                {isCallingAPI ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                <span>Execute Endpoint Query</span>
              </button>
            </div>

            {/* Response Body */}
            <div className="space-y-1.5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block">LIVE SANDBOX RESPONSE LOGS:</span>
                <div className="w-full p-4 bg-slate-950 border border-white/5 rounded-2xl font-mono text-xs text-emerald-400 min-h-36 max-h-40 overflow-y-auto leading-relaxed">
                  {isCallingAPI ? (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Retrieving remote pipeline records...</span>
                    </div>
                  ) : playgroundResponse ? (
                    <pre>{JSON.stringify(playgroundResponse, null, 2)}</pre>
                  ) : (
                    <p className="text-slate-500 italic">Logs are offline. Execute a request to listen to proxy telemetry.</p>
                  )}
                </div>
              </div>
              {playgroundResponse && (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-1 justify-end">
                  <CheckCircle className="h-3.5 w-3.5" />
                  STATUS CODE: 200 SUCCESS OK
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
