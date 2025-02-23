import axios from 'axios';
import dotenv from 'dotenv';
import type { BusinessInfo } from './openai.js';

// Load environment variables
dotenv.config();

if (!process.env.FIRECRAWL_API_KEY) {
  throw new Error('FIRECRAWL_API_KEY environment variable is required');
}

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const api = axios.create({
  baseURL: 'https://api.firecrawl.com',
  headers: {
    'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
    'Content-Type': 'application/json',
  }
});

interface FirecrawlExtractSchema {
  business_info: {
    name: string;
    address: string;
    phone: string;
    hours: string;
    website: string;
    social_media: string[];
  };
  branding: {
    colors: string[];
    logo_url?: string;
    images: string[];
  };
  marketing: {
    target_audience?: string;
    promotions: Array<{
      type: string;
      description: string;
      value: string;
      expiration?: string;
    }>;
    key_messages: string[];
  };
}

export async function searchBusiness(query: string) {
  try {
    const response = await api.post('/search', {
      query,
      limit: 5,
      scrapeOptions: {
        formats: ['markdown'],
        onlyMainContent: true
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
    const schema: FirecrawlExtractSchema = {
      business_info: {
        name: '',
        address: '',
        phone: '',
        hours: '',
        website: '',
        social_media: []
      },
      branding: {
        colors: [],
        images: []
      },
      marketing: {
        promotions: [],
        key_messages: []
      }
    };

    const response = await api.post('/extract', {
      urls: [url],
      schema,
      systemPrompt: "You are a business information extractor. Extract key business details, branding elements, and promotional content.",
      prompt: "Extract all available business information, focusing on contact details, branding, and current promotions or deals."
    });

    // Transform FireCrawl response to BusinessInfo format
    const extractedData = response.data[0];
    return {
      details: {
        name: extractedData.business_info.name,
        address: extractedData.business_info.address,
        phone: extractedData.business_info.phone,
        hours: extractedData.business_info.hours,
        website: extractedData.business_info.website,
        socialMedia: extractedData.business_info.social_media
      },
      branding: {
        colors: extractedData.branding.colors,
        logo: extractedData.branding.logo_url || '',
        images: extractedData.branding.images
      },
      marketing: {
        targetAudience: extractedData.marketing.target_audience || '',
        promotions: extractedData.marketing.promotions,
        keyMessages: extractedData.marketing.key_messages
      }
    };
  } catch (error) {
    console.error('FireCrawl extract error:', error);
    throw new Error('Failed to extract business information');
  }
}

export async function scrapeImages(url: string) {
  try {
    const response = await api.post('/scrape', {
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
    });

    return response.data;
  } catch (error) {
    console.error('FireCrawl scrape error:', error);
    throw new Error('Failed to scrape images');
  }
}
