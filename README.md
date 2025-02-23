# FireCrawl UI

A web interface for FireCrawl web scraping capabilities with an integrated Model Context Protocol (MCP) server.

## Features

- Self-contained FireCrawl MCP server implementation
- Web scraping capabilities including search and content extraction
- Express.js backend with TypeScript
- Graceful shutdown handling
- Environment-based configuration

## Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/firecrawl-ui.git
cd firecrawl-ui
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install
```

3. Create a `.env` file in the backend directory:
```
PORT=3000
FIRECRAWL_API_KEY=your_firecrawl_api_key
```

4. Start the development server:
```bash
# In the backend directory
npm run dev
```

This will start both the Express server and the integrated FireCrawl MCP server.

## Project Structure

```
firecrawl-ui/
├── backend/
│   ├── src/
│   │   ├── mcp/
│   │   │   └── firecrawl.ts    # Integrated MCP server implementation
│   │   ├── services/
│   │   │   └── firecrawl.ts    # FireCrawl service integration
│   │   └── index.ts            # Express server setup
│   └── package.json
├── test-mcp.js                 # MCP testing utility
└── package.json
```

## Environment Variables

The following environment variables are required:

- `FIRECRAWL_API_KEY`: Your FireCrawl API key for web scraping
- `PORT`: Backend server port (default: 3000)

## Integrated MCP Server

The FireCrawl MCP server is integrated directly into the backend application, providing:

### Available Tools

1. `firecrawl_search`: Search and retrieve content from web pages
   - Parameters:
     - query: Search query string
     - limit: Maximum number of results (optional)
     - scrapeOptions: Configuration for content extraction

2. `firecrawl_scrape`: Scrape content from a single webpage
   - Parameters:
     - url: URL to scrape
     - formats: Content formats to extract (optional)
     - onlyMainContent: Filter out non-main content (optional)
     - includeTags: HTML tags to include (optional)

The MCP server starts automatically with the Express server and handles graceful shutdown.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
