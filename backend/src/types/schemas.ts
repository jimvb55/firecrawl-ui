import { z } from 'zod';

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1)
});

export const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  history: z.array(chatMessageSchema)
});

export const businessSearchSchema = z.object({
  query: z.string().min(1).max(200),
  location: z.string().optional(),
  limit: z.number().int().min(1).max(10).optional().default(5)
});

export const businessInfoSchema = z.object({
  url: z.string().url(),
  formats: z.array(z.enum(['markdown', 'html', 'text'])).optional(),
  onlyMainContent: z.boolean().optional().default(true)
});

export const exportRequestSchema = z.object({
  history: z.array(chatMessageSchema),
  format: z.enum(['json', 'markdown', 'text'])
});

// Types derived from schemas
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type BusinessSearch = z.infer<typeof businessSearchSchema>;
export type BusinessInfo = z.infer<typeof businessInfoSchema>;
export type ExportRequest = z.infer<typeof exportRequestSchema>;
