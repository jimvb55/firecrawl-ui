import { useMutation } from '@tanstack/react-query';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ExportProps {
  history?: ChatMessage[];
}

export function Export({ history = [] }: ExportProps) {
  const exportMutation = useMutation<{ data: string }, Error, { format: string }>({
    mutationFn: async ({ format }) => {
      const response = await fetch('/api/firecrawl/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history,
          format,
        }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      return response.json();
    },
  });

  const handleExport = async (format: 'json' | 'markdown' | 'text') => {
    try {
      const result = await exportMutation.mutateAsync({ format });
      
      // Create and download file
      const blob = new Blob([result.data], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-history.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Export Chat History</h2>
      <div className="flex gap-2">
        <button
          onClick={() => handleExport('json')}
          disabled={exportMutation.isPending || history.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          aria-label="Export as JSON"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          JSON
        </button>
        <button
          onClick={() => handleExport('markdown')}
          disabled={exportMutation.isPending || history.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          aria-label="Export as Markdown"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          Markdown
        </button>
        <button
          onClick={() => handleExport('text')}
          disabled={exportMutation.isPending || history.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          aria-label="Export as Text"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          Text
        </button>
      </div>
    </div>
  );
}
