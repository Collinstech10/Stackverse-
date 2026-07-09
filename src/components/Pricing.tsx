import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Check,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  ShieldAlert,
  Globe
} from "lucide-react";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [scaleVolume, setScaleVolume] = useState<number>(25); // Drag slider representing dev count

  // Subscriptions pricing plans
  const getPlanPrices = () => {
    const isAnn = billingCycle === "annual";
    return {
      free: 0,
      pro: isAnn ? 19 : 24,
      business: isAnn ? 79 : 99,
      enterprise: "Custom"
    };
  };

  const prices = getPlanPrices();

  // Highlight plan based on drag slider values
  const getSuggestedPlan = () => {
    if (scaleVolume <= 5) return "free";
    if (scaleVolume <= 30) return "pro";
    if (scaleVolume <= 100) return "business";
    return "enterprise";
  };

  const activeSuggestion = getSuggestedPlan();

  return (
    <div className="space-y-10 pb-10">
      
      {/* Pricing Header metadata */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-bold text-[10px] uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Flexible SaaS Sandboxing</span>
        </div>
        <h2 className="text-2xl font-bold font-display text-slate-100">Transparent Developer Pricing</h2>
        <p className="text-slate-400 text-xs leading-relaxed">
          Unlock high-speed compilation pipelines, durable cluster persistence, full Gemini core limits, and unified team monitoring.
        </p>

        {/* Annual/Monthly Billing cycle toggle */}
        <div className="pt-4 flex justify-center items-center gap-3">
          <span className={`text-xs ${billingCycle === "monthly" ? "text-indigo-400 font-bold" : "text-slate-400"}`}>
            Bill Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
            className="w-12 h-6 rounded-full bg-slate-950 border border-white/10 p-1 flex items-center relative transition-colors"
          >
            <div className={`h-4 w-4 rounded-full bg-indigo-500 transition-all ${
              billingCycle === "annual" ? "translate-x-6" : "translate-x-0"
            }`} />
          </button>
          <span className={`text-xs flex items-center gap-1.5 ${billingCycle === "annual" ? "text-indigo-400 font-bold" : "text-slate-400"}`}>
            Bill Yearly
            <span className="text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              SAVE 20%
            </span>
          </span>
        </div>
      </div>

      {/* Scale Slider widget */}
      <div className="glass-panel p-6 rounded-3xl max-w-2xl mx-auto space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-300 font-semibold">Estimated developer scale capacity:</span>
          <span className="text-indigo-400 font-bold font-mono text-sm">{scaleVolume} Creators</span>
        </div>
        
        <input
          type="range"
          min={1}
          max={150}
          value={scaleVolume}
          onChange={(e) => setScaleVolume(parseInt(e.target.value))}
          className="w-full accent-indigo-500 cursor-pointer"
        />

        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>1 Dev</span>
          <span>Suggesting: <strong className="text-indigo-400 uppercase font-sans font-bold">{activeSuggestion} PLAN</strong></span>
          <span>150+ Devs</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            id: "free",
            name: "Starter Sandbox",
            price: prices.free,
            limit: "Up to 5 developers",
            desc: "For local hackathons and simple client-side coding utility blocks.",
            features: [
              "Standard AI Chat (Gemini Core)",
              "JSON Formatters & Base64 toolset",
              "Local browser key persistence",
              "Port :3000 secure gateway"
            ]
          },
          {
            id: "pro",
            name: "Stack Pro",
            price: prices.pro,
            limit: "Up to 30 developers",
            desc: "For individual SaaS builders and growing software startups.",
            features: [
              "Expanded AI Chat limit (500 req/mo)",
              "Full Scaffolding Project trees",
              "Shared Postgres sandbox mirrors",
              "Secure external CORS proxying",
              "Lighthouse SEO vitals audit"
            ]
          },
          {
            id: "business",
            name: "Cluster Business",
            price: prices.business,
            limit: "Up to 100 developers",
            desc: "For high-performance engineering groups requiring scale SLAs.",
            features: [
              "Unlimited AI assistant requests",
              "Continuous sitemap.xml monitors",
              "99.99% uptime cluster guarantees",
              "Multi-user Scrum backlog syncs",
              "Advanced team logs dashboard"
            ]
          },
          {
            id: "enterprise",
            name: "Galactic Enterprise",
            price: prices.enterprise,
            limit: "Unlimited developers",
            desc: "Custom deployment boundaries, dedicated VPN pipelines, compliance SLAs.",
            features: [
              "Dedicated VPC database clusters",
              "Private secure AI models",
              "Custom domain white-labeling",
              "Direct engineering support SLA",
              "HIPAA & SOC-2 compliance check"
            ]
          }
        ].map((plan) => {
          const isSuggested = activeSuggestion === plan.id;
          return (
            <div
              key={plan.id}
              className={`p-6 rounded-3xl border text-left flex flex-col justify-between transition-all relative ${
                isSuggested
                  ? "bg-slate-900 border-indigo-500 shadow-2xl scale-[1.03]"
                  : "bg-slate-950/40 border-white/5 hover:border-white/10"
              }`}
            >
              {isSuggested && (
                <span className="absolute -top-3 right-6 text-[9px] font-bold font-mono tracking-wider bg-indigo-600 border border-indigo-400 text-white px-3 py-1 rounded-full uppercase">
                  ⭐ RECOMMENDED FOR YOU
                </span>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-100 font-display">{plan.name}</h3>
                  <p className="text-[10px] text-indigo-400 font-mono font-semibold uppercase">{plan.limit}</p>
                </div>

                <div className="flex items-baseline gap-1 py-1">
                  <span className="text-2xl font-bold font-display text-slate-100">
                    {typeof plan.price === "number" ? `$${plan.price}` : plan.price}
                  </span>
                  {typeof plan.price === "number" && (
                    <span className="text-xs text-slate-500">/ mo</span>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-normal border-b border-white/5 pb-4">
                  {plan.desc}
                </p>

                <ul className="space-y-2.5 pt-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-[11px] text-slate-300">
                      <Check className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  isSuggested
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                    : "bg-slate-900 border border-white/5 hover:border-white/10 text-slate-300"
                }`}>
                  {plan.id === "enterprise" ? "Contact Enterprise Sales" : "Initiate Checkout Hub"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
