import React from 'react';
import KnowledgeGraph from '../components/KnowledgeGraph';
import BlogLayout from '../layouts/BlogLayout';

const GraphPage = () => {
    return (
        <BlogLayout>
            <div className="max-w-7xl mx-auto px-4 pb-24">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight leading-tight uppercase font-mono">
                        Neural <span className="text-cyan-500">Map</span>
                    </h1>
                    <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">
                        Visualizing Knowledge Connections across the Ecosystem
                    </p>
                </header>

                <KnowledgeGraph />

                <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/5">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                        System Diagnostics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono text-slate-500">
                        <div>
                            <span className="text-cyan-600 block mb-1">DATA_SOURCE</span>
                            Cloudflare R2 (mybonzo-media)
                        </div>
                        <div>
                            <span className="text-cyan-600 block mb-1">PROTOCOL</span>
                            xyflow/react (React Flow)
                        </div>
                        <div>
                            <span className="text-cyan-600 block mb-1">STATUS</span>
                            Connected to Live Hub
                        </div>
                    </div>
                </div>
            </div>
        </BlogLayout>
    );
};

export default GraphPage;
