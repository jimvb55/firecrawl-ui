# Firecrawl UI

A web interface for the Firecrawl service, built with React and Node.js.

## Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- Git

## Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/firecrawl-ui.git
cd firecrawl-ui
```

2. Copy the example environment file:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
```env
# Required API Keys
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# API Configuration (defaults should work for local development)
PORT=3000
NODE_ENV=development
API_URL=http://localhost:3000

# Rate Limiting (adjust as needed)
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=100

# Cache Configuration (optional)
CACHE_TTL=3600
CACHE_MAX_SIZE=100
```

## Development

Start the development environment using Docker Compose:

```bash
docker compose -f docker-compose.dev.yml up --build
```

This will start:
- Frontend at http://localhost:5173
- Backend API at http://localhost:3000

## Project Structure

```
firecrawl-ui/
├── backend/             # Node.js backend
│   ├── src/
│   │   ├── index.ts    # Entry point
│   │   ├── routes/     # API routes
│   │   ├── services/   # Business logic
│   │   └── types/      # TypeScript types
│   └── package.json
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── types/      # TypeScript types
│   │   └── App.tsx    # Root component
│   └── package.json
├── docker/            # Docker configuration
├── .env.example       # Example environment variables
└── docker-compose.yml # Docker Compose configuration
```

## Security Notes

- Never commit `.env` files to version control
- Keep API keys secure and rotate them regularly
- Use environment variables for all sensitive configuration
- The backend handles all API key management - no sensitive data is exposed to the frontend

## Production Deployment

For production deployment:

1. Set secure environment variables:
   - Use a production-grade secrets management system
   - Set `NODE_ENV=production`
   - Configure appropriate rate limits

2. Build and deploy using Docker:
```bash
docker compose up --build
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

Please ensure you:
- Don't commit any sensitive data or API keys
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
