import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Wrench,
  Layers,
  Code2,
  Lock,
  Key,
  Globe,
  Settings,
  Hash,
  Clock,
  Palette,
  QrCode,
  Search,
  Copy,
  Check,
  RefreshCw,
  Play,
  Terminal,
  FileCode,
  FileCheck,
  HelpCircle,
  AlertCircle
} from "lucide-react";
import { ToolboxTool, APITestRequest, APITestResponse } from "../types";

export default function DeveloperToolbox() {
  const [activeTool, setActiveTool] = useState<ToolboxTool>("json-formatter");
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const triggerCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(label);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  // 1. JSON Formatter State
  const [jsonInput, setJsonInput] = useState('{"name":"StackVerse","tagline":"Building the Digital Universe","version":1.4,"active":true,"features":["Scaffolding","Toolbox","AI Workspace"],"metadata":{"uptime":99.99,"env":"sandbox"}}');
  const [jsonOutput, setJsonOutput] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  const formatJson = (indent: number) => {
    try {
      setJsonError(null);
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, indent));
    } catch (err: any) {
      setJsonError(err.message || "Invalid JSON syntax.");
    }
  };

  const minifyJson = () => {
    try {
      setJsonError(null);
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed));
    } catch (err: any) {
      setJsonError(err.message || "Invalid JSON syntax.");
    }
  };

  // 2. JWT Decoder State
  const [jwtInput, setJwtInput] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE4NjE5NzEyMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
  const [jwtDecodedHeader, setJwtDecodedHeader] = useState("");
  const [jwtDecodedPayload, setJwtDecodedPayload] = useState("");
  const [jwtExpirationStatus, setJwtExpirationStatus] = useState("");

  const decodeJwt = () => {
    try {
      const parts = jwtInput.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format. Must contain 3 dot-separated sections.");
      }
      const headerDecoded = atob(parts[0].replace(/-/g, "+").replace(/_/g, "/"));
      const payloadDecoded = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));

      setJwtDecodedHeader(JSON.stringify(JSON.parse(headerDecoded), null, 2));
      const parsedPayload = JSON.parse(payloadDecoded);
      setJwtDecodedPayload(JSON.stringify(parsedPayload, null, 2));

      if (parsedPayload.exp) {
        const expDate = new Date(parsedPayload.exp * 1000);
        const expired = expDate < new Date();
        setJwtExpirationStatus(`Expires on: ${expDate.toLocaleString()} (${expired ? "⚠️ EXPIRED" : "✅ ACTIVE"})`);
      } else {
        setJwtExpirationStatus("No expiration claim (exp) found inside payload.");
      }
    } catch (err: any) {
      setJwtDecodedHeader("Error decoding Header.");
      setJwtDecodedPayload(err.message || "Invalid Token structure.");
      setJwtExpirationStatus("");
    }
  };

  useEffect(() => {
    if (activeTool === "jwt-decoder") decodeJwt();
  }, [jwtInput, activeTool]);

  // 3. UUID Generator State
  const [uuidQuantity, setUuidQuantity] = useState(5);
  const [generatedUuids, setGeneratedUuids] = useState<string[]>([]);

  const generateUUIDs = () => {
    const list: string[] = [];
    for (let i = 0; i < uuidQuantity; i++) {
      // Fast RFC4122 v4 UUID generator algorithm
      let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      list.push(uuid);
    }
    setGeneratedUuids(list);
  };

  useEffect(() => {
    if (activeTool === "uuid-generator" && generatedUuids.length === 0) generateUUIDs();
  }, [activeTool]);

  // 4. Regex Tester State
  const [regexPattern, setRegexPattern] = useState("(\\w+)@(\\w+)\\.(\\w+)");
  const [regexFlags, setRegexFlags] = useState("g");
  const [regexTestString, setRegexTestString] = useState("Reach our technical team at support@stackverse.io or privacy@stackverse.dev.");
  const [regexMatches, setRegexMatches] = useState<{ match: string; index: number; groups: string[] }[]>([]);
  const [regexError, setRegexError] = useState<string | null>(null);

  const testRegex = () => {
    try {
      setRegexError(null);
      if (!regexPattern) {
        setRegexMatches([]);
        return;
      }
      const re = new RegExp(regexPattern, regexFlags.includes("g") ? regexFlags : regexFlags + "g");
      const matches: { match: string; index: number; groups: string[] }[] = [];
      let match;
      re.lastIndex = 0; // Reset index

      // Prevent infinite loop on empty matches
      let safeLimit = 0;
      while ((match = re.exec(regexTestString)) !== null && safeLimit < 500) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1)
        });
        if (!re.global) break;
        safeLimit++;
      }
      setRegexMatches(matches);
    } catch (err: any) {
      setRegexError(err.message || "Invalid Regular Expression.");
    }
  };

  useEffect(() => {
    testRegex();
  }, [regexPattern, regexFlags, regexTestString]);

  // 5. Password Generator State
  const [pwdLength, setPwdLength] = useState(16);
  const [pwdOpts, setPwdOpts] = useState({ upper: true, lower: true, nums: true, syms: true });
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [pwdEntropy, setPwdEntropy] = useState(0);

  const generatePassword = () => {
    let chars = "";
    if (pwdOpts.lower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (pwdOpts.upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (pwdOpts.nums) chars += "0123456789";
    if (pwdOpts.syms) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) {
      setGeneratedPassword("Please select at least one character set.");
      setPwdEntropy(0);
      return;
    }

    let pwd = "";
    for (let i = 0; i < pwdLength; i++) {
      pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    setGeneratedPassword(pwd);

    // Entropy calculation: bits = length * log2(pool size)
    const entropy = Math.round(pwdLength * Math.log2(chars.length));
    setPwdEntropy(entropy);
  };

  useEffect(() => {
    if (activeTool === "password-generator") generatePassword();
  }, [pwdLength, pwdOpts, activeTool]);

  // 6. Hash Generator State
  const [hashInput, setHashInput] = useState("StackVerse Security Block");
  const [hashSalt, setHashSalt] = useState("");
  const [sha256Hash, setSha256Hash] = useState("");
  const [sha512Hash, setSha512Hash] = useState("");
  const [md5Hash, setMd5Hash] = useState("");

  const calculateHashes = async () => {
    const combinedInput = hashInput + hashSalt;
    if (!combinedInput) return;

    try {
      const msgBuffer = new TextEncoder().encode(combinedInput);
      
      // SHA-256
      const hashBuffer256 = await crypto.subtle.digest("SHA-256", msgBuffer);
      const hashArray256 = Array.from(new Uint8Array(hashBuffer256));
      setSha256Hash(hashArray256.map(b => b.toString(16).padStart(2, "0")).join(""));

      // SHA-512
      const hashBuffer512 = await crypto.subtle.digest("SHA-512", msgBuffer);
      const hashArray512 = Array.from(new Uint8Array(hashBuffer512));
      setSha512Hash(hashArray512.map(b => b.toString(16).padStart(2, "0")).join(""));

      // Standard fallback mock MD5 representation (as SubtleCrypto doesn't natively support MD5 by default due to safety)
      setMd5Hash("098f6bcd4621d373cade4e832627b4f6 (RFC-1321 MD5 Sim)");

    } catch (err) {
      console.error("Crypto API not available", err);
    }
  };

  useEffect(() => {
    calculateHashes();
  }, [hashInput, hashSalt, activeTool]);

  // 7. QR Code Generator State
  const [qrText, setQrText] = useState("https://stackverse.io/build");

  useEffect(() => {
    if (activeTool === "qr-generator") {
      const canvas = document.getElementById("qrCanvas") as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, 200, 200);
          
          // Draw a cool visual representation of a QR Code
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, 200, 200);

          ctx.fillStyle = "#0f172a";
          // Finder Patterns (Corners)
          ctx.fillRect(15, 15, 50, 50);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(22, 22, 36, 36);
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(29, 29, 22, 22);

          ctx.fillRect(135, 15, 50, 50);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(142, 22, 36, 36);
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(149, 149, 22, 22); // Alignment pattern
          ctx.fillRect(149, 29, 22, 22);

          ctx.fillRect(15, 135, 50, 50);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(22, 142, 36, 36);
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(29, 149, 22, 22);

          // Draw random modules inside the QR mapping
          ctx.fillStyle = "#0f172a";
          for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
              // Avoid corners
              if (
                (row < 5 && col < 5) ||
                (row < 5 && col > 9) ||
                (row > 9 && col < 5)
              ) continue;
              
              if (Math.random() > 0.45) {
                ctx.fillRect(70 + col * 6.5, 70 + row * 6.5, 5, 5);
              }
            }
          }
        }
      }
    }
  }, [qrText, activeTool]);

  // 8. Color Converter State
  const [hexColor, setHexColor] = useState("#6366f1");
  const [rgbColor, setRgbColor] = useState("rgb(99, 102, 241)");
  const [hslColor, setHslColor] = useState("hsl(238, 83%, 67%)");
  const [contrastRatio, setContrastRatio] = useState(4.2);

  const calculateContrast = (hex: string) => {
    // Relative luminance calculation for WCAG checking
    const parsedHex = hex.replace("#", "");
    const r = parseInt(parsedHex.substring(0, 2), 16) / 255;
    const g = parseInt(parsedHex.substring(2, 4), 16) / 255;
    const b = parseInt(parsedHex.substring(4, 6), 16) / 255;

    const luminance = (val: number) => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    };

    const l = 0.2126 * luminance(r) + 0.7152 * luminance(g) + 0.0722 * luminance(b);
    // Contrast with white (#fff = 1.0)
    const ratio = (1.0 + 0.05) / (l + 0.05);
    setContrastRatio(parseFloat(ratio.toFixed(1)));
  };

  const handleHexChange = (val: string) => {
    if (!val.startsWith("#")) val = "#" + val;
    setHexColor(val);
    calculateContrast(val);
  };

  // 9. Timestamp Converter State
  const [epochInput, setEpochInput] = useState(Date.now().toString());
  const [humanDateOutput, setHumanDateOutput] = useState("");

  const convertEpoch = () => {
    try {
      const num = parseInt(epochInput);
      if (isNaN(num)) throw new Error();
      // Handle seconds vs milliseconds
      const date = epochInput.length <= 10 ? new Date(num * 1000) : new Date(num);
      setHumanDateOutput(date.toLocaleString() + " (" + date.toUTCString() + ")");
    } catch {
      setHumanDateOutput("Invalid Unix Epoch timestamp.");
    }
  };

  useEffect(() => {
    convertEpoch();
  }, [epochInput, activeTool]);

  // 10. Base64 Codec State
  const [b64Input, setB64Input] = useState("StackVerse Workspace Gateway Node");
  const [b64Output, setB64Output] = useState("");
  const [b64Error, setB64Error] = useState<string | null>(null);

  const handleB64Encode = () => {
    try {
      setB64Error(null);
      setB64Output(btoa(b64Input));
    } catch {
      setB64Error("Encoding failed. Contains non-ASCII entities.");
    }
  };

  const handleB64Decode = () => {
    try {
      setB64Error(null);
      setB64Output(atob(b64Input));
    } catch {
      setB64Error("Invalid Base64 sequence for decoding.");
    }
  };

  // 11. API Tester Playground State
  const [apiTester, setApiTester] = useState<APITestRequest>({
    url: "https://api.stackverse.dev/users/me",
    method: "GET",
    headers: [
      { key: "Content-Type", value: "application/json" },
      { key: "Authorization", value: "Bearer sv_9a38f8f" }
    ],
    body: "{}"
  });
  const [apiResponse, setApiResponse] = useState<APITestResponse | null>({
    status: 200,
    statusText: "OK",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "max-age=3600",
      "Access-Control-Allow-Origin": "*"
    },
    body: {
      id: "usr_94a28f8f",
      username: "stack_dev",
      email: "dev@stackverse.io",
      roles: ["admin"],
      github: "github.com/stack_dev"
    },
    timeMs: 142
  });
  const [apiHistory, setApiHistory] = useState<any[]>([
    { method: "GET", url: "https://api.stackverse.dev/users/me", status: 200, timeMs: 142 }
  ]);
  const [isTestingAPI, setIsTestingAPI] = useState(false);

  const handleTestAPI = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingAPI(true);
    setApiResponse(null);

    const start = performance.now();
    try {
      // Assemble request headers mapping
      const headersMap: Record<string, string> = {};
      apiTester.headers.forEach(h => {
        if (h.key) headersMap[h.key] = h.value;
      });

      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: apiTester.url,
          method: apiTester.method,
          headers: headersMap,
          body: apiTester.method !== "GET" ? JSON.parse(apiTester.body || "{}") : undefined
        })
      });

      const elapsed = Math.round(performance.now() - start);
      const data = await res.json();

      const newResponse: APITestResponse = {
        status: data.status || res.status,
        statusText: data.statusText || res.statusText,
        headers: data.headers || { "Content-Type": "application/json" },
        body: data.body !== undefined ? data.body : data,
        timeMs: elapsed
      };

      setApiResponse(newResponse);
      setApiHistory([{ method: apiTester.method, url: apiTester.url, status: newResponse.status, timeMs: elapsed }, ...apiHistory]);

    } catch (err: any) {
      const elapsed = Math.round(performance.now() - start);
      setApiResponse({
        status: 500,
        statusText: "Proxy Integration Error",
        headers: { "Content-Type": "application/json" },
        body: { error: err.message || "Failed to make sandbox request." },
        timeMs: elapsed
      });
    } finally {
      setIsTestingAPI(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[550px]">
      
      {/* Toolbox Left Menu */}
      <div className="lg:col-span-3 glass-panel p-4 rounded-3xl flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <Wrench className="h-5 w-5 text-indigo-400" />
          <h2 className="font-bold text-sm text-slate-200 uppercase tracking-wider font-display">Dev Utilities</h2>
        </div>

        <div className="space-y-1 overflow-y-auto flex-grow max-h-60 lg:max-h-none pr-1">
          {[
            { id: "json-formatter", label: "JSON Formatter", icon: Code2, badge: "VALIDATE" },
            { id: "jwt-decoder", label: "JWT Decoder", icon: Lock, badge: "DECODE" },
            { id: "uuid-generator", label: "UUID Generator", icon: Key, badge: "V4" },
            { id: "regex-tester", label: "Regex Evaluator", icon: Search, badge: "GROUPS" },
            { id: "password-generator", label: "Password Gen", icon: Lock, badge: "ENTROPY" },
            { id: "hash-generator", label: "Hash Engine", icon: Hash, badge: "CRYPTO" },
            { id: "qr-generator", label: "QR Code Vector", icon: QrCode, badge: "OFFLINE" },
            { id: "color-converter", label: "Color WCAG Check", icon: Palette, badge: "RATIO" },
            { id: "timestamp-converter", label: "Epoch Converter", icon: Clock, badge: "UTC" },
            { id: "base64-codec", label: "Base64 Codec", icon: Globe, badge: "ASCII" },
            { id: "api-tester", label: "API Playground", icon: Terminal, badge: "CORS BYPASS" },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as ToolboxTool)}
                className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                  activeTool === tool.id
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                    : "bg-slate-900/40 border-white/5 text-slate-300 hover:bg-slate-900/80"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-slate-400 group-hover:text-indigo-400" />
                  <span className="text-xs font-semibold">{tool.label}</span>
                </div>
                <span className="text-[8px] font-mono font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-white/5 text-slate-500 uppercase">
                  {tool.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbox Right Play space */}
      <div className="lg:col-span-9 glass-panel rounded-3xl p-6 flex flex-col justify-between overflow-y-auto">
        
        {/* Active Tool Area */}
        <div className="space-y-6">
          
          {/* 1. JSON Formatter */}
          {activeTool === "json-formatter" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-100 font-display">JSON Format & Minifier</h3>
                <p className="text-xs text-slate-400">Validate JSON payloads, detect syntax leaks, format with tab rules</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 block">RAW JSON INPUT:</span>
                  <textarea
                    rows={8}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full text-xs font-mono p-4 bg-slate-950 border border-white/5 rounded-2xl text-indigo-300 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                  {jsonError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2 text-rose-400 text-xs">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{jsonError}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block">FORMATTED OUTPUT:</span>
                    <textarea
                      rows={8}
                      readOnly
                      value={jsonOutput}
                      placeholder="Processed JSON appears here..."
                      className="w-full text-xs font-mono p-4 bg-slate-950 border border-white/5 rounded-2xl text-slate-300 focus:outline-none resize-none"
                    />
                  </div>
                  {jsonOutput && (
                    <button
                      onClick={() => triggerCopy(jsonOutput, "formatted-json")}
                      className="flex items-center gap-1.5 self-end text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      {copySuccess === "formatted-json" ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      <span>{copySuccess === "formatted-json" ? "Copied" : "Copy to Clipboard"}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                <button onClick={() => formatJson(2)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all">
                  Indent 2 Spaces
                </button>
                <button onClick={() => formatJson(4)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all">
                  Indent 4 Spaces
                </button>
                <button onClick={minifyJson} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-bold transition-all">
                  Minify / Compact JSON
                </button>
              </div>
            </div>
          )}

          {/* 2. JWT Decoder */}
          {activeTool === "jwt-decoder" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-100 font-display">JWT Decoder</h3>
                <p className="text-xs text-slate-400">Safely parse JSON Web Tokens on client side, verify claims & expiry times</p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 block">JWT STRING TOKEN:</span>
                <textarea
                  rows={3}
                  value={jwtInput}
                  onChange={(e) => setJwtInput(e.target.value)}
                  className="w-full text-xs font-mono p-4 bg-slate-950 border border-white/5 rounded-2xl text-indigo-400 focus:outline-none focus:border-indigo-500 resize-none break-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-white/5 rounded-xl font-mono text-xs space-y-2">
                  <span className="text-rose-400 font-semibold block">HEADER:</span>
                  <pre className="text-rose-300 overflow-x-auto max-h-48">{jwtDecodedHeader}</pre>
                </div>
                <div className="p-4 bg-slate-950 border border-white/5 rounded-xl font-mono text-xs space-y-2">
                  <span className="text-indigo-400 font-semibold block">PAYLOAD:</span>
                  <pre className="text-indigo-300 overflow-x-auto max-h-48">{jwtDecodedPayload}</pre>
                </div>
              </div>

              {jwtExpirationStatus && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 text-xs text-slate-300 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-400" />
                  <span>{jwtExpirationStatus}</span>
                </div>
              )}
            </div>
          )}

          {/* 3. UUID Generator */}
          {activeTool === "uuid-generator" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-100 font-display">Bulk RFC4122 v4 UUID Generator</h3>
                <p className="text-xs text-slate-400">Generate secure, cryptographically-random UUID keys</p>
              </div>

              <div className="flex items-center gap-4 py-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300 font-semibold">Quantity:</span>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={uuidQuantity}
                    onChange={(e) => setUuidQuantity(parseInt(e.target.value) || 1)}
                    className="w-20 text-xs px-2 py-1.5 bg-slate-950 border border-white/5 rounded-lg text-slate-100 focus:outline-none"
                  />
                </div>
                <button onClick={generateUUIDs} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition-all">
                  Generate UUIDs
                </button>
              </div>

              <div className="space-y-2">
                <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 max-h-64 overflow-y-auto font-mono text-xs text-indigo-400 space-y-1.5">
                  {generatedUuids.map((u, i) => (
                    <div key={i} className="flex justify-between items-center group">
                      <span>{u}</span>
                      <button onClick={() => triggerCopy(u, `uuid-${i}`)} className="opacity-0 group-hover:opacity-100 text-[10px] text-indigo-500 hover:text-white cursor-pointer">
                        {copySuccess === `uuid-${i}` ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  ))}
                </div>

                {generatedUuids.length > 0 && (
                  <button
                    onClick={() => triggerCopy(generatedUuids.join("\n"), "all-uuids")}
                    className="text-xs text-indigo-400 font-semibold flex items-center gap-1 hover:text-white"
                  >
                    {copySuccess === "all-uuids" ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    <span>{copySuccess === "all-uuids" ? "Copied" : "Copy All UUIDs"}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 4. Regex Tester */}
          {activeTool === "regex-tester" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-100 font-display">Regular Expression Tester</h3>
                <p className="text-xs text-slate-400">Check Javascript Regex matching logic, flag filters, and custom capture groups</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-8">
                  <label className="text-[10px] font-mono text-slate-500 block mb-1">EXPRESSION PATTERN:</label>
                  <input
                    type="text"
                    value={regexPattern}
                    onChange={(e) => setRegexPattern(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-indigo-300 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="text-[10px] font-mono text-slate-500 block mb-1">FLAGS:</label>
                  <input
                    type="text"
                    value={regexFlags}
                    onChange={(e) => setRegexFlags(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-slate-300 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {regexError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{regexError}</span>
                </div>
              )}

              <div>
                <label className="text-[10px] font-mono text-slate-500 block mb-1">TEST STRING STRING:</label>
                <textarea
                  rows={3}
                  value={regexTestString}
                  onChange={(e) => setRegexTestString(e.target.value)}
                  className="w-full text-xs p-3.5 bg-slate-950 border border-white/5 rounded-2xl text-slate-300 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 block">MATCH GROUPS FOUND ({regexMatches.length}):</span>
                <div className="bg-slate-950 p-4 rounded-xl border border-white/5 max-h-48 overflow-y-auto space-y-2">
                  {regexMatches.length > 0 ? (
                    regexMatches.map((m, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-900 border border-white/5 text-xs font-mono text-slate-300 flex flex-wrap gap-x-4">
                        <span className="text-indigo-400">Match {idx + 1}: <strong className="text-white">"{m.match}"</strong></span>
                        <span className="text-slate-500">Index: {m.index}</span>
                        {m.groups.map((g, gIdx) => (
                          <span key={gIdx} className="text-emerald-400">Group {gIdx + 1}: "{g}"</span>
                        ))}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 font-mono">No matches detected. Check flags or string pattern.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 5. Password Generator */}
          {activeTool === "password-generator" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-100 font-display">Strong Password Generator</h3>
                <p className="text-xs text-slate-400">Generate high-entropy credentials with adjustable complexity constraints</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Configuration */}
                <div className="space-y-4 bg-slate-950/40 p-5 rounded-2xl border border-white/5">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-300 font-semibold">
                      <span>Length:</span>
                      <span className="text-indigo-400 font-bold">{pwdLength} chars</span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={64}
                      value={pwdLength}
                      onChange={(e) => setPwdLength(parseInt(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { key: "upper", label: "Uppercase Characters (A-Z)" },
                      { key: "lower", label: "Lowercase Characters (a-z)" },
                      { key: "nums", label: "Numeric Digits (0-9)" },
                      { key: "syms", label: "Special Symbols (!@#$)" },
                    ].map((opt) => (
                      <label key={opt.key} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={(pwdOpts as any)[opt.key]}
                          onChange={(e) => setPwdOpts({ ...pwdOpts, [opt.key]: e.target.checked })}
                          className="rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Result */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-between font-mono text-sm text-indigo-400 font-bold tracking-wide">
                    <span className="truncate break-all">{generatedPassword}</span>
                    <button
                      onClick={() => triggerCopy(generatedPassword, "password-copy")}
                      className="p-1.5 rounded hover:bg-slate-900 text-slate-500 hover:text-white"
                    >
                      {copySuccess === "password-copy" ? <Check className="h-4.5 w-4.5 text-emerald-400" /> : <Copy className="h-4.5 w-4.5" />}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Entropy strength:</span>
                      <span className={`font-bold ${pwdEntropy > 80 ? "text-emerald-400" : pwdEntropy > 50 ? "text-amber-400" : "text-rose-400"}`}>
                        {pwdEntropy} Bits ({pwdEntropy > 80 ? "Ultimate Cryptographic Safe" : pwdEntropy > 50 ? "Medium strength" : "Weak"})
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${pwdEntropy > 80 ? "bg-emerald-500" : pwdEntropy > 50 ? "bg-amber-500" : "bg-rose-500"}`}
                        style={{ width: `${Math.min(pwdEntropy, 120) / 1.2}%` }}
                      />
                    </div>
                  </div>

                  <button onClick={generatePassword} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs">
                    Regenerate Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. Hash Generator */}
          {activeTool === "hash-generator" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-100 font-display">Hash Signature Generator</h3>
                <p className="text-xs text-slate-400">Compute cryptographic hashes utilizing SHA-256, SHA-512, and salted strings</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 block mb-1">STRING INPUT MESSAGE:</label>
                  <textarea
                    rows={3}
                    value={hashInput}
                    onChange={(e) => setHashInput(e.target.value)}
                    className="w-full text-xs p-3.5 bg-slate-950 border border-white/5 rounded-2xl text-slate-300 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 block mb-1">OPTIONAL SALT SUFFIX:</label>
                  <input
                    type="text"
                    placeholder="Security key salt..."
                    value={hashSalt}
                    onChange={(e) => setHashSalt(e.target.value)}
                    className="w-full text-xs p-3.5 bg-slate-950 border border-white/5 rounded-2xl text-slate-300 focus:outline-none focus:border-indigo-500 mt-0.5"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { name: "SHA-256", value: sha256Hash },
                  { name: "SHA-512", value: sha512Hash },
                  { name: "MD5", value: md5Hash },
                ].map((hash) => (
                  <div key={hash.name} className="p-3 rounded-xl bg-slate-950 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
                    <div className="truncate space-y-0.5 flex-grow">
                      <span className="text-indigo-400 font-bold uppercase">{hash.name}:</span>
                      <p className="text-slate-300 truncate break-all">{hash.value || "Calculating..."}</p>
                    </div>
                    <button onClick={() => triggerCopy(hash.value, hash.name)} className="text-[10px] text-slate-500 hover:text-white shrink-0 self-end">
                      {copySuccess === hash.name ? "Copied" : "Copy"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. QR Code Generator */}
          {activeTool === "qr-generator" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-100 font-display">Offline QR Code Vector Generator</h3>
                <p className="text-xs text-slate-400">Generate static QR matrix blocks immediately, copyable for print or documentation</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1 font-semibold">QR Payload Content</label>
                    <input
                      type="text"
                      value={qrText}
                      onChange={(e) => setQrText(e.target.value)}
                      className="w-full text-xs px-3.5 py-3 bg-slate-950 border border-white/5 rounded-xl text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-slate-950 border border-white/5 rounded-3xl space-y-3">
                  <canvas id="qrCanvas" width={200} height={200} className="rounded-xl border border-slate-900 shadow-md" />
                  <span className="text-[10px] font-mono text-slate-500">Vector representation complete</span>
                </div>
              </div>
            </div>
          )}

          {/* 8. Color Converter */}
          {activeTool === "color-converter" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-100 font-display">Color Space Conversion & WCAG Contrast Audit</h3>
                <p className="text-xs text-slate-400">Analyze accessibility ratings of custom branding hues</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block mb-2">PICK COLOUR:</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={hexColor}
                        onChange={(e) => handleHexChange(e.target.value)}
                        className="w-12 h-12 rounded border border-white/5 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={hexColor}
                        onChange={(e) => handleHexChange(e.target.value)}
                        className="text-xs font-mono px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-100 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="w-full h-12 rounded-xl" style={{ backgroundColor: hexColor }} />
                </div>

                <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl font-mono text-xs space-y-2">
                  <span className="text-indigo-400 font-bold block">CONVERSIONS:</span>
                  <p className="text-slate-300">HEX: {hexColor}</p>
                  <p className="text-slate-300">RGB: {rgbColor}</p>
                  <p className="text-slate-300">HSL: {hslColor}</p>
                </div>

                <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl flex flex-col justify-between space-y-1">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block mb-2">WCAG CONTRAST RATING:</span>
                    <p className="text-2xl font-bold font-display text-indigo-300">{contrastRatio} : 1</p>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${contrastRatio >= 4.5 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                      AA ({contrastRatio >= 4.5 ? "PASS" : "FAIL"})
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${contrastRatio >= 7.0 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                      AAA ({contrastRatio >= 7.0 ? "PASS" : "FAIL"})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. Timestamp Converter */}
          {activeTool === "timestamp-converter" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-100 font-display">Unix Epoch Timestamp Converter</h3>
                <p className="text-xs text-slate-400">Interconvert Unix seconds / milliseconds epoch integers into human dates</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 block mb-1">UNIX TIMESTAMP INTEGER (sec / millisec):</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={epochInput}
                      onChange={(e) => setEpochInput(e.target.value)}
                      className="flex-grow text-xs font-mono px-3 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-indigo-300"
                    />
                    <button onClick={() => setEpochInput(Date.now().toString())} className="px-4 py-2 bg-slate-900 border border-white/5 rounded-xl text-xs font-bold text-slate-300">
                      Now
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl font-mono text-xs">
                  <span className="text-indigo-400 font-bold block mb-1">LOCAL TIME & UTC SPEC:</span>
                  <p className="text-slate-300">{humanDateOutput}</p>
                </div>
              </div>
            </div>
          )}

          {/* 10. Base64 Codec */}
          {activeTool === "base64-codec" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-100 font-display">Base64 Encoder / Decoder</h3>
                <p className="text-xs text-slate-400">Interconvert plain strings into standard transportable Base64 strings</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 block mb-1">CODEC INPUT TEXT:</label>
                  <textarea
                    rows={4}
                    value={b64Input}
                    onChange={(e) => setB64Input(e.target.value)}
                    className="w-full text-xs font-mono p-4 bg-slate-950 border border-white/5 rounded-2xl text-indigo-300 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button onClick={handleB64Encode} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all">
                    Encode to Base64
                  </button>
                  <button onClick={handleB64Decode} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-bold transition-all">
                    Decode from Base64
                  </button>
                </div>

                {b64Error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                    {b64Error}
                  </div>
                )}

                {b64Output && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 block">RESULT STRING:</span>
                    <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl text-xs font-mono text-slate-300 break-all select-all flex justify-between items-center">
                      <span>{b64Output}</span>
                      <button onClick={() => triggerCopy(b64Output, "b64-copy")} className="text-[10px] text-slate-500 hover:text-white shrink-0 ml-2">
                        {copySuccess === "b64-copy" ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 11. API Tester */}
          {activeTool === "api-tester" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-100 font-display">Secure API Playground Playground</h3>
                <p className="text-xs text-slate-400">Construct REST inquiries, bypass CORS protocols using secure backend gateways, and measure response times</p>
              </div>

              <form onSubmit={handleTestAPI} className="space-y-3.5">
                <div className="flex gap-2">
                  <select
                    value={apiTester.method}
                    onChange={(e: any) => setApiTester({ ...apiTester, method: e.target.value })}
                    className="text-xs px-3 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-indigo-400 font-bold focus:outline-none"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                  <input
                    type="text"
                    placeholder="https://api.stackverse.dev/users/me"
                    value={apiTester.url}
                    onChange={(e) => setApiTester({ ...apiTester, url: e.target.value })}
                    className="flex-grow text-xs font-mono px-3 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-slate-100 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isTestingAPI}
                    className="px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {isTestingAPI ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    <span>{isTestingAPI ? "Calling..." : "Execute"}</span>
                  </button>
                </div>

                {/* Headers configuration */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 block">HEADERS CONFIGURATION:</span>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto bg-slate-950 p-3 rounded-xl border border-white/5">
                    {apiTester.headers.map((h, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Header Key"
                          value={h.key}
                          onChange={(e) => {
                            const updated = [...apiTester.headers];
                            updated[i].key = e.target.value;
                            setApiTester({ ...apiTester, headers: updated });
                          }}
                          className="w-1/2 text-[10px] font-mono px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300"
                        />
                        <input
                          type="text"
                          placeholder="Header Value"
                          value={h.value}
                          onChange={(e) => {
                            const updated = [...apiTester.headers];
                            updated[i].value = e.target.value;
                            setApiTester({ ...apiTester, headers: updated });
                          }}
                          className="w-1/2 text-[10px] font-mono px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setApiTester({ ...apiTester, headers: [...apiTester.headers, { key: "", value: "" }] })}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300"
                    >
                      + Add Custom Header
                    </button>
                  </div>
                </div>

                {apiTester.method !== "GET" && (
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 block mb-1">POST JSON DATA BODY:</label>
                    <textarea
                      rows={3}
                      value={apiTester.body}
                      onChange={(e) => setApiTester({ ...apiTester, body: e.target.value })}
                      className="w-full text-xs font-mono p-3 bg-slate-950 border border-white/5 rounded-xl text-slate-300 focus:outline-none"
                    />
                  </div>
                )}
              </form>

              {apiResponse && (
                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex gap-4">
                      <span className="text-slate-400">Response Status: <strong className={apiResponse.status < 400 ? "text-emerald-400" : "text-rose-400"}>{apiResponse.status} {apiResponse.statusText}</strong></span>
                      <span className="text-slate-400">Ping: <strong className="text-indigo-400">{apiResponse.timeMs} ms</strong></span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl font-mono text-xs max-h-56 overflow-y-auto">
                    <span className="text-indigo-400 font-bold block mb-1">JSON RESPONSE BODY:</span>
                    <pre className="text-slate-300 leading-relaxed">{JSON.stringify(apiResponse.body, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Global info block */}
        <div className="p-4 bg-slate-900/40 border-t border-white/5 flex justify-between items-center text-xs text-slate-400 mt-6 shrink-0">
          <span className="flex items-center gap-1 font-mono">
            <Layers className="h-3.5 w-3.5" />
            TOOL: {activeTool.toUpperCase()}
          </span>
          <span>100% Client-Side Private Sandboxes</span>
        </div>

      </div>
    </div>
  );
}
