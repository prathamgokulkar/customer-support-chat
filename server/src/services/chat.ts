import { PrismaClient } from "@prisma/client";
import { generateReply } from "./llm";

const prisma = new PrismaClient();

export async function handleMessage(sessionId: string | undefined, content: string) {
  let session;

  if (sessionId) {
    session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { messages: { take: 10, orderBy: { createdAt: 'desc' } } }
    });
  }

  // Create new session if doesn't exist
  if (!session) {
    session = await prisma.session.create({
      data: {}
    });
  }

  // Save User Message
  await prisma.message.create({
    data: {
      content,
      sender: "user",
      sessionId: session.id
    }
  });

  // Fetch history for context
  const history = await prisma.message.findMany({
    where: { sessionId: session.id },
    orderBy: { createdAt: 'asc' },
    take: 10 
  });

  const formattedHistory = history.map((msg: { sender: string; content: string }) => ({
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.content
  }));

  // Generate Reply
  const replyContent = await generateReply(formattedHistory, content);

  // Save AI Message
  await prisma.message.create({
    data: {
      content: replyContent,
      sender: "ai",
      sessionId: session.id
    }
  });

  return {
    sessionId: session.id,
    reply: replyContent
  };
}

export async function getHistory(sessionId: string) {
  return prisma.message.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' }
  });
}
