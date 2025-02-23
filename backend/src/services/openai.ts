import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface BusinessInfo {
  details: {
    name: string;
    address: string;
    phone: string;
    hours: string;
    website: string;
    socialMedia: string[];
    yearEstablished?: string;
    employeeCount?: string;
    businessType: string;
    serviceArea: string[];
  };
  branding: {
    colors: string[];
    logo: string;
    images: string[];
    brandVoice: string;
    visualStyle: string;
  };
  marketing: {
    targetAudience: {
      demographics: string[];
      interests: string[];
      income: string;
      location: string;
    };
    promotions: {
      type: string;
      description: string;
      value: string;
      expiration?: string;
      conditions?: string;
    }[];
    keyMessages: string[];
    uniqueSellingPoints: string[];
  };
  marketAnalysis: {
    competitors: Array<{
      name: string;
      website: string;
      strengths: string[];
      weaknesses: string[];
      marketingTactics: string[];
    }>;
    localMarketData: {
      demographics: string;
      householdIncome: string;
      competitionLevel: string;
      marketTrends: string[];
      seasonalFactors: string[];
    };
    customerSentiment: {
      rating: number;
      reviewCount: number;
      commonPraise: string[];
      commonComplaints: string[];
    };
  };
  adPreferences: {
    type: 'valpak' | 'clipper';
    size: string;
    specifications: Record<string, unknown>;
    recommendedElements: {
      headlines: string[];
      callToAction: string[];
      offers: string[];
      visualElements: string[];
    };
  };
}

const functions = [
  {
    name: "analyze_business_query",
    description: "Analyze user input to determine scraping strategy",
    parameters: {
      type: "object",
      properties: {
        business_name: { type: "string" },
        location: { type: "string" },
        ad_type: { type: "string", enum: ["valpak", "clipper"] },
        specific_requirements: { type: "string" },
        competitor_analysis: { type: "boolean" },
        market_research: { type: "boolean" }
      },
      required: ["business_name"]
    }
  },
  {
    name: "extract_business_info",
    description: "Extract structured business information with market analysis",
    parameters: {
      type: "object",
      properties: {
        business_details: {
          type: "object",
          properties: {
            name: { type: "string" },
            address: { type: "string" },
            phone: { type: "string" },
            hours: { type: "string" },
            business_type: { type: "string" },
            service_area: { type: "array", items: { type: "string" } }
          },
          required: ["name", "business_type"]
        },
        branding: {
          type: "object",
          properties: {
            colors: { type: "array", items: { type: "string" } },
            visual_style: { type: "string" },
            brand_voice: { type: "string" }
          }
        },
        target_audience: {
          type: "object",
          properties: {
            demographics: { type: "array", items: { type: "string" } },
            interests: { type: "array", items: { type: "string" } },
            income: { type: "string" },
            location: { type: "string" }
          }
        },
        market_analysis: {
          type: "object",
          properties: {
            competitors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  strengths: { type: "array", items: { type: "string" } },
                  weaknesses: { type: "array", items: { type: "string" } }
                }
              }
            },
            local_market: {
              type: "object",
              properties: {
                demographics: { type: "string" },
                competition_level: { type: "string" },
                trends: { type: "array", items: { type: "string" } }
              }
            }
          }
        },
        promotions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string" },
              description: { type: "string" },
              value: { type: "string" },
              expiration: { type: "string" },
              conditions: { type: "string" }
            },
            required: ["type", "description"]
          }
        }
      },
      required: ["business_details", "target_audience"]
    }
  }
];

export async function analyzeUserMessage(message: string, history: ChatCompletionMessageParam[], options: { includeMarketAnalysis?: boolean } = {}) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a direct mail advertising assistant specializing in local business analysis and marketing strategy. Help analyze businesses comprehensively, including their market position, competitive landscape, and customer demographics to create effective direct mail campaigns.

Key responsibilities:
1. Analyze business information and local market data
2. Identify target audience demographics and preferences
3. Research competitors and their marketing strategies
4. Recommend effective ad designs for Valpak and Clipper Magazine
5. Suggest compelling offers and calls-to-action based on market analysis
6. Consider seasonal factors and local market trends

Focus on extracting actionable insights that will help create targeted and effective direct mail campaigns.`
        },
        ...history,
        { role: "user", content: message }
      ],
      functions,
      function_call: "auto",
    });

    const responseMessage = response.choices[0].message;

    if (responseMessage.function_call) {
      const functionName = responseMessage.function_call.name;
      const args = JSON.parse(responseMessage.function_call.arguments);
      
      return {
        type: "function_call",
        function: functionName,
        arguments: args,
        message: responseMessage.content
      };
    }

    return {
      type: "message",
      content: responseMessage.content
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to process message with OpenAI');
  }
}

export async function processBusinessInfo(data: any, history: ChatCompletionMessageParam[]) {
  try {
    const systemPrompt = `You are a direct mail advertising specialist with expertise in local business marketing. 
Your task is to analyze the provided business information and create detailed recommendations for direct mail campaigns.

Focus on:
1. Target Audience Analysis
   - Demographics and psychographics
   - Geographic targeting
   - Seasonal considerations
   - Income levels and spending habits

2. Competitive Advantage
   - Unique selling propositions
   - Market position
   - Competitor weaknesses to exploit
   - Service area opportunities

3. Offer Development
   - Seasonal promotions
   - Value propositions
   - Call-to-action strategies
   - Urgency creators

4. Design Recommendations
   - Color schemes
   - Visual hierarchy
   - Image placement
   - Typography suggestions
   - Space utilization

5. Campaign Timing
   - Seasonal factors
   - Market trends
   - Event alignment
   - Follow-up strategy

Provide actionable recommendations that will help create effective direct mail pieces for either Valpak or Clipper Magazine formats.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        ...history,
        {
          role: "user",
          content: `Analyze this business information and provide detailed recommendations for a direct mail campaign. 
Consider the target audience, competitive landscape, and local market conditions.

Business Data:
${JSON.stringify(data, null, 2)}`,
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Process the response into structured sections
    const analysisContent = response.choices[0].message.content || '';
    
    return {
      type: "analysis",
      content: analysisContent,
      sections: {
        targetAudience: extractSection(analysisContent, "Target Audience"),
        competitiveAdvantage: extractSection(analysisContent, "Competitive Advantage"),
        offers: extractSection(analysisContent, "Offer Development"),
        design: extractSection(analysisContent, "Design Recommendations"),
        timing: extractSection(analysisContent, "Campaign Timing")
      }
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to process business information with OpenAI');
  }
}

function extractSection(content: string, sectionName: string): string {
  const regex = new RegExp(`${sectionName}[:\\n]([\\s\\S]*?)(?=\\n\\s*[A-Z][A-Za-z\\s]+:|$)`);
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}
