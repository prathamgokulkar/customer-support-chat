import { Router } from "express";
import { handleMessage, getHistory } from "./services/chat";

const router = Router();

router.post("/chat/message", async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const result = await handleMessage(sessionId, message);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/chat/history/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  try {
    const history = await getHistory(sessionId);
    res.json({ history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
