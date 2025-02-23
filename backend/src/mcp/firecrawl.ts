import { Server } from '@modelcontextprotocol/sdk/dist/esm/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/dist/esm/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  Request,
} from '@modelcontextprotocol/sdk/dist/esm/types.js';
import axios from 'axios';

const API_KEY = process.env.FIRECRAWL_API_KEY;
if (!API_KEY) {
  throw new Error('FIRECRAWL_API_KEY environment variable is required');
}

export class FirecrawlMcpServer {
  private server: Server;
  private axiosInstance;

  constructor() {
    this.server = new Server(
      {
        name: 'github.com/mendableai/firecrawl-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.axiosInstance = axios.create({
      baseURL: 'https://api.firecrawl.com',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    this.setupToolHandlers();
    
    this.server.onerror = (error: Error) => console.error('[MCP Error]', error);
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'firecrawl_search',
          description: 'Search and retrieve content from web pages',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query string',
              },
              limit: {
                type: 'number',
                description: 'Maximum number of results',
              },
              scrapeOptions: {
                type: 'object',
                properties: {
                  formats: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  onlyMainContent: {
                    type: 'boolean',
                  },
                },
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'firecrawl_scrape',
          description: 'Scrape content from a single webpage',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'URL to scrape',
              },
              formats: {
                type: 'array',
                items: { type: 'string' },
              },
              onlyMainContent: {
                type: 'boolean',
              },
              includeTags: {
                type: 'array',
                items: { type: 'string' },
              },
            },
            required: ['url'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request: Request) => {
      try {
        switch (request.params.name) {
          case 'firecrawl_search': {
            const response = await this.axiosInstance.post('/search', request.params.arguments);
            return {
              content: [{ type: 'text', text: JSON.stringify(response.data) }],
            };
          }
          case 'firecrawl_scrape': {
            const response = await this.axiosInstance.post('/scrape', request.params.arguments);
            return {
              content: [{ type: 'text', text: JSON.stringify(response.data) }],
            };
          }
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return {
            content: [
              {
                type: 'text',
                text: `FireCrawl API error: ${error.response?.data?.message || error.message}`,
              },
            ],
            isError: true,
          };
        }
        throw error;
      }
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('FireCrawl MCP server running');
  }

  async stop() {
    await this.server.close();
  }
}
