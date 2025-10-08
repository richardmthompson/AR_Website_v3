import { 
  type User, 
  type InsertUser, 
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type Lead,
  type InsertLead,
  conversations,
  messages,
  leads,
  users
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | undefined>;
  getConversationBySessionId(sessionId: string): Promise<Conversation | undefined>;
  updateConversationVertical(id: string, vertical: string): Promise<void>;
  
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByConversationId(conversationId: string): Promise<Message[]>;
  
  createLead(lead: InsertLead): Promise<Lead>;
  getLeadByConversationId(conversationId: string): Promise<Lead | undefined>;
  updateLead(id: string, data: Partial<InsertLead>): Promise<void>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const result = await db.insert(conversations).values(conversation).returning();
    return result[0];
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const result = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
    return result[0];
  }

  async getConversationBySessionId(sessionId: string): Promise<Conversation | undefined> {
    const result = await db.select().from(conversations).where(eq(conversations.sessionId, sessionId)).limit(1);
    return result[0];
  }

  async updateConversationVertical(id: string, vertical: string): Promise<void> {
    await db.update(conversations).set({ vertical }).where(eq(conversations.id, id));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async getMessagesByConversationId(conversationId: string): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(desc(messages.createdAt));
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const result = await db.insert(leads).values(lead).returning();
    return result[0];
  }

  async getLeadByConversationId(conversationId: string): Promise<Lead | undefined> {
    const result = await db.select().from(leads).where(eq(leads.conversationId, conversationId)).limit(1);
    return result[0];
  }

  async updateLead(id: string, data: Partial<InsertLead>): Promise<void> {
    await db.update(leads).set(data).where(eq(leads.id, id));
  }
}

export const storage = new DbStorage();
