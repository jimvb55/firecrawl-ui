import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { FirecrawlMcpServer } from './mcp/firecrawl.js';
import { setupFirecrawlRoutes } from './routes/firecrawl.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize and start the FireCrawl MCP server
const mcpServer = new FirecrawlMcpServer();
mcpServer.start().catch(console.error);

// Set up routes
app.use('/api/firecrawl', setupFirecrawlRoutes());

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await mcpServer.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  await mcpServer.stop();
  process.exit(0);
});

// Start Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
