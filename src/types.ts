// Shared types and models for StackVerse Hub

export type ActivePage =
  | "dashboard"
  | "ai-workspace"
  | "project-generator"
  | "dev-toolbox"
  | "api-hub"
  | "learning-center"
  | "community"
  | "launch-center"
  | "pricing"
  | "user-profile"
  | "settings";

// AI Workspace Types
export type WorkspaceMode = "chat" | "bugfix" | "explain" | "sql" | "api" | "doc" | "architecture";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  codeBlocks?: { language: string; code: string }[];
}

export interface WorkspaceSession {
  id: string;
  title: string;
  mode: WorkspaceMode;
  messages: ChatMessage[];
  createdAt: string;
}

// Project Generator Types
export interface ProjectBlueprint {
  title: string;
  tagline: string;
  description: string;
  techStack: { name: string; category: string; reason: string }[];
  folderStructure: Record<string, any>;
  prd: {
    overview: string;
    targetAudience: string[];
    features: { title: string; description: string; priority: string }[];
    nonFunctional: string[];
  };
  userStories: string[];
  roadmap: { milestone: string; duration: string; tasks: string[] }[];
}

// Developer Toolbox Types
export type ToolboxTool =
  | "json-formatter"
  | "jwt-decoder"
  | "uuid-generator"
  | "regex-tester"
  | "password-generator"
  | "hash-generator"
  | "qr-generator"
  | "color-converter"
  | "timestamp-converter"
  | "base64-codec"
  | "api-tester";

export interface APITestRequest {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers: { key: string; value: string }[];
  body: string;
}

export interface APITestResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
  timeMs: number;
}

// API Hub Types
export interface DeveloperAPI {
  id: string;
  name: string;
  logo: string;
  category: string;
  authType: "API Key" | "OAuth 2.0" | "None" | "JWT";
  pricing: "Free" | "Freemium" | "Paid";
  popularity: number; // 1-5 stars or 1-100 rating
  description: string;
  endpoint: string;
  documentation: string;
  exampleRequest: string;
}

// Learning Center Types
export interface Course {
  id: string;
  title: string;
  desc: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  xpReward: number;
  lessons: { id: string; title: string; duration: string; completed: boolean }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface CodingChallenge {
  id: string;
  title: string;
  desc: string;
  stub: string;
  solution: string;
  testCase: string; // JavaScript string to eval or simple check
}

// Community Types
export interface ForumPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    title: string;
  };
  content: string;
  likes: number;
  hasLiked?: boolean;
  comments: { author: string; avatar: string; content: string; time: string }[];
  tags: string[];
  time: string;
  projectShowcase?: {
    name: string;
    tagline: string;
    link: string;
  };
}

// Launch Center Types
export interface DeploymentChecklistItem {
  id: string;
  task: string;
  category: "Security" | "Performance" | "SEO" | "Database" | "Config";
  checked: boolean;
}

export interface WebAuditReport {
  seoScore: number;
  performanceScore: number;
  accessibilityScore: number;
  securityScore: number;
  metaCheck: {
    title: string;
    description: string;
    openGraph: string;
    robotsTxt: string;
    sitemap: string;
  };
  findings: {
    category: "SEO" | "Performance" | "Accessibility" | "Security";
    title: string;
    impact: "High" | "Medium" | "Low";
    description: string;
    remediation: string;
  }[];
  recommendations: string[];
}
