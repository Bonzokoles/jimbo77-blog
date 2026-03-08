import React, { useState } from 'react';
import { Spinner } from "@heroui/react";
import { AlertCircle, Maximize2 } from 'lucide-react';

/**
 * 🛰️ JIMBO_ARTICLE_FRAME_V2
 * The gold standard for image rendering in Jimbo OS.
 * Uses Method #1 (Raw <img>) for maximum compatibility.
 */
const JimboArticleFrame = ({ src, alt, className = "" }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    return (
        <div className={`relative overflow-hidden group border border-white/10 rounded-2xl bg-slate-900/20 backdrop-blur-sm ${className}`}>
            {/* --- Cyberpunk HUD Accents --- */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/40 z-40 rounded-tl-sm" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/40 z-40 rounded-tr-sm" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/40 z-40 rounded-bl-sm" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/40 z-40 rounded-br-sm" />

            {/* --- Technical Overlays --- */}
            <div className="absolute top-2 left-4 flex gap-1 z-40 opacity-30 font-mono text-[8px] text-cyan-500">
                <span>REC</span>
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            </div>
            
            <div className="absolute bottom-2 right-4 z-40 opacity-20 hover:opacity-100 transition-opacity">
                <Maximize2 size={12} className="text-white cursor-pointer" />
            </div>

            {/* --- Scanline / Grid Effect --- */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.02)_50%)] bg-[length:100%_4px] pointer-events-none z-30 opacity-30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[length:20px_20px] pointer-events-none z-30 opacity-30" />

            {/* --- State Handlers --- */}
            {isLoading && !hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-slate-950/80">
                    <Spinner size="md" color="primary" />
                    <span className="text-[8px] font-mono text-cyan-500 mt-2 tracking-[0.3em] animate-pulse">ESTABLISHING_LINK...</span>
                </div>
            )}
            
            {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-red-950/20 border border-red-500/20">
                    <AlertCircle className="text-red-500/50 mb-2" size={24} />
                    <span className="text-[8px] font-mono text-red-500 tracking-widest uppercase">SIGNAL_LOST_404</span>
                </div>
            )}

            {/* --- THE ACTUAL IMAGE (Method #1) --- */}
            {src && (
                <img
                    src={src}
                    alt={alt}
                    className={`w-full h-full object-cover relative z-10 transition-all duration-1000 group-hover:scale-105 group-hover:brightness-110 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false);
                        setHasError(true);
                    }}
                />
            )}

            {/* --- Aesthetic Bottom Glow --- */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-25 pointer-events-none opacity-40" />
        </div>
    );
};

export default JimboArticleFrame;
