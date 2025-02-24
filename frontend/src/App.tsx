import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Chat } from './components/Chat/Chat';
import { Display } from './components/Display/Display';
import { Export } from './components/Export/Export';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  website: string;
  hours: string;
}

interface DisplayContent {
  type: string;
  data: string | BusinessInfo | Record<string, unknown>;
  images?: { src: string; alt: string }[];
  alternativeResults?: Array<{
    url: string;
    title: string;
    description: string;
  }>;
  sections?: {
    targetAudience: string;
    competitiveAdvantage: string;
    offers: string;
    design: string;
    timing: string;
  };
  content?: string;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [displayContent, setDisplayContent] = useState<DisplayContent | undefined>();
  const [lastUserMessage, setLastUserMessage] = useState<string>('');

  const handleNewMessage = (message: ChatMessage) => {
    console.log('handleNewMessage called:', message);
    setChatHistory(prev => [...prev, message]);
    
    if (message.role === 'user') {
      setLastUserMessage(message.content);
      console.log('Updated lastUserMessage:', message.content);
    } else {
      try {
        // Try to parse response data
        const response = JSON.parse(message.content);
        setDisplayContent({
          type: response.type || 'text',
          data: response.data || response,
          images: response.images,
          alternativeResults: response.alternativeResults,
          sections: response.sections,
          content: response.content
        });
      } catch {
        // If not JSON, treat as text/markdown
        setDisplayContent({
          type: 'text',
          data: message.content,
        });
      }
    }
  };

  const handleBusinessData = (data: BusinessInfo, images: { src: string; alt: string }[], analysis?: any) => {
    setDisplayContent(prev => ({
      ...prev,
      type: 'business_info',
      data,
      images,
      sections: analysis?.sections,
      content: analysis?.content
    }));
  };

  const handleAlternativeSelect = (url: string) => {
    // Re-run the last user query with the selected alternative URL
    const message: ChatMessage = {
      role: 'user',
      content: `Analyze this business instead: ${url}\n\nOriginal query: ${lastUserMessage}`,
    };
    setChatHistory(prev => [...prev, message]);
    handleNewMessage(message);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              FireCrawl Chat Interface
            </h1>
            <p className="mt-2 text-gray-600">
              Research businesses and gather design assets for direct mail campaigns
            </p>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Chat Section */}
            <div className="lg:w-1/2">
              <div className="bg-white shadow rounded-lg p-6">
                <Chat 
                  onNewMessage={handleNewMessage}
                  onBusinessData={handleBusinessData}
                />
              </div>
            </div>
            
            {/* Display Section */}
            <div className="lg:w-1/2 space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <Display 
                  content={displayContent}
                  onSelectAlternative={handleAlternativeSelect}
                />
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <Export history={chatHistory} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
