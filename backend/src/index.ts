import express from 'express';
import cors from 'cors';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import { setupFirecrawlRoutes } from './routes/firecrawl';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Redis client setup
export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/firecrawl', setupFirecrawlRoutes());

// Error handling
app.use(errorHandler);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
