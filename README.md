# FireCrawl UI

A modern web application for efficient file crawling and analysis with an intuitive chat interface.

## 🚀 Features

- Interactive chat interface for file analysis
- Real-time file crawling capabilities
- Docker support for both development and production
- Scalable architecture with separate frontend and backend services

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, TypeScript, Express
- **Infrastructure**: Docker, Docker Compose
- **Development**: Hot-reload, VSCode debugging support

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Git

## 🏗️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jimvb55/firecrawl-ui.git
   cd firecrawl-ui
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

## 🚀 Development

### Local Development

Start the development servers:

```bash
# Start both frontend and backend
npm run dev

# Or start services individually
npm run dev:frontend
npm run dev:backend
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:3001`.

### Docker Development

Run the application using Docker Compose:

```bash
# Development environment with hot-reload
docker-compose -f docker-compose.dev.yml up

# Production environment
docker-compose up
```

## 🔧 Configuration

The application uses environment variables for configuration. Copy `.env.example` to `.env` and adjust the values:

- `VITE_API_URL`: Backend API URL
- Additional environment variables are documented in `.env.example`

## 🏗️ Project Structure

```
firecrawl-ui/
├── frontend/           # React frontend application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── vite.config.ts # Vite configuration
├── backend/           # Node.js backend service
│   ├── src/          # Source code
│   └── tsconfig.json # TypeScript configuration
└── docker/           # Docker configuration files
```

## 🔄 Development Workflow

1. Create feature branch
2. Make changes
3. Run tests (when implemented)
4. Submit pull request

## 🚀 Deployment

### Production Deployment

1. Build the images:
   ```bash
   docker-compose build
   ```

2. Start the services:
   ```bash
   docker-compose up -d
   ```

### Health Checks

The application includes health check endpoints for monitoring:
- Frontend: `/health`
- Backend: `/api/health`

## 🛠️ Future Improvements

### Security
- [ ] Implement API key rotation mechanism
- [ ] Add rate limiting per API key
- [ ] Add request logging and monitoring
- [ ] Implement proper error handling for API key issues

### Development
- [ ] Add automated tests
- [ ] Set up CI/CD pipeline
- [ ] Add code linting and formatting
- [ ] Implement proper error boundaries in React components

### Docker
- [ ] Optimize Docker builds
- [ ] Add container security scanning

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 Notes

### Windows Development
- Ensure line endings are consistently LF (configured in .gitattributes)
- Docker volume mounts may need adjustment
- Use cross-platform scripts in package.json

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
