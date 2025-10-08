import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { z } from "zod";
import { insertMessageSchema, insertConversationSchema, insertLeadSchema, type Message, conversations } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are Max, a friendly AI assistant for AR Automation. Your job is to qualify leads by gathering information about their automation needs.

Your conversation flow:
1. Start by asking: "Hi, I'm Max. What task would you love to have done automatically, quickly, and with no effort on your part?"
2. Once they describe their problem, ask which industry they're in: Accounting, E-commerce, or Education
3. Ask about their desired solution and expected outcomes
4. Ask about business impact (time saved, cost reduction, etc.)
5. Finally, collect their contact information (name, email, phone, company name)

Keep responses friendly, concise, and conversational. Focus on understanding their pain points and business needs.

When you've collected all information, respond with "LEAD_QUALIFIED" followed by a summary.`;

function extractLeadDataFromConversation(messages: Message[]) {
  const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
  
  const emailMatch = conversationText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  const phoneMatch = conversationText.match(/\b(\+?1?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/);
  
  const verticalMatch = conversationText.match(/\b(accounting|e-?commerce|education)\b/i);
  
  const userMessages = messages.filter(m => m.role === 'user');
  const problemDescription = userMessages[0]?.content || null;
  
  return {
    contactEmail: emailMatch ? emailMatch[0] : null,
    contactPhone: phoneMatch ? phoneMatch[0] : null,
    vertical: verticalMatch ? verticalMatch[0].toLowerCase() : null,
    problemDescription,
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/conversations", async (req, res) => {
    try {
      const data = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(data);
      res.json(conversation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/conversations/:sessionId", async (req, res) => {
    try {
      const conversation = await storage.getConversationBySessionId(req.params.sessionId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      
      const msgs = await storage.getMessagesByConversationId(conversation.id);
      res.json({ conversation, messages: msgs.reverse() });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { sessionId, message } = z.object({
        sessionId: z.string(),
        message: z.string(),
      }).parse(req.body);

      let conversation = await storage.getConversationBySessionId(sessionId);
      if (!conversation) {
        conversation = await storage.createConversation({
          sessionId,
          status: 'active',
        });
      }

      const userMessage = await storage.createMessage({
        conversationId: conversation.id,
        role: 'user',
        content: message,
      });

      const previousMessages = await storage.getMessagesByConversationId(conversation.id);
      
      const messagesForOpenAI = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        ...previousMessages.reverse().map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messagesForOpenAI,
        temperature: 0.7,
        max_tokens: 500,
      });

      const assistantContent = completion.choices[0].message.content || "I apologize, but I'm having trouble responding. Could you please rephrase that?";

      const assistantMessage = await storage.createMessage({
        conversationId: conversation.id,
        role: 'assistant',
        content: assistantContent,
      });

      if (assistantContent.includes('LEAD_QUALIFIED')) {
        let lead = await storage.getLeadByConversationId(conversation.id);
        
        if (!lead) {
          lead = await storage.createLead({
            conversationId: conversation.id,
            vertical: conversation.vertical || null,
            status: 'qualified',
          });
        }

        const allMessages = await storage.getMessagesByConversationId(conversation.id);
        const extractedData = extractLeadDataFromConversation(allMessages.reverse());
        
        await storage.updateLead(lead.id, extractedData);
        
        await db.update(conversations).set({ status: 'qualified' }).where(eq(conversations.id, conversation.id));
      }

      res.json({
        message: assistantMessage,
        conversation,
      });
    } catch (error: any) {
      console.error('Chat error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const data = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(data);
      res.json(lead);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
