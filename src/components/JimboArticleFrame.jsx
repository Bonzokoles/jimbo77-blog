import React, { useState } from 'react';
import { Spinner } from "@heroui/react";
import { AlertCircle } from 'lucide-react';

const JimboArticleFrame = ({ src, alt, className = "", isFeatured = false }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    return (
        <div className={`relative overflow-hidden group ${className}`}>
            {/* Outer Cyberpunk Frame */}
            <div className="absolute inset-0 border border-white/5 z-10 pointer-events-none" />
            <div className="absolute -inset-[1px] border border-cyan-500/20 z-10 pointer-events-none group-hover:border-cyan-500/40 transition-colors" />
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/50 z-20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50 z-20 pointer-events-none" />

            {/* Scanlines Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-30 opacity-20" />

            {/* Content Container */}
            <div className={`relative w-full h-full bg-slate-950 flex items-center justify-center`}>
                
                {/* Loading State */}
                {isLoading && !hasError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-40">
                        <Spinner size="lg" color="primary" />
                        <span className="text-[10px] text-cyan-500 font-mono mt-4 animate-pulse">INITIATING VISUAL_FEED...</span>
                    </div>
                )}

                {/* Error State */}
                {hasError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-40 border-2 border-red-500/20">
                        <AlertCircle className="text-red-500 mb-2" size={32} />
                        <span className="text-[10px] text-red-500 font-mono uppercase tracking-widest">ERROR: SIGNAL_LOST</span>
                        <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
                    </div>
                )}

                {/* The Actual Image */}
                {src && (
                    <img
                        src={src}
                        alt={alt}
                        className={`w-full h-full object-cover relative z-20 transition-transform duration-1000 group-hover:scale-105 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setIsLoading(false);
                            setHasError(true);
                        }}
                    />
                )}

                {/* Decorative HUD Elements */}
                <div className="absolute top-2 right-2 flex gap-1 z-30 opacity-40">
                    <div className="w-1 h-1 bg-cyan-500 rounded-full animate-ping" />
                    <div className="w-1 h-1 bg-cyan-500/50 rounded-full" />
                </div>
                <div className="absolute bottom-2 left-2 text-[8px] text-cyan-500/30 font-mono z-30 pointer-events-none uppercase">
                    IMG_STREAM_ID: {Math.random().toString(16).slice(2, 8)}
                </div>
            </div>

            {/* Bottom Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-[25] pointer-events-none" />
        </div>
    );
};

export default JimboArticleFrame;
