import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const HF_ACCESS_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

let hf: HfInference;

if (HF_ACCESS_TOKEN && HF_ACCESS_TOKEN !== "hf_placeholder") {
  hf = new HfInference(HF_ACCESS_TOKEN);
} else {
  console.warn("Hugging Face API Key is missing or placeholder. LLM features will not work.");
}

export async function generateReply(history: { role: string; content: string }[], userMessage: string): Promise<string> {
  if (!hf) {
    return "Error: LLM service is not configured. Please check server logs.";
  }

  const systemPrompt = "You are a helpful support agent for a small e-commerce store called Spur. Answer clearly and concisely. You can help with shipping (we ship globally, free over $50) and returns (30-day policy).";
  
  // Construct prompt
  // For simple models, we might just concatenate. For chat models, use chatCompletion.
  // We'll use a popular open model like 'mistralai/Mistral-7B-Instruct-v0.2' or similar via HF Inference.
  
  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: userMessage }
  ];

  try {
    const response = await hf.chatCompletion({
      model: "openai/gpt-oss-20b",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("LLM Error:", error);
    return "I'm encountering technical difficulties right now. Please try again later.";
  }
}
