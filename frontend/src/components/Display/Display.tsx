import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { Tab } from '@headlessui/react';

interface DisplayContent {
  type: string;
  data: string | Record<string, unknown>;
}

interface DisplayProps {
  content?: DisplayContent;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function Display({ content }: DisplayProps) {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { name: 'Text', current: selectedTab === 0 },
    { name: 'JSON', current: selectedTab === 1 },
    { name: 'Markdown', current: selectedTab === 2 },
    { name: 'Raw', current: selectedTab === 3 },
  ];

  const renderContent = () => {
    if (!content) {
      return (
        <div className="text-center text-gray-500 py-12" role="status">
          No content to display
        </div>
      );
    }

    const stringContent = typeof content.data === 'string' 
      ? content.data 
      : JSON.stringify(content.data, null, 2);

    switch (selectedTab) {
      case 0: // Text
        return (
          <div 
            className="whitespace-pre-wrap font-mono text-sm"
            role="region"
            aria-label="Text content"
          >
            {stringContent}
          </div>
        );
      
      case 1: // JSON
        return (
          <div role="region" aria-label="JSON content">
            <CodeMirror
              value={JSON.stringify(content.data, null, 2)}
              height="400px"
              extensions={[javascript({ jsx: true })]}
              theme="light"
              editable={false}
              aria-label="JSON viewer"
            />
          </div>
        );
      
      case 2: // Markdown
        return (
          <div 
            className="prose max-w-none"
            role="region"
            aria-label="Markdown content"
          >
            <ReactMarkdown>{stringContent}</ReactMarkdown>
          </div>
        );
      
      case 3: // Raw
        return (
          <pre 
            className="bg-gray-50 p-4 rounded-lg overflow-auto"
            role="region"
            aria-label="Raw content"
          >
            {stringContent}
          </pre>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Tab.Group onChange={setSelectedTab} as="div" role="tablist">
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow text-blue-700'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          <div className="rounded-xl bg-white p-3">
            {renderContent()}
          </div>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
