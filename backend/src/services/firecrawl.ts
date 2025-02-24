import type { BusinessInfo } from '../types/openai';
import FirecrawlApp from '@mendable/firecrawl-js';
import { z } from 'zod';

const businessInfoSchema = z.object({
  business_info: z.object({
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    hours: z.string(),
    website: z.string(),
    social_media: z.array(z.string()),
    business_type: z.string(),
    service_area: z.array(z.string())
  }),
  branding: z.object({
    colors: z.array(z.string()),
    logo_url: z.string().optional(),
    images: z.array(z.string()),
    brand_voice: z.string(),
    visual_style: z.string()
  }),
  marketing: z.object({
    target_audience: z.object({
      demographics: z.array(z.string()),
      interests: z.array(z.string()),
      income: z.string(),
      location: z.string()
    }),
    promotions: z.array(z.object({
      type: z.string(),
      description: z.string(),
      value: z.string(),
      expiration: z.string().optional(),
      conditions: z.string().optional()
    })),
    key_messages: z.array(z.string()),
    unique_selling_points: z.array(z.string())
  })
});

const imageSchema = z.object({
  images: z.array(z.object({
    src: z.string(),
    alt: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional()
  }))
});

// Type definitions for FireCrawl
import type { ZodType, ZodTypeDef } from 'zod';

interface ExtractParams {
  type: string;
  fields?: unknown;
  selectors?: Record<string, string>;
  options?: {
    format?: string;
    onlyMainContent?: boolean;
  };
}

interface FirecrawlClient {
  search(query: string): Promise<any>;
  extract(urls: string[], params: ExtractParams): Promise<any>;
}

interface FirecrawlDocument {
  url: string;
  title: string;
  description: string;
  content?: string;
  metadata?: Record<string, unknown>;
}

type FirecrawlResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
};
import { withRetry } from '../utils/retry';
import { FirecrawlError, ValidationError } from '../types/errors';

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

interface ScrapedImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

// Initialize FireCrawl client
const API_KEY = process.env.FIRECRAWL_API_KEY;
if (!API_KEY) {
  throw new FirecrawlError('FIRECRAWL_API_KEY environment variable is required');
}

const client = new FirecrawlApp({ apiKey: API_KEY }) as unknown as FirecrawlClient;

export const searchBusiness = createRetryableOperation(async (query: string): Promise<SearchResult[]> => {
  try {
    const response = await client.search(query) as FirecrawlResponse<FirecrawlDocument[]>;
    if (!response.success || response.error) {
      throw new FirecrawlError(response.error || 'Search failed');
    }
    
    return response.data.map(result => ({
      url: result.url || '',
      title: result.title || '',
      description: result.description || '',
      content: result.content || ''
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new FirecrawlError(`Search failed: ${error.message}`);
    }
    throw error;
  }
});

export const extractBusinessInfo = createRetryableOperation(async (url: string): Promise<Partial<BusinessInfo>> => {
  try {
    const extractSchema = {
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
    };

    const response = await client.extract([url], {
      type: 'business',
      fields: businessInfoSchema
    }) as FirecrawlResponse<z.infer<typeof businessInfoSchema>>;
    if (!response.success || response.error) {
      throw new FirecrawlError(response.error || 'Extraction failed');
    }
    
    const extractedData = response.data;

    if (!extractedData) {
      throw new ValidationError('No data extracted from the provided URL');
    }

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
    if (error instanceof Error) {
      throw new FirecrawlError(`Extraction failed: ${error.message}`);
    }
    throw error;
  }
});

export const scrapeImages = createRetryableOperation(async (url: string): Promise<ScrapedImage[]> => {
  try {
    const response = await client.extract([url], {
      type: 'images',
      selectors: {
        images: 'img'
      },
      options: {
        format: 'html',
        onlyMainContent: true
      }
    }) as FirecrawlResponse<{ images: Array<{ src: string; alt?: string; width?: number; height?: number }> }>;
    if (!response.success || response.error) {
      throw new FirecrawlError(response.error || 'Scraping failed');
    }
    
    const images = response.data?.images || [];
    return images.map((img: { src: string; alt?: string; width?: number; height?: number }) => ({
      src: img.src,
      alt: img.alt || '',
      width: img.width || 0,
      height: img.height || 0
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new FirecrawlError(`Image scraping failed: ${error.message}`);
    }
    throw error;
  }
});

function createRetryableOperation<T extends (...args: any[]) => Promise<any>>(
  operation: T
): T {
  return ((...args: Parameters<T>) => 
    withRetry(() => operation(...args), {
      maxAttempts: 3,
      retryableErrors: [
        'ECONNREFUSED',
        'ETIMEDOUT',
        /^429/,
        /^5\d{2}/,
        'FireCrawl Error'
      ]
    })
  ) as T;
}
