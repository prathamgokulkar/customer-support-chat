const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface Message {
  role: "user" | "ai";
  content: string;
}

export async function sendMessage(message: string, sessionId?: string): Promise<{ reply: string; sessionId: string }> {
  const response = await fetch(`${API_URL}/chat/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message to ${API_URL}/chat/message. Status: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getHistory(sessionId: string): Promise<Message[]> {
  const response = await fetch(`${API_URL}/chat/history/${sessionId}`);
    
  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }

  const data = await response.json();
  // Map backend message format to frontend format if necessary
  // Backend returns "sender": "user"|"ai"
  // Frontend interface uses "role" for consistency with LLM types, but let's align them.
  // Actually, backend returns { content, sender, ... }
  
  return data.history.map((msg: any) => ({
    role: msg.sender === "user" ? "user" : "ai",
    content: msg.content
  }));
}
