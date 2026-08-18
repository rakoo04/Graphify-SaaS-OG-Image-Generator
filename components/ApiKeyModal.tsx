
import React from 'react';

interface ApiKeyModalProps {
  onSelectKey: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSelectKey }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-white/80 backdrop-blur-md">
      <div className="max-w-md w-full glass bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Your API Key</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          To generate high-quality 4K images with Nano Banana Pro, you must select an API key from a paid GCP project. 
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-blue-600 font-medium ml-1 hover:underline">
            Read about billing here
          </a>.
        </p>
        <button
          onClick={onSelectKey}
          className="w-full py-4 px-6 bg-black text-white rounded-2xl font-semibold hover:bg-slate-800 transform hover:scale-[1.02] active:scale-100 transition-all shadow-lg"
        >
          Select Project API Key
        </button>
      </div>
    </div>
  );
};
