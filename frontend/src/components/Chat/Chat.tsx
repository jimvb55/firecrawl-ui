import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  response: string;
  type: string;
  timestamp: string;
}

interface ChatMutationVariables {
  message: string;
  history: ChatMessage[];
}

interface ChatProps {
  onNewMessage: (message: ChatMessage) => void;
}

export function Chat({ onNewMessage }: ChatProps) {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);

  const chatMutation = useMutation<ChatResponse, Error, ChatMutationVariables>({
    mutationFn: async (variables) => {
      const response = await fetch('/api/firecrawl/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variables),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response
      };
      setHistory(prev => [...prev, assistantMessage]);
      onNewMessage(assistantMessage);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: ChatMessage = { role: 'user', content: message };
    setHistory(prev => [...prev, newMessage]);
    onNewMessage(newMessage);
    setMessage('');

    chatMutation.mutate({
      message: message.trim(),
      history: [...history, newMessage],
    });
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div 
        className="flex-1 overflow-y-auto mb-4"
        aria-live="polite"
        aria-label="Chat history"
      >
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
                className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2" 
                role="status"
                aria-label="Assistant is typing"
              >
                <p>Thinking...</p>
              </div>
            </li>
          )}
        </ul>
      </div>

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
