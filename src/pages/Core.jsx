import React from 'react';
import { Card, Button } from "@heroui/react";
import { Cpu, Server, Shield, Globe } from 'lucide-react';

const Core = () => {
    return (
        <div className="min-h-screen pt-12 pb-12 w-full">
            <div className="container mx-auto px-4 max-w-6xl">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <h1 className="font-display text-6xl text-white mb-6 leading-tight">
                            SYSTEM<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">ARCHITECTURE</span>
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            JIMBO77 Core to zdecentralizowany system zarządzania wiedzą i agentami AI.
                            Zbudowany w oparciu o Model Context Protocol (MCP) i architekturę Agentic RAG.
                        </p>
                        <div className="flex gap-4">
                            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8">
                                Documentation
                            </Button>
                            <Button variant="bordered" className="text-cyan-400 border-cyan-500/30 hover:bg-cyan-900/10">
                                View Source
                            </Button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full"></div>
                        <img
                            src="https://images.unsplash.com/photo-1558494949-efc02570fbc9?q=80&w=2000&auto=format&fit=crop"
                            alt="Core System"
                            className="relative z-10 rounded-2xl border border-white/10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: <Cpu size={32} />, title: "Neural Processing", desc: "Advanced LLM integration via MCP." },
                        { icon: <Server size={32} />, title: "Edge Network", desc: "Distributed on Cloudflare Workers." },
                        { icon: <Shield size={32} />, title: "Quantized Security", desc: "Zero-Trust Agent Auth." },
                        { icon: <Globe size={32} />, title: "Global Mesh", desc: "Low-latency context synchronization." },
                    ].map((item, idx) => (
                        <Card key={idx} className="bg-slate-900/50 border border-white/5 p-6 hover:border-cyan-500/50 hover:-translate-y-1 transition-all group">
                            <div className="mb-4 text-slate-500 group-hover:text-cyan-400 transition-colors">
                                {item.icon}
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                            <p className="text-slate-500 text-sm">
                                {item.desc}
                            </p>
                        </Card>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Core;
