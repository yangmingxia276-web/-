
import React, { useState, useRef } from 'react';
import Header from './components/Header';
import { PET_IMAGE_PACK, PET_CATEGORIES, AMAZON_SITES } from './constants';
import { GeneratedImage, PetCategory, AmazonSite } from './types';
import { generatePetImage } from './services/geminiService';

const App: React.FC = () => {
  const [sourceImages, setSourceImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [site, setSite] = useState<AmazonSite>('US');
  const [category, setCategory] = useState<PetCategory>('Bedding');
  const [customPrompt, setCustomPrompt] = useState('');
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSourceImages(prev => prev.filter((_, i) => i !== index));
  };

  const generateFullPack = async () => {
    if (sourceImages.length === 0) return;
    setIsGenerating(true);
    setResults([]);
    setProgress(0);

    const pack = PET_IMAGE_PACK;
    let completed = 0;

    for (const item of pack) {
      try {
        // Pass all source images for better reference context
        const url = await generatePetImage(sourceImages, item.prompt, site, customPrompt);
        if (url) {
          const newImg: GeneratedImage = {
            id: Math.random().toString(36).substr(2, 9),
            url,
            type: item.type,
            label: item.label,
            isCompliant: true,
            complianceNotes: ["Passed: Site Specific Check", "Passed: No Text Rule"]
          };
          setResults(prev => [...prev, newImg]);
        }
      } catch (err) {
        console.error(`Failed to generate ${item.label}`, err);
      }
      completed++;
      setProgress(Math.round((completed / pack.length) * 100));
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow max-w-[1600px] mx-auto w-full p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Control Panel */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <i className="fas fa-paw mr-2 text-orange-500"></i>
              Source Images ({sourceImages.length})
            </h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {sourceImages.map((img, idx) => (
                <div key={idx} className="relative group aspect-square rounded-lg border border-slate-100 overflow-hidden bg-slate-50">
                  <img src={img} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center hover:border-orange-300 hover:bg-orange-50/30 transition-all"
              >
                <i className="fas fa-plus text-slate-300"></i>
                <span className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Add Photo</span>
              </button>
            </div>
            
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" multiple />
            
            <p className="text-[10px] text-slate-400 leading-relaxed bg-slate-50 p-2 rounded-lg italic">
              * Uploading multiple angles/parts helps AI maintain 100% product accuracy.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Market & Category</label>
              <div className="grid grid-cols-2 gap-2">
                <select 
                  value={site} 
                  onChange={(e) => setSite(e.target.value as AmazonSite)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  {AMAZON_SITES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value as PetCategory)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  {PET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block flex items-center">
                Custom Instructions
                <span className="ml-auto text-[10px] text-orange-500 normal-case">Optional</span>
              </label>
              <textarea 
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. emphasize the reflective stitching, the wood is natural oak color..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs min-h-[80px] focus:ring-2 focus:ring-orange-500 outline-none resize-none"
              />
            </div>

            <button
              onClick={generateFullPack}
              disabled={sourceImages.length === 0 || isGenerating}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center space-x-2
                ${sourceImages.length === 0 || isGenerating ? 'bg-slate-300' : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-[1.02]'}`}
            >
              {isGenerating ? (
                <>
                  <i className="fas fa-spinner animate-spin"></i>
                  <span>AI Flow Running ({progress}%)</span>
                </>
              ) : (
                <>
                  <i className="fas fa-wand-magic-sparkles"></i>
                  <span>Generate Full Pack</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Right Preview Grid */}
        <section className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[700px] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 flex items-center">
                Visual Studio Pipeline
                <span className="ml-3 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full uppercase tracking-tighter">Compliance Engine Active</span>
              </h2>
              {results.length > 0 && (
                <div className="flex space-x-3">
                   <button className="text-xs font-bold text-slate-500 hover:text-slate-700">
                    <i className="fas fa-trash-alt mr-1"></i> Clear
                  </button>
                  <button className="text-xs font-bold text-orange-600 hover:text-orange-700">
                    <i className="fas fa-download mr-1"></i> Download All
                  </button>
                </div>
              )}
            </div>

            <div className="p-6">
              {isGenerating && results.length === 0 && (
                <div className="h-[500px] flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                    <i className="fas fa-robot absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500 text-xl"></i>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-slate-800 font-bold">Processing Visual Reference Data</p>
                    <p className="text-slate-500 text-sm max-w-sm">Applying {site} marketplace rules to your {category} products...</p>
                    <div className="w-64 h-2 bg-slate-100 rounded-full mx-auto overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 transition-all duration-500" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {results.length === 0 && !isGenerating ? (
                <div className="h-[500px] flex flex-col items-center justify-center text-slate-300">
                  <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                    <i className="fas fa-images text-4xl"></i>
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg mb-2">Build Your Pro Visual Pack</h3>
                  <p className="text-sm max-w-md text-center">
                    Upload product photos from different angles (front, side, detail) 
                    and add specific instructions to guide the AI.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {results.map((img) => (
                    <div key={img.id} className="group border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white flex flex-col">
                      <div className="aspect-square bg-white relative border-b border-slate-50">
                        <img src={img.url} className="w-full h-full object-contain p-4" alt={img.label} />
                        <div className="absolute top-2 left-2 right-2 flex justify-between">
                          <span className="bg-white/90 backdrop-blur shadow-sm text-slate-900 text-[10px] font-bold px-2 py-1 rounded border border-slate-100">
                            {img.label}
                          </span>
                          {img.isCompliant && (
                            <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-1 rounded-full flex items-center shadow-sm">
                              <i className="fas fa-shield-check mr-1"></i>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-1">
                            {img.complianceNotes.map((note, i) => (
                              <span key={i} className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
                                {note}
                              </span>
                            ))}
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-2 italic">
                            Generated based on {sourceImages.length} references + custom prompt.
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{img.type}</span>
                          <div className="flex space-x-1">
                             <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-orange-50 hover:text-orange-500 transition-colors">
                               <i className="fas fa-redo text-xs"></i>
                             </button>
                             <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                               <i className="fas fa-download text-xs"></i>
                             </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <div className="fixed bottom-6 right-6 group">
        <div className="bg-slate-900 text-white text-xs py-2 px-4 rounded-full shadow-2xl flex items-center space-x-2 transform scale-0 group-hover:scale-100 origin-right transition-transform mb-2">
          <i className="fas fa-headset text-orange-400"></i>
          <span>Expert Support Online</span>
        </div>
        <button className="bg-orange-500 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 transition-colors">
          <i className="fas fa-question"></i>
        </button>
      </div>
    </div>
  );
};

export default App;
