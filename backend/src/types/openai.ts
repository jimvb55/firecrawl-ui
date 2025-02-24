export interface BusinessInfo {
  details: {
    name: string;
    address: string;
    phone: string;
    hours: string;
    website: string;
    socialMedia: string[];
    businessType: string;
    serviceArea: string[];
    yearEstablished?: string;
    employeeCount?: string;
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
    promotions: Array<{
      type: string;
      description: string;
      value: string;
      expiration?: string;
      conditions?: string;
    }>;
    keyMessages: string[];
    uniqueSellingPoints: string[];
  };
  marketAnalysis?: {
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
  adPreferences?: {
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
