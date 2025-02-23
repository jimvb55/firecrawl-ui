import type { BusinessInfo } from './openai.js';
import axios from 'axios';

interface FirecrawlExtractSchema {
  business_info: {
    name: string;
    address: string;
    phone: string;
    hours: string;
    website: string;
    social_media: string[];
    business_type: string;
    service_area: string[];
  };
  branding: {
    colors: string[];
    logo_url?: string;
    images: string[];
    brand_voice: string;
    visual_style: string;
  };
  marketing: {
    target_audience: {
      demographics: string[];
      interests: string[];
      income: string;
      location: string;
    };
    promotions: Array<{
      type: string;
      description: string;
      value: string;
      expiration?: string;
      conditions?: string;
    }>;
    key_messages: string[];
    unique_selling_points: string[];
  };
}

interface SearchResult {
  url: string;
  title: string;
  description: string;
  content?: string;
}

export async function searchBusiness(query: string): Promise<SearchResult[]> {
  try {
    const response = await axios.post('http://localhost:3001/mcp/tool', {
      server_name: 'github.com/mendableai/firecrawl-mcp-server',
      tool_name: 'firecrawl_search',
      arguments: {
        query,
        limit: 5,
        scrapeOptions: {
          formats: ['markdown'],
          onlyMainContent: true
        }
      }
    });

    return response.data;
  } catch (error) {
    console.error('FireCrawl search error:', error);
    throw new Error('Failed to search business information');
  }
}

export async function extractBusinessInfo(url: string): Promise<Partial<BusinessInfo>> {
  try {
    const response = await axios.post('http://localhost:3001/mcp/tool', {
      server_name: 'github.com/mendableai/firecrawl-mcp-server',
      tool_name: 'firecrawl_extract',
      arguments: {
        urls: [url],
        schema: {
          business_info: {
            name: '',
            address: '',
            phone: '',
            hours: '',
            website: '',
            social_media: [],
            business_type: '',
            service_area: []
          },
          branding: {
            colors: [],
            images: [],
            brand_voice: '',
            visual_style: ''
          },
          marketing: {
            target_audience: {
              demographics: [],
              interests: [],
              income: '',
              location: ''
            },
            promotions: [],
            key_messages: [],
            unique_selling_points: []
          }
        },
        systemPrompt: "You are a business information extractor. Extract key business details, branding elements, and promotional content.",
        prompt: "Extract all available business information, focusing on contact details, branding, marketing strategy, target audience, and unique selling points."
      }
    });

    const extractedData = response.data[0] as FirecrawlExtractSchema;
    return {
      details: {
        name: extractedData.business_info.name,
        address: extractedData.business_info.address,
        phone: extractedData.business_info.phone,
        hours: extractedData.business_info.hours,
        website: extractedData.business_info.website,
        socialMedia: extractedData.business_info.social_media,
        businessType: extractedData.business_info.business_type,
        serviceArea: extractedData.business_info.service_area
      },
      branding: {
        colors: extractedData.branding.colors,
        logo: extractedData.branding.logo_url || '',
        images: extractedData.branding.images,
        brandVoice: extractedData.branding.brand_voice,
        visualStyle: extractedData.branding.visual_style
      },
      marketing: {
        targetAudience: extractedData.marketing.target_audience,
        promotions: extractedData.marketing.promotions,
        keyMessages: extractedData.marketing.key_messages,
        uniqueSellingPoints: extractedData.marketing.unique_selling_points
      }
    };
  } catch (error) {
    console.error('FireCrawl extract error:', error);
    throw new Error('Failed to extract business information');
  }
}

interface ScrapedImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export async function scrapeImages(url: string): Promise<ScrapedImage[]> {
  try {
    const response = await axios.post('http://localhost:3001/mcp/tool', {
      server_name: 'github.com/mendableai/firecrawl-mcp-server',
      tool_name: 'firecrawl_scrape',
      arguments: {
        url,
        formats: ['html'],
        onlyMainContent: true,
        includeTags: ['img'],
        actions: [
          {
            type: 'executeJavascript',
            script: `
              const images = Array.from(document.images)
                .map(img => ({
                  src: img.src,
                  alt: img.alt,
                  width: img.width,
                  height: img.height
                }))
                .filter(img => img.width > 100 && img.height > 100);
              return images;
            `
          }
        ]
      }
    });

    return response.data as ScrapedImage[];
  } catch (error) {
    console.error('FireCrawl scrape error:', error);
    throw new Error('Failed to scrape images');
  }
}
