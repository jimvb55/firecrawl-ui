# FireCrawl Chat Interface

A modern web interface for FireCrawl, featuring real-time chat, multiple display formats, and export capabilities.

## Features

- 💬 Real-time chat interface with FireCrawl
- 📊 Multiple display formats (Text, JSON, Markdown, Raw)
- 💾 Export functionality (JSON, Markdown, Text)
- 🚀 Redis caching for improved performance
- 🎨 Modern, responsive design with Tailwind CSS
- ♿ Accessibility features
- 🐳 Docker containerization

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - React Query
  - CodeMirror
  - HeadlessUI

- Backend:
  - Node.js
  - Express
  - TypeScript
  - Redis
  - FireCrawl MCP

- Infrastructure:
  - Docker
  - Docker Compose
  - Nginx

## Getting Started

### Prerequisites

- Docker and Docker Compose
- FireCrawl API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jimvb55/firecrawl-ui.git
   cd firecrawl-ui
   ```

2. Create a `.env` file in the root directory:
   ```env
   FIRECRAWL_API_KEY=your_api_key_here
   REDIS_URL=redis://redis:6379
   VITE_API_URL=http://localhost:3000
   ```

3. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: http://localhost:80
   - Backend API: http://localhost:3000

### Development

For local development:

1. Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. Backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. Redis:
   ```bash
   docker run -p 6379:6379 redis:alpine
   ```

## License

MIT License - see LICENSE file for details
