import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Initialize the GoogleGenAI client on the server side
// The GEMINI_API_KEY is supplied automatically by the container environment.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Robust wrapper for calling generateContent with retries and model fallback
async function generateContentWithRetry(params: {
  contents: any;
  config?: any;
  model?: string;
  maxRetries?: number;
}): Promise<any> {
  const primaryModel = params.model || "gemini-3.5-flash";
  const fallbackModel = "gemini-3.1-flash-lite";
  const maxRetries = params.maxRetries ?? 3;

  let currentModel = primaryModel;
  let attempt = 0;
  let delay = 1000; // start with 1 second delay

  while (true) {
    try {
      console.log(`[Gemini Call] Requesting ${currentModel} (Attempt ${attempt + 1}/${maxRetries + 1})...`);
      const response = await ai.models.generateContent({
        model: currentModel,
        contents: params.contents,
        config: params.config,
      });
      return response;
    } catch (error: any) {
      attempt++;
      console.error(`[Gemini Error] Attempt ${attempt} failed with model ${currentModel}:`, error);

      // Determine if the error is retryable (e.g., 503, 429, or network errors)
      const isRetryable = 
        error.message?.includes("503") || 
        error.message?.includes("429") ||
        error.message?.toLowerCase().includes("unavailable") ||
        error.message?.toLowerCase().includes("rate limit") ||
        error.message?.toLowerCase().includes("high demand") ||
        error.status === 503 ||
        error.status === 429 ||
        error.code === 503 ||
        error.code === 429;

      if (attempt > maxRetries || !isRetryable) {
        // If we ran out of retries on primary, or if it is not retryable, try fallback model once
        if (currentModel === primaryModel && currentModel !== fallbackModel) {
          console.warn(`[Gemini Fallback] Primary model ${primaryModel} failed. Switching to fallback model ${fallbackModel}...`);
          currentModel = fallbackModel;
          attempt = 0; // reset attempts for fallback
          delay = 1000;
          continue;
        }
        throw error;
      }

      // Wait with exponential backoff before retrying
      console.log(`[Gemini Retry] Waiting ${delay}ms before next attempt...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // double the delay for next backoff
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for body parsing
  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // 1. AI Chat & Developer Workspace Endpoint
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { prompt, history, mode } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Configure a professional developer system instruction based on the active assistant sub-mode
      let systemInstruction = "You are an elite, full-stack software engineer and cloud architect. Help the developer with clean, secure, performant, and production-ready solutions. Follow SOLID principles and write clear, self-documenting code. Always format code snippets using markdown block styling with the correct language tag.";

      if (mode === "bugfix") {
        systemInstruction = "You are an expert debugger and security auditor. Analyze the provided code, find security vulnerabilities or bugs, explain them simply, and output a fully corrected, highly optimized version of the code. Highlight what was changed and why.";
      } else if (mode === "explain") {
        systemInstruction = "You are a senior software educator. Break down the provided code, architecture, or concept step-by-step. Use clear, simple, professional language. Explain the 'why' behind the design and any potential performance or scalability considerations.";
      } else if (mode === "sql") {
        systemInstruction = "You are an expert database administrator and SQL tuning engineer. Generate highly optimized PostgreSQL / standard SQL queries based on the requested requirements. Explain index requirements, query complexity, and schema design if applicable.";
      } else if (mode === "api") {
        systemInstruction = "You are an expert API designer. Design RESTful, GraphQL, or gRPC interfaces. Provide clean JSON schemas, endpoint designs, request/response models, and fully annotated TypeScript implementation code.";
      } else if (mode === "doc") {
        systemInstruction = "You are a professional technical writer. Generate clean, comprehensive, user-friendly markdown documentation, developer guides, README setups, or API specifications (e.g., OpenAPI standard) for the provided code or feature.";
      } else if (mode === "architecture") {
        systemInstruction = "You are a principal systems architect. Plan robust, cloud-native software architectures capable of scaling to millions of users. Discuss data models, cache strategies, job queues, load balancing, and system boundary topologies. Use elegant markdown-based diagrams or flow descriptions.";
      }

      // Format history into the SDK content parts format
      const contents: any[] = [];
      if (history && Array.isArray(history)) {
        history.forEach((msg: any) => {
          contents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }]
          });
        });
      }
      contents.push({ role: "user", parts: [{ text: prompt }] });

      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.2, // Low temperature for high-quality, deterministic technical outputs
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Chat API Error:", error);
      res.status(500).json({ error: error.message || "Failed to process developer workspace request." });
    }
  });

  // 2. Project Blueprint Generator Endpoint (JSON schema model)
  app.post("/api/gemini/generate-project", async (req, res) => {
    try {
      const { prompt, techPreferences, platform } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "SaaS/Project request description is required" });
      }

      const generationPrompt = `Generate a comprehensive production-ready project blueprint for a SaaS or technical product described as follows: "${prompt}".
Target Platform: ${platform || "Any / Full-stack Web"}.
Tech preferences/constraints: ${techPreferences || "Modern premium tech stack"}.

Provide a highly realistic, full-featured blueprint inside a single structured JSON response. Ensure the roadmap has real milestones, the folder structure is detailed, and the user stories match professional Scrum methodologies.`;

      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: generationPrompt,
        config: {
          systemInstruction: "You are a master Product Manager and Technical Architect. Create an exhaustive, elite project blueprint in strict JSON format. Do not include markdown codeblocks around the JSON. Provide complete details - do not use placeholders or generic items.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: ["title", "tagline", "description", "techStack", "folderStructure", "prd", "userStories", "roadmap"],
            properties: {
              title: { type: Type.STRING, description: "Highly memorable product name" },
              tagline: { type: Type.STRING, description: "A punchy, professional marketing tagline" },
              description: { type: Type.STRING, description: "An executive product description" },
              techStack: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["name", "category", "reason"],
                  properties: {
                    name: { type: Type.STRING },
                    category: { type: Type.STRING, description: "e.g., Frontend, Backend, Database, Auth, AI, Hosting" },
                    reason: { type: Type.STRING, description: "Detailed justification for using this in this specific architecture" }
                  }
                }
              },
              folderStructure: {
                type: Type.OBJECT,
                description: "A nested directory representation of the project files. Keys are directory or file names, values are either child objects (for folders) or string descriptions (for files)."
              },
              prd: {
                type: Type.OBJECT,
                required: ["overview", "targetAudience", "features", "nonFunctional"],
                properties: {
                  overview: { type: Type.STRING, description: "Overview of the Product Requirements Document" },
                  targetAudience: { type: Type.ARRAY, items: { type: Type.STRING } },
                  features: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["title", "description", "priority"],
                      properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        priority: { type: Type.STRING, description: "P0 (Critical), P1 (High), P2 (Medium)" }
                      }
                    }
                  },
                  nonFunctional: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Security, latency, availability requirements" }
                }
              },
              userStories: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of well-formatted Scrum user stories: 'As a [user], I want to [action] so that [benefit]'"
              },
              roadmap: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["milestone", "duration", "tasks"],
                  properties: {
                    milestone: { type: Type.STRING, description: "e.g., Phase 1: MVP Setup" },
                    duration: { type: Type.STRING, description: "e.g., 2 weeks" },
                    tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                }
              }
            }
          }
        }
      });

      const blueprint = JSON.parse(response.text || "{}");
      res.json(blueprint);
    } catch (error: any) {
      console.error("Project Generator API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate project blueprint." });
    }
  });

  // 3. Launch Pad SEO/Audit Endpoint
  app.post("/api/gemini/launch-audit", async (req, res) => {
    try {
      const { url, rules } = req.body;

      if (!url) {
        return res.status(400).json({ error: "Target URL is required for the audit" });
      }

      const auditPrompt = `Analyze the website and SEO performance for the target URL: "${url}".
Provide a realistic simulated SEO, Accessibility, Security, and Performance report using expert criteria.
Since this is an interactive developer tool, generate a highly detailed and actionable audit report including real issues, solutions, and code improvements.`;

      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: auditPrompt,
        config: {
          systemInstruction: "You are an elite web vitals optimization engineer and SEO auditor. Provide an interactive audit report in strict JSON format. Do not use generic results, make them tailored to the domain and rules requested.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: ["seoScore", "performanceScore", "accessibilityScore", "securityScore", "findings", "recommendations", "metaCheck"],
            properties: {
              seoScore: { type: Type.INTEGER },
              performanceScore: { type: Type.INTEGER },
              accessibilityScore: { type: Type.INTEGER },
              securityScore: { type: Type.INTEGER },
              metaCheck: {
                type: Type.OBJECT,
                required: ["title", "description", "openGraph", "robotsTxt", "sitemap"],
                properties: {
                  title: { type: Type.STRING, description: "e.g. Found: StackVerse, length 42 chars - Good" },
                  description: { type: Type.STRING, description: "Status of description meta tag" },
                  openGraph: { type: Type.STRING, description: "Status of OG tag analysis" },
                  robotsTxt: { type: Type.STRING, description: "Robots.txt status" },
                  sitemap: { type: Type.STRING, description: "Sitemap status" }
                }
              },
              findings: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["category", "title", "impact", "description", "remediation"],
                  properties: {
                    category: { type: Type.STRING, description: "SEO, Performance, Accessibility, or Security" },
                    title: { type: Type.STRING },
                    impact: { type: Type.STRING, description: "High, Medium, Low" },
                    description: { type: Type.STRING },
                    remediation: { type: Type.STRING, description: "Concrete code or design action" }
                  }
                }
              },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Ranked list of top actions to complete next"
              }
            }
          }
        }
      });

      const auditReport = JSON.parse(response.text || "{}");
      res.json(auditReport);
    } catch (error: any) {
      console.error("Audit Pad API Error:", error);
      res.status(500).json({ error: error.message || "Failed to perform simulated web audit." });
    }
  });

  // 4. Secure API Playground Proxy
  // Allows testing of endpoints from the Developer Toolbox / API Hub without CORS issues
  app.post("/api/proxy", async (req, res) => {
    try {
      const { url, method, headers, body } = req.body;

      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      // Handle custom local mock routes to provide an amazing experience even without external API internet access
      if (url.startsWith("https://api.stackverse.dev") || url.includes("mock")) {
        const path = url.replace(/https:\/\/api\.stackverse\.dev/, "");
        const delay = Math.floor(Math.random() * 400) + 100; // Simulated latency
        await new Promise((resolve) => setTimeout(resolve, delay));

        if (path.includes("/users/me")) {
          return res.json({
            id: "usr_94a28f8f",
            username: "stack_dev",
            email: "dev@stackverse.io",
            roles: ["admin", "creator"],
            github: "github.com/stack_dev",
            apiKeyActive: true,
            createdAt: "2026-01-01T00:00:00.000Z"
          });
        }

        if (path.includes("/analytics/daily")) {
          return res.json({
            ok: true,
            date: new Date().toISOString().split("T")[0],
            metrics: {
              requests: 12490,
              avgLatencyMs: 42,
              errorRatePercent: 0.04,
              activeUsers: 843
            }
          });
        }

        return res.json({
          message: "Welcome to StackVerse Hub secure proxy!",
          method: method || "GET",
          headers: headers || {},
          receivedBody: body || null,
          mocked: true,
          status: 200,
          timestamp: new Date().toISOString()
        });
      }

      // Real fetch implementation for actual web requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        method: method || "GET",
        headers: headers || {},
        body: method !== "GET" && method !== "HEAD" && body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const responseContentType = response.headers.get("content-type") || "";
      let responseBody;

      if (responseContentType.includes("application/json")) {
        responseBody = await response.json();
      } else {
        responseBody = await response.text();
      }

      res.status(response.status).json({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseBody
      });

    } catch (error: any) {
      console.error("API Proxy Error:", error);
      res.status(500).json({ error: error.message || "Failed to proxy request. The URL might be offline, invalid, or blocked by CORS." });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StackVerse Hub Server is actively running on http://localhost:${PORT}`);
  });
}

startServer();
