# FireCrawl UI Development Guide

This guide provides detailed instructions for setting up and running the FireCrawl UI project in various development environments.

## 📋 Prerequisites

- Node.js v18 or higher
- npm v8 or higher
- Docker and Docker Compose (optional, for containerized development)
- Git with LF line endings configured (see .gitattributes)

## 🔧 Environment Setup

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
PORT=3000
NODE_ENV=development
API_URL=http://localhost:3000

# API Keys
FIRECRAWL_API_KEY=your_firecrawl_api_key
OPENAI_API_KEY=your_openai_api_key

# Rate Limiting
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Installation

```bash
# Install all dependencies (frontend, backend, and root)
npm run install:all
```

## 🚀 Development Workflows

### Local Development (Non-Docker)

1. Start both frontend and backend:
```bash
npm run dev
```

2. Start frontend only:
```bash
npm run dev:frontend
```

3. Start backend only:
```bash
npm run dev:backend
```

### Docker Development

1. Start with hot-reload:
```bash
docker-compose -f docker-compose.dev.yml up
```

2. Rebuild and start:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

3. Start production configuration:
```bash
docker-compose up --build
```

## 🔍 Development Features

### Hot Reload

- Frontend: Vite provides hot module replacement (HMR)
- Backend: tsx watch enables automatic reloading
- Docker: Volume mounts in development enable hot reload

### Health Checks

- Frontend: http://localhost:5173 (dev) or http://localhost:80 (prod)
- Backend: http://localhost:3000/health

### Networking

- Development:
  - Frontend: http://localhost:5173
  - Backend: http://localhost:3000
- Production:
  - Frontend: http://localhost:80
  - Backend: http://localhost:3000

## 🐛 Troubleshooting

### Common Issues

1. **EADDRINUSE Error**
   - Port already in use
   - Solution: Kill the process using the port or change the port in .env

2. **Module not found errors**
   - Run `npm run install:all` to ensure all dependencies are installed
   - Check that you're using Node.js v18 or higher

3. **Docker Volume Mount Issues**
   - Ensure Docker has permission to access project directory
   - Try rebuilding with `docker-compose -f docker-compose.dev.yml up --build`

4. **Line Ending Issues**
   - Git may change line endings on Windows
   - Solution: Use `.gitattributes` and run:
     ```bash
     git config --global core.autocrlf false
     git rm --cached -r .
     git reset --hard
     ```

### Development Tips

1. **VSCode Extensions**
   - ESLint
   - Prettier
   - Docker
   - TypeScript Vue Plugin
   - Tailwind CSS IntelliSense

2. **Debugging**
   - Frontend: Use Chrome DevTools or React Developer Tools
   - Backend: Use VSCode debugger or `console.log`
   - Docker: Use `docker logs` command

3. **Performance**
   - Frontend runs Vite dev server
   - Backend uses tsx for fast TypeScript execution
   - Docker development setup includes volume mounts for fast updates

## 📦 Building for Production

1. Build all components:
```bash
npm run build
```

2. Build specific components:
```bash
npm run build:frontend
npm run build:backend
```

3. Docker production build:
```bash
docker-compose up --build
```

## 🧪 Testing

(Testing infrastructure to be implemented)

## 🤝 Contributing

1. Ensure all code passes linting:
```bash
cd frontend && npm run lint
```

2. Follow the commit convention:
- feat: New features
- fix: Bug fixes
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Adding or modifying tests
- chore: Maintenance tasks

3. Create a pull request with:
- Clear description of changes
- Any related issue numbers
- Screenshots for UI changes
