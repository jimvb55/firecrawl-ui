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
  };
  branding: {
    colors: string[];
    logo: string;
    images: string[];
  };
  marketing: {
    targetAudience: string;
    promotions: {
      type: string;
      description: string;
      value: string;
      expiration?: string;
    }[];
    keyMessages: string[];
  };
  adPreferences: {
    type: 'valpak' | 'clipper';
    size: string;
    specifications: Record<string, unknown>;
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
        specific_requirements: { type: "string" }
      },
      required: ["business_name"]
    }
  },
  {
    name: "extract_business_info",
    description: "Extract structured business information",
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
            branding_colors: { type: "array", items: { type: "string" } },
            target_audience: { type: "string" }
          },
          required: ["name"]
        },
        promotions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string" },
              description: { type: "string" },
              value: { type: "string" },
              expiration: { type: "string" }
            },
            required: ["type", "description"]
          }
        }
      },
      required: ["business_details"]
    }
  }
];

export async function analyzeUserMessage(message: string, history: ChatCompletionMessageParam[]) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a direct mail advertising assistant. Help analyze business information and create effective ad designs for Valpak and Clipper Magazine style advertisements."
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
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a direct mail advertising assistant. Help analyze scraped business information and suggest effective ad designs."
        },
        ...history,
        {
          role: "user",
          content: "Here is the scraped business information. Please analyze it and suggest ad design elements.",
        },
        {
          role: "assistant",
          content: JSON.stringify(data, null, 2),
        }
      ]
    });

    return {
      type: "message",
      content: response.choices[0].message.content
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to process business information with OpenAI');
  }
}
