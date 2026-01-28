import React, { useState } from 'react';
import { Spinner } from "@heroui/react";
import { AlertCircle } from 'lucide-react';

const JimboArticleFrame = ({ src, alt, className = "" }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    return (
        <div className={`relative overflow-hidden group border border-white/10 rounded-2xl bg-black/20 ${className}`}>
            {/* Cyberpunk Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/50 z-30" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50 z-30" />

            {/* Loading/Error States */}
            {isLoading && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center z-40 bg-slate-900/40 backdrop-blur-sm">
                    <Spinner size="sm" color="primary" />
                </div>
            )}
            
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center z-40 bg-red-950/20">
                    <AlertCircle className="text-red-500/50" size={24} />
                </div>
            )}

            {/* THE ACTUAL IMAGE - Must be visible! */}
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-105 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                }}
            />

            {/* Scanlines Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none z-20 opacity-30" />
        </div>
    );
};

export default JimboArticleFrame;
