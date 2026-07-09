/**
 * Utility helper to manage dynamic StackVerse workspace stats, XP, and token usage in localStorage.
 */

export interface Project {
  id: string;
  name: string;
  status: string;
  tech: string;
  commits: number;
  lastDeployed: string;
}

export interface Task {
  id: string;
  text: string;
  done: boolean;
  priority: string;
}

export interface CalendarEvent {
  title: string;
  time: string;
  type: string;
}

// Initial demo templates if the user requests to load them
export const DEMO_PROJECTS: Project[] = [
  { id: "p1", name: "auth-gateway-lambda", status: "Deployed", tech: "TypeScript, Go", commits: 24, lastDeployed: "10m ago" },
  { id: "p2", name: "stripe-bento-checkout", status: "Building", tech: "React, Express", commits: 18, lastDeployed: "Running build" },
  { id: "p3", name: "gemini-summarizer-pro", status: "Active", tech: "Python, Next.js", commits: 42, lastDeployed: "2 hrs ago" },
  { id: "p4", name: "vector-store-db-driver", status: "Staged", tech: "Rust, WebAssembly", commits: 9, lastDeployed: "1 day ago" },
];

export const DEMO_TASKS: Task[] = [
  { id: "t1", text: "Fix database pool leak in auth proxy", done: false, priority: "High" },
  { id: "t2", text: "Optimize images for faster Lighthouse scores", done: true, priority: "Medium" },
  { id: "t3", text: "Integrate mock Stripe webhooks in test suite", done: false, priority: "High" },
  { id: "t4", text: "Complete Advanced LLM Architecture Quiz", done: false, priority: "Low" },
];

export const DEMO_CALENDAR: Record<string, CalendarEvent[]> = {
  "2026-07-07": [
    { title: "Lighthouse V10 Performance Audit Run", time: "14:00", type: "audit" },
    { title: "Core Sync with Launch Pad Pipeline", time: "16:30", type: "launch" }
  ],
  "2026-07-08": [
    { title: "Weekly Dev Demo Meeting", time: "10:00", type: "sync" },
    { title: "Deploy vector-store-db v1.4", time: "15:00", type: "release" }
  ],
  "2026-07-10": [
    { title: "StackVerse Virtual Hackathon Begins", time: "09:00", type: "event" }
  ],
  "2026-07-15": [
    { title: "Monthly Production Release Milestone", time: "11:00", type: "release" }
  ],
};

// State Managers
export function getStoredXP(): number {
  const val = localStorage.getItem("stackverse_xp");
  return val ? parseInt(val, 10) : 0;
}

export function addXP(amount: number): number {
  const current = getStoredXP();
  const next = current + amount;
  localStorage.setItem("stackverse_xp", next.toString());
  // Dispatch a custom event so components can sync instantly
  window.dispatchEvent(new Event("stackverse_xp_update"));
  return next;
}

export function getStoredTokens(): number {
  const val = localStorage.getItem("stackverse_token_usage");
  return val ? parseInt(val, 10) : 0;
}

export function addTokens(amount: number): number {
  const current = getStoredTokens();
  const next = current + amount;
  localStorage.setItem("stackverse_token_usage", next.toString());
  window.dispatchEvent(new Event("stackverse_token_update"));
  return next;
}

export function getStoredProjects(): Project[] {
  const val = localStorage.getItem("stackverse_projects");
  if (!val) return [];
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
}

export function saveStoredProjects(projects: Project[]) {
  localStorage.setItem("stackverse_projects", JSON.stringify(projects));
}

export function getStoredTasks(): Task[] {
  const val = localStorage.getItem("stackverse_tasks");
  if (!val) return [];
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
}

export function saveStoredTasks(tasks: Task[]) {
  localStorage.setItem("stackverse_tasks", JSON.stringify(tasks));
}

export function getStoredCalendar(): Record<string, CalendarEvent[]> {
  const val = localStorage.getItem("stackverse_calendar");
  if (!val) return {};
  try {
    return JSON.parse(val);
  } catch {
    return {};
  }
}

export function saveStoredCalendar(calendar: Record<string, CalendarEvent[]>) {
  localStorage.setItem("stackverse_calendar", JSON.stringify(calendar));
}
