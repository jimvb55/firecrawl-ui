import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupFirecrawlRoutes } from './routes/firecrawl.js';
import { errorHandler } from './middleware/errorHandler.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import type { AddressInfo } from 'net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['FIRECRAWL_API_KEY', 'OPENAI_API_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Set up routes
app.use('/api/firecrawl', setupFirecrawlRoutes());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// Start Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
