// Centralized chat service (v2-style)
// Uses env var when provided, falls back to Vite proxy for local dev
const WEBHOOK_URL: string = (import.meta as any)?.env?.VITE_WEBHOOK_URL || "/api/chat";

export interface ChatResponse {
  output: string;
  error?: string;
}

export const sendMessageToWebhook = async (message: string): Promise<ChatResponse> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    // Send multiple keys to maximize backend compatibility
    const requestBody: Record<string, unknown> = {
      chatInput: message,
      input: message,
      question: message,
      prompt: message,
      message,
    };

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      const errorPayload = (data && (data.error || data.message)) || `HTTP ${response.status}`;
      return { output: "", error: String(errorPayload) };
    }

    const output = data.output || data.response || data.message || data.text || data.raw || "No response from AI";
    return { output };
  } catch (error) {
    let errorMessage = "Failed to connect to AI service";
    if ((error as any)?.name === "AbortError") {
      errorMessage = "The request timed out. Please try again.";
    } else if (error instanceof TypeError && error.message.includes("fetch")) {
      errorMessage = "Cannot connect to AI service. Please check if the webhook server is running.";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { output: "", error: errorMessage };
  }
};
