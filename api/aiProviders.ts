import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export type AiProvider = "gemini" | "cerebras" | "deepseek" | "heuristic";

export interface AiExecutionResult<T> {
  data: T;
  provider: AiProvider;
  model: string;
  failoverHistory: string[];
}

export interface ProviderStatus {
  gemini: { configured: boolean; models: string[] };
  cerebras: { configured: boolean; models: string[] };
  deepseek: { configured: boolean; models: string[] };
  autoFailoverEnabled: boolean;
  order: AiProvider[];
}

// Keys configuration loaded safely from environment variables (never hardcode in tracked git files)
const GEMINI_KEYS = Array.from(
  new Set([process.env.GEMINI_API_KEY].filter(Boolean) as string[])
);

const CEREBRAS_KEYS = Array.from(
  new Set([process.env.CEREBRAS_API_KEY].filter(Boolean) as string[])
);

const DEEPSEEK_KEYS = Array.from(
  new Set([process.env.DEEPSEEK_API_KEY].filter(Boolean) as string[])
);

export function getProviderStatus(): ProviderStatus {
  return {
    gemini: {
      configured: GEMINI_KEYS.length > 0,
      models: ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"],
    },
    cerebras: {
      configured: CEREBRAS_KEYS.length > 0,
      models: ["gpt-oss-120b", "qwen-3.8-27b", "gemma-4-31b"],
    },
    deepseek: {
      configured: DEEPSEEK_KEYS.length > 0,
      models: ["deepseek-chat"],
    },
    autoFailoverEnabled: true,
    order: ["gemini", "cerebras", "deepseek", "heuristic"],
  };
}

/**
 * Robust JSON extraction from LLM response strings
 */
export function cleanAndParseJson<T = any>(rawText: string): T {
  let text = rawText.trim();
  // Strip Markdown code fence if present
  if (text.startsWith("```")) {
    text = text.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "").trim();
  }

  try {
    return JSON.parse(text);
  } catch {
    // Attempt extracting outermost JSON object or array
    const startObj = text.indexOf("{");
    const endObj = text.lastIndexOf("}");
    if (startObj !== -1 && endObj !== -1 && endObj > startObj) {
      const candidate = text.slice(startObj, endObj + 1);
      return JSON.parse(candidate);
    }

    const startArr = text.indexOf("[");
    const endArr = text.lastIndexOf("]");
    if (startArr !== -1 && endArr !== -1 && endArr > startArr) {
      const candidate = text.slice(startArr, endArr + 1);
      return JSON.parse(candidate);
    }

    throw new Error(`Failed to parse JSON from AI model response: ${text.slice(0, 120)}...`);
  }
}

/**
 * Multi-provider execution with automatic quota/limit failover
 * Priority Order: Gemini -> Cerebras -> DeepSeek -> Heuristics
 */
