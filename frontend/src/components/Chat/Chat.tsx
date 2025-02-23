import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

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

interface SearchResult {
  url: string;
  title: string;
  description: string;
}

interface ChatResponse {
  type: string;
  response: string;
  data?: BusinessInfo;
  images?: { src: string; alt: string }[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
  alternativeResults?: SearchResult[];
  timestamp?: string;
  error?: {
    type: string;
    message: string;
    details?: any;
  };
}

interface ChatMutationVariables {
  message: string;
  history: ChatMessage[];
  page?: number;
}

interface ChatProps {
  onNewMessage: (message: ChatMessage) => void;
  onBusinessData?: (data: BusinessInfo, images: { src: string; alt: string }[]) => void;
}

export function Chat({ onNewMessage, onBusinessData }: ChatProps) {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const chatMutation = useMutation<ChatResponse, Error, ChatMutationVariables>({
    mutationFn: async ({ message, history, page = 1 }) => {
      const response = await fetch(`/api/firecrawl/chat?page=${page}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, history }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to send message');
      }
      
      return data;
    },
    onSuccess: (data) => {
      // Clear any previous errors
      setError(null);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response
      };
      setHistory(prev => [...prev, assistantMessage]);
      onNewMessage(assistantMessage);

      // Handle business data if available
      if (data.type === 'business_info' && data.data && onBusinessData) {
        onBusinessData(data.data, data.images || []);
      }
    },
    onError: (error) => {
      setError(error.message);
      console.error('Chat error:', error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: ChatMessage = { role: 'user', content: message };
    setHistory(prev => [...prev, newMessage]);
    onNewMessage(newMessage);
    setMessage('');
    setCurrentPage(1); // Reset pagination on new message

    chatMutation.mutate({
      message: message.trim(),
      history: [...history, newMessage],
      page: 1,
    });
  };

  const handleLoadMore = () => {
    if (!chatMutation.data?.pagination?.hasMore) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    
    chatMutation.mutate({
      message: history[history.length - 2].content, // Get last user message
      history: history.slice(0, -1), // Remove last assistant message
      page: nextPage,
    });
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div 
        className="flex-1 overflow-y-auto mb-4 space-y-4"
        aria-live="polite"
        aria-label="Chat history"
      >
        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-red-500 p-4 bg-red-50 rounded-lg" role="alert">
            <ExclamationCircleIcon className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Chat messages */}
        <ul className="space-y-4" role="list">
          {history.map((msg, index) => (
            <li
              key={index}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
                aria-label={`${msg.role} message`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </li>
          ))}
          {chatMutation.isPending && (
            <li className="flex justify-start">
              <div 
                className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2 animate-pulse" 
                role="status"
                aria-label="Assistant is typing"
              >
                <p>Thinking...</p>
              </div>
            </li>
          )}
        </ul>

        {/* Load more button */}
        {chatMutation.data?.pagination?.hasMore && !chatMutation.isPending && (
          <div className="flex justify-center">
            <button
              onClick={handleLoadMore}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
              aria-label="Load more results"
            >
              <ChevronDownIcon className="h-5 w-5" />
              Load more results
            </button>
          </div>
        )}
      </div>

      {/* Message input form */}
      <form 
        onSubmit={handleSubmit} 
        className="flex gap-2" 
        aria-label="Chat message form"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={chatMutation.isPending}
          aria-label="Message input"
        />
        <button
          type="submit"
          disabled={chatMutation.isPending || !message.trim()}
          className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
          aria-label="Send message"
        >
          <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Send</span>
        </button>
      </form>
    </div>
  );
}
