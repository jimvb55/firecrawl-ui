import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { Tab } from '@headlessui/react';
import { MapPinIcon, PhoneIcon, GlobeAltIcon, ClockIcon } from '@heroicons/react/24/outline';

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

interface DisplayContent {
  type: string;
  data: string | BusinessInfo | Record<string, unknown>;
  images?: { src: string; alt: string }[];
  alternativeResults?: SearchResult[];
  sections?: {
    targetAudience: string;
    competitiveAdvantage: string;
    offers: string;
    design: string;
    timing: string;
  };
  content?: string;
}

interface DisplayProps {
  content?: DisplayContent;
  onSelectAlternative?: (url: string) => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function Display({ content, onSelectAlternative }: DisplayProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const tabs = [
    { name: 'Business Info', current: selectedTab === 0 },
    { name: 'Analysis', current: selectedTab === 1 },
    { name: 'Images', current: selectedTab === 2 },
    { name: 'Raw Data', current: selectedTab === 3 },
    { name: 'Alternatives', current: selectedTab === 4 },
  ];

  const renderBusinessInfo = (info: BusinessInfo) => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">{info.name}</h2>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-5 w-5 text-gray-400" />
          <span>{info.address}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <PhoneIcon className="h-5 w-5 text-gray-400" />
          <a href={`tel:${info.phone}`} className="text-blue-500 hover:text-blue-600">
            {info.phone}
          </a>
        </div>
        
        <div className="flex items-center gap-2">
          <GlobeAltIcon className="h-5 w-5 text-gray-400" />
          <a 
            href={info.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600"
          >
            {info.website}
          </a>
        </div>
        
        <div className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-gray-400" />
          <span>{info.hours}</span>
        </div>
      </div>
    </div>
  );

  const renderImages = (images: { src: string; alt: string }[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => setSelectedImage(image.src)}
          className="relative aspect-square overflow-hidden rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <img
            src={image.src}
            alt={image.alt}
            className="object-cover w-full h-full"
          />
        </button>
      ))}
    </div>
  );

  const renderAlternatives = (results: SearchResult[]) => (
    <div className="space-y-4">
      {results.map((result, index) => (
        <button
          key={index}
          onClick={() => onSelectAlternative?.(result.url)}
          className="block w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <h3 className="font-semibold text-blue-600">{result.title}</h3>
          <p className="text-gray-600 mt-1">{result.description}</p>
        </button>
      ))}
    </div>
  );

  const renderContent = () => {
    if (!content) {
      return (
        <div className="text-center text-gray-500 py-12" role="status">
          No content to display
        </div>
      );
    }

    switch (selectedTab) {
      case 0: // Business Info
        if (content.type === 'business_info' && typeof content.data === 'object') {
          return renderBusinessInfo(content.data as BusinessInfo);
        }
        return (
          <div className="prose max-w-none">
            <ReactMarkdown>{content.data as string}</ReactMarkdown>
          </div>
        );
      
      case 1: // Analysis
        if (content.type === 'analysis' && content.sections) {
          return (
            <div className="space-y-8" role="region" aria-label="Campaign analysis">
              {/* Target Audience Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Target Audience
                </h3>
                <div className="prose max-w-none">
                  <ReactMarkdown>{content.sections.targetAudience}</ReactMarkdown>
                </div>
              </section>

              {/* Competitive Advantage Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Competitive Advantage
                </h3>
                <div className="prose max-w-none">
                  <ReactMarkdown>{content.sections.competitiveAdvantage}</ReactMarkdown>
                </div>
              </section>

              {/* Offers Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  Offer Development
                </h3>
                <div className="prose max-w-none">
                  <ReactMarkdown>{content.sections.offers}</ReactMarkdown>
                </div>
              </section>

              {/* Design Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Design Recommendations
                </h3>
                <div className="prose max-w-none">
                  <ReactMarkdown>{content.sections.design}</ReactMarkdown>
                </div>
              </section>

              {/* Timing Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Campaign Timing
                </h3>
                <div className="prose max-w-none">
                  <ReactMarkdown>{content.sections.timing}</ReactMarkdown>
                </div>
              </section>
            </div>
          );
        }
        return (
          <div className="text-center text-gray-500 py-12">
            No analysis available
          </div>
        );

      case 3: // Raw Data
        return (
          <div role="region" aria-label="Raw data">
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
      
      case 2: // Images
        if (content.images && content.images.length > 0) {
          return renderImages(content.images);
        }
        return (
          <div className="text-center text-gray-500 py-12">
            No images available
          </div>
        );
      
      case 4: // Alternatives
        if (content.alternativeResults && content.alternativeResults.length > 0) {
          return renderAlternatives(content.alternativeResults);
        }
        return (
          <div className="text-center text-gray-500 py-12">
            No alternative results available
          </div>
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

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <img
              src={selectedImage}
              alt="Full size view"
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
              aria-label="Close image"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
