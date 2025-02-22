import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Chat } from './components/Chat/Chat';
import { Display } from './components/Display/Display';
import { Export } from './components/Export/Export';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface DisplayContent {
  type: string;
  data: string | Record<string, unknown>;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [displayContent, setDisplayContent] = useState<DisplayContent | undefined>();

  const handleNewMessage = (message: ChatMessage) => {
    setChatHistory(prev => [...prev, message]);
    
    // Update display content based on message type
    if (message.role === 'assistant') {
      try {
        // Try to parse as JSON first
        const jsonData = JSON.parse(message.content);
        setDisplayContent({
          type: 'json',
          data: jsonData,
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

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              FireCrawl Chat Interface
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Chat Section */}
            <div className="lg:w-1/2">
              <div className="bg-white shadow rounded-lg p-6">
                <Chat onNewMessage={handleNewMessage} />
              </div>
            </div>
            
            {/* Display Section */}
            <div className="lg:w-1/2">
              <div className="bg-white shadow rounded-lg p-6">
                <Display content={displayContent} />
              </div>
              <div className="mt-6 bg-white shadow rounded-lg p-6">
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
