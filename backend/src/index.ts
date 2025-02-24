import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupFirecrawlRoutes } from './routes/firecrawl.js';
import { errorHandler } from './middleware/errorHandler.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables with explicit path
dotenv.config({ path: resolve(__dirname, '../../.env') });

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Set up routes
app.use('/api/firecrawl', setupFirecrawlRoutes());

// Error handling middleware
app.use(errorHandler);

// Start Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
