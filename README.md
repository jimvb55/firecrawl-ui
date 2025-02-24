# 🔥 FireCrawl UI

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A powerful web interface for FireCrawl web scraping capabilities with integrated AI analysis for direct mail campaign research and design.

[Features](#-features) •
[Setup](#-setup) •
[Documentation](#-documentation) •
[Contributing](#-contributing)

</div>

## ✨ Features

### Core Capabilities
- 🤖 Official FireCrawl Node SDK integration for advanced web scraping
- 🧠 OpenAI-powered business analysis and campaign recommendations
- 🎯 Targeted audience and market research
- 🎨 Design recommendations for direct mail campaigns
- 📊 Competitor analysis and market positioning

### Technical Features
- 🛡️ Comprehensive error handling and validation
- 🚀 Real-time content processing and analysis
- 📱 Responsive and accessible UI components
- 🔄 Automatic rate limiting and request management
- 🔒 Secure environment configuration

## 🚀 Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- FireCrawl API key
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/firecrawl-ui.git
cd firecrawl-ui
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Configure environment variables:

Copy the example environment file and configure your variables:
```bash
cp .env.example .env
```

Edit the `.env` file and add your API keys:
```env
# Required API Keys
FIRECRAWL_API_KEY=your_firecrawl_api_key
OPENAI_API_KEY=your_openai_api_key
```

⚠️ **Important Security Notes:**
- Never commit the `.env` file to version control
- Keep your API keys secure and never expose them in the frontend
- The `.env` file should be placed in the root directory of the project
- Different environment variables may be needed for development and production

### API Key Setup

#### FireCrawl API Key
1. Visit the [FireCrawl Developer Portal](https://firecrawl.dev)
2. Create or log into your account
3. Navigate to API Keys section
4. Generate a new API key
5. Copy the key to your `.env` file

#### OpenAI API Key
1. Visit [OpenAI's Platform](https://platform.openai.com)
2. Sign up or log in to your account
3. Go to API Keys section
4. Create a new secret key
5. Copy the key to your `.env` file

### Starting the Application

1. Start the backend server:
```bash
# In the backend directory
npm run dev
```

2. In a new terminal, start the frontend:
```bash
# In the frontend directory
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### 🐳 Docker Setup

The application can be run using Docker in both development and production environments.

#### Prerequisites
- Docker
- Docker Compose

#### Development Environment

1. Ensure your environment variables are set up:
```bash
# Copy the example environment file if you haven't already
cp .env.example .env

# Edit the .env file with your configuration
nano .env
```

2. Start the development environment with hot-reload:
```bash
docker-compose -f docker-compose.dev.yml up
```

The development environment will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

#### Production Environment

1. Configure environment variables:
```env
FIRECRAWL_API_KEY=your_firecrawl_api_key
OPENAI_API_KEY=your_openai_api_key
API_URL=http://your-production-api-url
```

2. Build and start the production containers:
```bash
docker-compose up --build
```

The production environment will be available at:
- Frontend: http://localhost:80
- Backend API: http://localhost:3000

#### Health Checks

The application includes health check endpoints:
- Frontend: http://localhost:80/health (production) or http://localhost:5173 (development)
- Backend: http://localhost:3000/health

#### Docker Commands

Common Docker commands for managing the application:

```bash
# Start services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and start services
docker-compose up --build

# Remove all containers and volumes
docker-compose down -v
```

For more detailed Docker instructions and troubleshooting, see [DEVELOPMENT.md](DEVELOPMENT.md).

## 📖 Documentation

### Project Structure
```
firecrawl-ui/
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API service integrations
│   │   └── types/           # TypeScript type definitions
│   └── public/              # Static assets
├── backend/
│   ├── src/
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic and SDK integrations
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript types
│   └── tests/             # Backend tests
└── docker/                # Docker configuration
```

### Key Components

#### Business Analysis
The application provides comprehensive business analysis including:
- Target audience identification
- Competitive landscape analysis
- Market positioning
- Brand voice and visual style
- Promotional strategy recommendations

#### Content Display
Multiple view options for scraped content:
- Business Information
- Campaign Analysis
- Image Gallery
- Raw Data
- Alternative Results

#### Error Handling
Robust error handling system with:
- Custom error classes
- Validation middleware
- Rate limiting
- Response sanitization
- Automatic retries for transient failures

#### FireCrawl SDK Integration
The backend utilizes the official FireCrawl Node SDK for:
- Web content extraction
- Business information scraping
- Image collection
- Structured data parsing
- Schema validation with Zod

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

### Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding or modifying tests
- `chore:` Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with 🔨 by vpc-ai

</div>
