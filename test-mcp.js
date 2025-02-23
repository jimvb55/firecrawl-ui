import { use_mcp_tool } from '@modelcontextprotocol/sdk';

async function testFirecrawl() {
  try {
    const result = await use_mcp_tool({
      server_name: 'github.com/mendableai/firecrawl-mcp-server',
      tool_name: 'firecrawl_search',
      arguments: {
        query: 'Pizza Hut New York',
        limit: 5,
        scrapeOptions: {
          formats: ['markdown'],
          onlyMainContent: true
        }
      }
    });

    console.log('Search Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testFirecrawl();
