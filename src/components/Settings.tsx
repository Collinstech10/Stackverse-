import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Settings,
  Sparkles,
  Key,
  Shield,
  Layers,
  CheckCircle,
  Plus,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  Sliders,
  Globe,
  Terminal,
  Cpu
} from "lucide-react";
import { useToast } from "./ToastContext";

export default function SettingsComponent() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<"security" | "profile" | "connections">("security");
  
  // 1. Profile settings state
  const [profileName, setProfileName] = useState("eniolaayobamidele0");
  const [profileEmail, setProfileEmail] = useState("eniola@stackverse.io");
  const [profileBio, setProfileBio] = useState("Building the Digital Universe, One Stack at a Time.");

  // 2. Theme state (locked to Slate Dark, allow selection simulator)
  const [activeSkin, setActiveSkin] = useState("midnight");

  // 3. Security keys state
  const [apiKeys, setApiKeys] = useState<any[]>([
    { id: "k1", name: "Stripe Webhook Gateway Key", key: "sv_live_9a38f4fbc3b53a0f9e1e2d", visible: false, date: "Created 2 days ago" },
    { id: "k2", name: "Gemini Local Proxy Test", key: "sv_test_9a38f0dcf92f98e0a1c1d4", visible: false, date: "Created 1 week ago" }
  ]);
  const [newKeyName, setNewKeyName] = useState("");
  const [showAddKey, setShowAddKey] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;

    const randString = Array.from({ length: 22 }, () => Math.random().toString(36)[2]).join("");
    const newKey = {
      id: "k_" + Date.now(),
      name: newKeyName,
      key: `sv_live_${randString}`,
      visible: false,
      date: "Created just now"
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    setShowAddKey(false);
    toast.success("Security Key Generated", `Successfully provisioned sandbox developer key "${newKeyName}".`);
  };

  const deleteKey = (id: string) => {
    const keyToDelete = apiKeys.find(k => k.id === id);
    setApiKeys(apiKeys.filter(k => k.id !== id));
    if (keyToDelete) {
      toast.info("Security Key Removed", `Deleted development key "${keyToDelete.name}".`);
    }
  };

  const toggleKeyVisibility = (id: string) => {
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, visible: !k.visible } : k));
  };

  const copyKeyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
    toast.success("Key Copied", "Sandbox API key copied to clipboard.");
  };

  // 4. Rate limiting state
  const [rateLimitRule, setRateLimitRule] = useState<number>(600); // req/min

  // 5. Connections state
  const [connections, setConnections] = useState<any[]>([
    { name: "GitHub Integration", connected: true, service: "github", icon: "🐙", desc: "Sync active gists and pinned repos on portfolio." },
    { name: "OAuth Security Gateway", connected: true, service: "oauth", icon: "🛡️", desc: "Token authentication and security policy enforcement." },
    { name: "Stripe Ledger Hub", connected: false, service: "stripe", icon: "💳", desc: "Relay invoice parameters and intents telemetry." },
    { name: "Slack Alerts Sync", connected: false, service: "slack", icon: "💬", desc: "Dispatch deployment success notifications." }
  ]);

  const toggleConnection = (service: string) => {
    const conn = connections.find(c => c.service === service);
    setConnections(connections.map(c => c.service === service ? { ...c, connected: !c.connected } : c));
    if (conn) {
      if (conn.connected) {
        toast.info("Pipeline Disconnected", `Disconnected remote node from ${conn.name}.`);
      } else {
        toast.success("Pipeline Synchronized", `Successfully authorized live sync channel for ${conn.name}.`);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
      
      {/* Sidebar Navigation */}
      <div className="lg:col-span-3 glass-panel p-4 rounded-3xl flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="h-5 w-5 text-indigo-400" />
          <h2 className="font-bold text-sm text-slate-200 uppercase tracking-wider font-display">System Settings</h2>
        </div>

        <div className="space-y-1.5 overflow-y-auto flex-grow max-h-60 lg:max-h-none pr-1">
          {[
            { id: "security", label: "Security & Sandbox Keys", icon: Key },
            { id: "profile", label: "Profile Credentials", icon: Shield },
            { id: "connections", label: "Connected Pipelines", icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left p-2.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                    : "bg-slate-900/40 border-white/5 text-slate-300 hover:bg-slate-900/80"
                }`}
              >
                <Icon className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Settings Display */}
      <div className="lg:col-span-9 glass-panel rounded-3xl p-6 overflow-y-auto space-y-6">
        
        {/* Tab: Security Sandbox Keys */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="border-b border-white/5 pb-3">
              <h3 className="font-bold text-sm text-slate-100 font-display">Sandbox Security Keys</h3>
              <p className="text-xs text-slate-400">Generate developer keys to authorize external queries on port :3000 proxies</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Developer Key Ring</h4>
                <button
                  onClick={() => setShowAddKey(!showAddKey)}
                  className="flex items-center gap-1.5 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-bold"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Generate Key</span>
                </button>
              </div>

              {showAddKey && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  onSubmit={handleCreateKey}
                  className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3"
                >
                  <label className="text-xs text-slate-300 block mb-1 font-semibold">Key Identifier Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Stripe Webhook Sandbox API"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowAddKey(false)} className="text-[10px] px-3 py-1.5 rounded bg-slate-800 text-slate-400">
                      Cancel
                    </button>
                    <button type="submit" className="text-[10px] px-3 py-1.5 rounded bg-indigo-600 text-white font-bold">
                      Provision Key
                    </button>
                  </div>
                </motion.form>
              )}

              <div className="space-y-3">
                {apiKeys.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-slate-950 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                    <div className="space-y-1 truncate flex-grow">
                      <h5 className="font-bold font-sans text-slate-200">{item.name}</h5>
                      <span className="text-[10px] text-slate-500 font-normal block">{item.date}</span>
                      <p className="text-indigo-400 truncate break-all font-semibold mt-1">
                        {item.visible ? item.key : "••••••••••••••••••••••••••••••••••••••"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end">
                      <button onClick={() => toggleKeyVisibility(item.id)} className="p-1.5 rounded bg-slate-900 border border-white/5 text-slate-400 hover:text-white">
                        {item.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button onClick={() => copyKeyText(item.key, item.id)} className="p-1.5 rounded bg-slate-900 border border-white/5 text-slate-400 hover:text-white">
                        {copiedKeyId === item.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <button onClick={() => deleteKey(item.id)} className="p-1.5 rounded bg-slate-900 border border-white/5 text-slate-400 hover:text-rose-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rate Limits */}
            <div className="border-t border-white/5 pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wide">Sandbox Rate-Limits Limit</h4>
                  <p className="text-xs text-slate-400">Limit incoming metrics traffic on gateway loops</p>
                </div>
                <span className="text-indigo-400 font-bold font-mono text-xs">{rateLimitRule} req/min</span>
              </div>

              <input
                type="range"
                min={100}
                max={2000}
                value={rateLimitRule}
                onChange={(e) => setRateLimitRule(parseInt(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => toast.success("Settings saved", `Sandbox rate-limit successfully updated to ${rateLimitRule} req/min.`)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Profile Credentials */}
        {activeTab === "profile" && (
          <div className="space-y-6 max-w-xl">
            <div className="border-b border-white/5 pb-3">
              <h3 className="font-bold text-sm text-slate-100 font-display">Profile Credentials</h3>
              <p className="text-xs text-slate-400">Manage display credentials on the Community and User Profile card</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-semibold">Creator Account Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full text-xs px-3.5 py-3 bg-slate-950 border border-white/5 rounded-xl text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-semibold">Contact Email</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-3 bg-slate-950 border border-white/5 rounded-xl text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-semibold">Short Biography</label>
                <textarea
                  rows={3}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  className="w-full text-xs px-3.5 py-3 bg-slate-950 border border-white/5 rounded-xl text-slate-100 focus:outline-none resize-none leading-relaxed"
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => toast.success("Settings saved", `Profile credentials for "${profileName}" saved successfully.`)}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md"
                >
                  Save Profile Credentials
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Connections */}
        {activeTab === "connections" && (
          <div className="space-y-6">
            <div className="border-b border-white/5 pb-3">
              <h3 className="font-bold text-sm text-slate-100 font-display">Connected Developer Pipelines</h3>
              <p className="text-xs text-slate-400">Synchronize remote credentials immediately to enable live repositories syncs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connections.map((conn) => (
                <div key={conn.service} className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="h-10 w-10 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center text-xl">
                        {conn.icon}
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold font-mono border ${
                        conn.connected
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                      }`}>
                        {conn.connected ? "CONNECTED" : "OFFLINE"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-slate-200">{conn.name}</h4>
                      <p className="text-[11px] text-slate-400 leading-normal">{conn.desc}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 mt-4">
                    <button
                      onClick={() => toggleConnection(conn.service)}
                      className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${
                        conn.connected
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white"
                      }`}
                    >
                      {conn.connected ? "Disconnect Node" : "Synchronize Pipeline"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