export async function executeAutoFailover<T>(options: {
  prompt: string;
  systemInstruction?: string;
  schema?: any;
  fallbackData: T;
  taskName?: string;
}): Promise<AiExecutionResult<T>> {
  const { prompt, systemInstruction, schema, fallbackData, taskName = "generation" } = options;
  const failoverHistory: string[] = [];

  // ==========================================
  // 1. PRIMARY: Google Gemini Models & Keys
  // ==========================================
  const geminiModels = [
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash",
    "gemini-flash-latest",
  ];

  for (const apiKey of GEMINI_KEYS) {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { "User-Agent": "aistudio-build-failover" },
      },
    });

    for (const modelName of geminiModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction:
              systemInstruction ||
              "You are an expert strategic copywriter and healthcare branding consultant. Always reply strictly with valid JSON.",
            responseMimeType: "application/json",
            responseSchema: schema,
          },
        });

        const text = response.text;
        if (text) {
          const parsed = cleanAndParseJson<T>(text);
          return {
            data: parsed,
            provider: "gemini",
            model: modelName,
            failoverHistory,
          };
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        failoverHistory.push(`Gemini (${modelName}) failed: ${errMsg.slice(0, 80)}`);
        console.warn(`[AI Failover] Gemini [${modelName}] error:`, errMsg);
        // Continue to next model/provider
      }
    }
  }

  // ==========================================
  // 2. SECONDARY: Cerebras Ultra-Fast Inference
  // ==========================================
  const cerebrasModels = ["gpt-oss-120b", "qwen-3.8-27b", "gemma-4-31b"];
  for (const apiKey of CEREBRAS_KEYS) {
    for (const modelName of cerebrasModels) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              {
                role: "system",
                content: `${systemInstruction || "You are an expert healthcare marketing strategist."} You MUST return strictly valid JSON. Do not include introductory text or extra formatting.`,
              },
              {
                role: "user",
                content: `${prompt}\n\nIMPORTANT: Respond ONLY with a valid JSON object.`,
              },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const jsonResponse: any = await res.json();
          const content = jsonResponse?.choices?.[0]?.message?.content;
          if (content) {
            const parsed = cleanAndParseJson<T>(content);
            return {
              data: parsed,
              provider: "cerebras",
              model: modelName,
              failoverHistory,
            };
          }
        } else {
          const errBody = await res.text();
          failoverHistory.push(`Cerebras (${modelName}) HTTP ${res.status}: ${errBody.slice(0, 80)}`);
          console.warn(`[AI Failover] Cerebras [${modelName}] HTTP ${res.status}:`, errBody);
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        failoverHistory.push(`Cerebras (${modelName}) error: ${errMsg.slice(0, 80)}`);
        console.warn(`[AI Failover] Cerebras [${modelName}] exception:`, errMsg);
      }
    }
  }

  // ==========================================
  // 3. TERTIARY: DeepSeek API (deepseek-chat)
  // ==========================================
  for (const apiKey of DEEPSEEK_KEYS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: `${systemInstruction || "You are an expert marketing strategist."} You MUST return strictly valid JSON conforming to the request.`,
            },
            {
              role: "user",
              content: `${prompt}\n\nIMPORTANT: Return ONLY a valid JSON object matching the requested schema.`,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const jsonResponse: any = await res.json();
        const content = jsonResponse?.choices?.[0]?.message?.content;
        if (content) {
          const parsed = cleanAndParseJson<T>(content);
          return {
            data: parsed,
            provider: "deepseek",
            model: "deepseek-chat",
            failoverHistory,
          };
        }
      } else {
        const errBody = await res.text();
        failoverHistory.push(`DeepSeek HTTP ${res.status}: ${errBody.slice(0, 80)}`);
        console.warn(`[AI Failover] DeepSeek HTTP ${res.status}:`, errBody);
      }
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      failoverHistory.push(`DeepSeek exception: ${errMsg.slice(0, 80)}`);
      console.warn(`[AI Failover] DeepSeek exception:`, errMsg);
    }
  }

  // ==========================================
  // 4. QUATERNARY: Domain Heuristic Fallback
  // ==========================================
  console.info(`[AI Failover] All external providers reached quota/demand limits. Executing domain heuristic engine.`);
  failoverHistory.push("All external AI providers reached limit/quota. Activated Domain Heuristic Engine.");

  return {
    data: fallbackData,
    provider: "heuristic",
    model: "domain-heuristic-engine",
    failoverHistory,
  };
}

/**
 * Multimodal Screenshot Font Analyzer with failover
 */
export async function identifyFontWithAutoFailover(options: {
  imageBase64: string;
  mimeType: string;
  prompt: string;
  schema: any;
  fallbackData: any;
}): Promise<AiExecutionResult<any>> {
  const { imageBase64, mimeType, prompt, schema, fallbackData } = options;
  const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");
  const failoverHistory: string[] = [];

  const candidateModels = [
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash",
    "gemini-flash-latest",
  ];

  // Try each Gemini key and vision model
  for (const apiKey of GEMINI_KEYS) {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { "User-Agent": "aistudio-build-vision" } },
    });

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: mimeType || "image/png",
                    data: cleanBase64,
                  },
                },
              ],
            },
          ],
          config: {
            systemInstruction:
              "You are a master typographer, font identification expert, and visual design engineer. Analyze the typography in the screenshot and identify font family, weights, and Google Font pairings.",
            responseMimeType: "application/json",
            responseSchema: schema,
          },
        });

        const text = response.text;
        if (text) {
          const parsed = cleanAndParseJson(text);
          return {
            data: parsed,
            provider: "gemini",
            model: modelName,
            failoverHistory,
          };
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        failoverHistory.push(`Gemini Vision (${modelName}): ${errMsg.slice(0, 80)}`);
        console.warn(`[Font AI Failover] Gemini Vision [${modelName}] error:`, errMsg);
      }
    }
  }

  // If multimodal Gemini is under high demand, activate typography heuristic engine
  failoverHistory.push("Gemini Vision currently at high demand; engaged typography heuristic fallback.");
  return {
    data: fallbackData,
    provider: "heuristic",
    model: "typography-visual-heuristics",
    failoverHistory,
  };
}
