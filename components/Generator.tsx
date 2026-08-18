
import React, { useState, useRef, useCallback } from 'react';
import { BrandSettings, GeneratedImage, GenerationStatus } from '../types';
import { generateOgImage } from '../services/geminiService';

const Generator: React.FC = () => {
  const [settings, setSettings] = useState<BrandSettings>({
    name: '',
    headline: '',
    primaryColor: '#000000',
  });
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [result, setResult] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setSettings(prev => ({
          ...prev,
          logoBase64: base64String,
          logoMimeType: file.type
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!settings.name || !settings.headline) {
      alert("Please enter a brand name and headline.");
      return;
    }

    setStatus(GenerationStatus.LOADING);
    try {
      const imageUrl = await generateOgImage(settings);
      const newImage: GeneratedImage = {
        id: Math.random().toString(36).substr(2, 9),
        url: imageUrl,
        settings: { ...settings },
        timestamp: Date.now()
      };
      setResult(newImage);
      setHistory(prev => [newImage, ...prev]);
      setStatus(GenerationStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(GenerationStatus.ERROR);
    }
  };

  const downloadImage = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `OG-Image-${name.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-12 items-start">
      {/* Sidebar Controls */}
      <div className="lg:col-span-4 space-y-8 sticky top-24">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Create your OG Image</h1>
          <p className="text-slate-500">Premium layouts, no design skills required.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Brand Name</label>
              <input
                type="text"
                name="name"
                value={settings.name}
                onChange={handleInputChange}
                placeholder="e.g. Acme.io"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Main Headline</label>
              <input
                type="text"
                name="headline"
                value={settings.headline}
                onChange={handleInputChange}
                placeholder="The future of design."
                maxLength={60}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-black outline-none transition-all"
              />
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Recommended: 3-6 words</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Brand Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="primaryColor"
                  value={settings.primaryColor}
                  onChange={handleInputChange}
                  className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer overflow-hidden p-0 bg-transparent"
                />
                <input
                  type="text"
                  name="primaryColor"
                  value={settings.primaryColor}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 outline-none uppercase font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Logo (Optional)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${settings.logoBase64 ? 'border-green-300 bg-green-50' : 'border-slate-200 hover:border-slate-400 bg-slate-50'}`}
              >
                {settings.logoBase64 ? (
                  <div className="flex flex-col items-center">
                    <svg className="w-6 h-6 text-green-500 mb-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span className="text-xs font-medium text-green-600">Logo Uploaded</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    <span className="text-xs font-medium">Upload PNG/SVG</span>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={status === GenerationStatus.LOADING}
            className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
              status === GenerationStatus.LOADING ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-black text-white hover:bg-slate-800 transform active:scale-95'
            }`}
          >
            {status === GenerationStatus.LOADING ? (
              <>
                <svg className="animate-spin h-5 w-5 text-slate-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Studio...
              </>
            ) : 'Generate OG Image'}
          </button>
        </div>
      </div>

      {/* Main Display Area */}
      <div className="lg:col-span-8 space-y-8">
        {/* Preview Frame */}
        <div className="aspect-video w-full rounded-[2rem] border-8 border-white bg-slate-200 shadow-2xl overflow-hidden relative group">
          {status === GenerationStatus.LOADING ? (
            <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-1 bg-slate-200 rounded-full overflow-hidden mb-4">
                <div className="w-1/2 h-full bg-black animate-shimmer"></div>
              </div>
              <p className="text-slate-500 font-medium animate-pulse">Our AI is composing your premium layout...</p>
              <p className="text-xs text-slate-400 mt-2 italic">Generating high-fidelity textures and shadows</p>
            </div>
          ) : result ? (
            <>
              <img src={result.url} alt="Generated OG Preview" className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => downloadImage(result.url, settings.name)}
                  className="p-3 bg-white/90 rounded-xl shadow-xl hover:bg-white text-black transition-all flex items-center gap-2 font-semibold text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download PNG
                </button>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 bg-slate-50 border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12">
               <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                 <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               </div>
               <h3 className="text-slate-500 font-semibold text-lg">Your preview will appear here</h3>
               <p className="text-slate-400 max-w-xs mt-2 text-sm">Enter your brand details and click generate to see the magic happen.</p>
            </div>
          )}
        </div>

        {/* Info / Empty state tips */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/50 p-6 rounded-2xl border border-slate-100">
             <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
               <span className="w-2 h-2 rounded-full bg-blue-500"></span>
               Why 16:9?
             </h4>
             <p className="text-sm text-slate-500 leading-relaxed">
               The 16:9 ratio is the golden standard for Open Graph images on LinkedIn, X (Twitter), and Facebook. It also fits perfectly into landing page hero sections.
             </p>
          </div>
          <div className="bg-white/50 p-6 rounded-2xl border border-slate-100">
             <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
               <span className="w-2 h-2 rounded-full bg-green-500"></span>
               Best Practices
             </h4>
             <p className="text-sm text-slate-500 leading-relaxed">
               Keep headlines under 40 characters for maximum impact. Use your primary brand color to build recognition across social feeds.
             </p>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="space-y-4 pt-8">
            <h3 className="text-xl font-bold text-slate-800">Recent Generations</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {history.map((img) => (
                <div key={img.id} className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <img src={img.url} alt="History item" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => downloadImage(img.url, img.settings.name)}
                      className="p-2 bg-white rounded-full text-black hover:bg-slate-100"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </button>
                    <button 
                      onClick={() => setResult(img)}
                      className="p-2 bg-white rounded-full text-black hover:bg-slate-100"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default Generator;
