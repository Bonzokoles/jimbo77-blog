import React from 'react';
import { Card, Chip, Button, Divider } from "@heroui/react";
import { Terminal as TerminalIcon, Quote, Youtube, Zap, Activity, Shield, Cpu, Terminal, Layers, Database } from 'lucide-react';

export const SidebarLeft = () => {
    // Technical navigation items
    const navItems = [
        { name: "Neural Map", icon: "🗺️", path: "/graph", color: "primary" },
        { name: "Neural Networks", icon: "🧠", count: 234, color: "primary" },
        { name: "Python Core", icon: "🐍", count: 189, color: "success" },
        { name: "React Frontend", icon: "⚛️", count: 156, color: "secondary" },
        { name: "DevOps / CI", icon: "🚀", count: 98, color: "warning" },
        { name: "Security", icon: "🔒", count: 45, color: "danger" },
    ];

    const quotes = [
        "The future is already here – it's just not evenly distributed.",
        "Any sufficiently advanced technology is indistinguishable from magic.",
        "Talk is cheap. Show me the code.",
        "Simplicity is the ultimate sophistication.",
        "Stay hungry, stay foolish.",
        "Hardware is the part of a computer that you can kick."
    ];

    const aiNews = [
        { title: "OpenAI o1: Reasoning Deep Dive", url: "https://youtube.com/results?search_query=openai+o1" },
        { title: "Claude 3.5 Sonnet: The Coding King", url: "https://youtube.com/results?search_query=claude+3.5+sonnet" },
        { title: "AgentZero: Full Autonomy Guide", url: "https://youtube.com/results?search_query=agentzero+ai" },
        { title: "DeepSeek-V3: Open Source Mastery", url: "https://youtube.com/results?search_query=deepseek+v3" },
        { title: "NVIDIA CUDA 13: What's New?", url: "https://youtube.com/results?search_query=nvidia+cuda+new" }
    ];

    return (
        <aside className="hidden lg:flex flex-col gap-6 w-full sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide pr-2">

            {/* --- NAVIGATION SECTOR --- */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/5 p-4 w-full shrink-0">
                {/* BRANDING HEADER */}
                <div className="flex flex-col items-center justify-center mb-6 pb-6 border-b border-white/5 w-full">
                    <div className="relative w-full h-32 mb-2 flex items-center justify-center group">
                        <div className="absolute inset-0 bg-cyan-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <img
                            src="/apple-touch-icon.png"
                            alt="Jimbo Logo"
                            className="h-full object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] z-10"
                        />
                    </div>
                    <h2 className="text-4xl font-display text-slate-300 tracking-widest text-center leading-none mb-1">
                        JIMBO<span className="text-cyan-600">77</span>
                    </h2>
                    {/* REMOVED: AI SOCIAL CLUB */}
                </div>

                <h3 className="font-display text-xl text-cyan-600 mb-4 tracking-widest border-b border-cyan-500/20 pb-2">
                    NERVE CENTER
                </h3>
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <Button
                            key={item.name}
                            as={item.path ? Link : "button"}
                            to={item.path}
                            variant="light"
                            className="justify-start text-slate-400 hover:text-cyan-600 hover:bg-white/5 h-12 group transition-all duration-300"
                        >
                            <span className="text-2xl mr-2 group-hover:scale-105 transition-transform opacity-70 group-hover:opacity-100">{item.icon}</span>
                            <span className="font-sans tracking-wide flex-1 text-left">{item.name}</span>
                            {item.count !== undefined && (
                                <Chip size="sm" variant="flat" className={`bg-${item.color}-900/10 text-${item.color}-700 text-xs border border-${item.color}-900/20 min-w-[30px]`}>
                                    {item.count}
                                </Chip>
                            )}
                        </Button>
                    ))}
                </nav>
            </Card>

            {/* --- EXTENDED TERMINAL SECTOR --- */}
            <Card className="bg-black/80 border border-green-500/30 p-0 overflow-hidden relative group flex-grow min-h-[700px]">
                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>
                
                <div className="p-1 bg-green-900/20 border-b border-green-500/30 flex items-center justify-between sticky top-0 bg-black z-20">
                    <div className="flex items-center gap-2 px-2">
                        <TerminalIcon size={12} className="text-green-500" />
                        <span className="text-[10px] text-green-500 font-mono">TERMINAL_V.3.0.1</span>
                    </div>
                    <div className="flex gap-1 pr-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                </div>

                <div className="p-4 font-mono text-xs text-green-400/80 space-y-8">
                    <div className="border-l-2 border-green-500/50 pl-3">
                        <span className="text-green-300 block mb-1 font-bold">&gt;&gt; SYSTEM_STATUS</span>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div className="flex items-center gap-1"><Activity size={10} /> <span>CPU: 45%</span></div>
                            <div className="flex items-center gap-1"><Shield size={10} /> <span>SEC: ACTIVE</span></div>
                            <div className="flex items-center gap-1"><Database size={10} /> <span>DB: READY</span></div>
                            <div className="flex items-center gap-1"><Layers size={10} /> <span>R2: SYNCED</span></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <span className="text-green-300 block mb-1 flex items-center gap-2">
                            <Quote size={12} /> DAILY_INJECT
                        </span>
                        <div className="space-y-3">
                            {quotes.map((q, i) => (
                                <p key={i} className="pl-3 border-l border-green-900/50 italic opacity-70 hover:opacity-100 transition-opacity">
                                    "{q}"
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <span className="text-green-300 block mb-1 flex items-center gap-2">
                            <Youtube size={12} /> INCOMING_STREAMS
                        </span>
                        <div className="grid gap-2">
                            {aiNews.map((news, i) => (
                                <a 
                                    key={i} 
                                    href={news.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block hover:bg-green-500/10 p-2 border border-green-900/30 rounded transition-all group"
                                >
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 font-bold">&gt;</span>
                                        <span className="group-hover:text-green-300 truncate">{news.title}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 opacity-40 text-[10px] text-center border-t border-green-900/30">
                        ESTABLISHING NEURAL LINK... <br />
                        [READY FOR COMMAND] <br />
                        LAST_SYNC: {new Date().toISOString()}
                    </div>
                </div>
            </Card>

        </aside>
    );
};

export const SidebarRight = () => {
    // Technical logs/metrics instead of movie characters
    const systemMetrics = [
        { label: "Core Latency", value: "12ms", status: "ok" },
        { label: "R2 Throughput", value: "1.2GB/s", status: "ok" },
        { label: "Ollama Load", value: "Idle", status: "ok" },
        { label: "DeepSeek API", value: "Connected", status: "ok" },
    ];

    return (
        <aside className="hidden xl:flex flex-col gap-6 w-full sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide pl-2">

            {/* --- SYSTEM METRICS --- */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/5 p-4 shrink-0">
                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                    <h3 className="font-display text-xl text-slate-400 tracking-widest">
                        METRICS
                    </h3>
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></div>
                    </div>
                </div>

                <div className="space-y-3">
                    {systemMetrics.map((metric, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-all border-b border-white/[0.02]">
                            <span className="text-xs text-slate-500 uppercase tracking-wider">{metric.label}</span>
                            <span className="text-xs text-cyan-500 font-mono font-bold">{metric.value}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* --- PROMO HOLO-AD --- */}
            <Card className="bg-gradient-to-br from-red-950/30 to-black border border-red-900/30 p-5 relative overflow-hidden group hover:border-red-800/60 transition-colors shrink-0">
                <div className="absolute top-0 right-0 p-2 opacity-30">
                    <div className="w-16 h-16 rounded-full bg-red-900/20 blur-xl"></div>
                </div>
                <h4 className="font-display text-2xl text-red-700 mb-1 z-10 relative flex items-center gap-2">
                    <Zap size={20} /> INITIALIZE PROTOCOL
                </h4>
                <p className="text-sm text-slate-500 mb-4 z-10 relative leading-tight">Access advanced systems and developer tools.</p>
                <Button className="w-full bg-red-950/40 hover:bg-red-900/60 text-red-600 border border-red-900/50 font-mono text-xs tracking-widest uppercase shadow-[0_0_10px_rgba(153,27,27,0.2)]">
                    Activate Access
                </Button>
            </Card>

            {/* --- INTELLIGENCE FEED --- */}
            <Card className="bg-slate-950/60 border border-cyan-900/30 p-4 flex-grow flex flex-col overflow-hidden min-h-[400px]">
                <h3 className="font-display text-lg text-cyan-800 mb-4 tracking-widest border-b border-cyan-900/20 pb-2 flex items-center gap-2">
                    <Cpu size={16} /> INTELLIGENCE_FEED
                </h3>
                
                <div className="space-y-4 flex-grow overflow-y-auto pr-1 text-xs">
                    <div className="p-2 rounded border border-white/5 bg-white/[0.02]">
                        <span className="text-cyan-600 block mb-1">[UPDATE]</span>
                        <p className="text-slate-500 leading-normal">System cleanup initiated. Removing obsolete metadata and local asset references.</p>
                    </div>
                    
                    <div className="p-2 rounded border border-white/5 bg-white/[0.02]">
                        <span className="text-purple-600 block mb-1">[ARCHIVE]</span>
                        <p className="text-slate-500 leading-normal">All legacy blog assets moved to ZZ_files. R2 Dynamic Engine online.</p>
                    </div>

                    <div className="p-2 rounded border border-white/5 bg-white/[0.02]">
                        <span className="text-blue-600 block mb-1">[SYSTEM]</span>
                        <p className="text-slate-500 leading-normal">Neural gateway 4940 established. Load balancer optimizing request distribution.</p>
                    </div>

                    <div className="p-2 rounded border border-white/5 bg-white/[0.02]">
                        <span className="text-yellow-600 block mb-1">[MCP_SYNC]</span>
                        <p className="text-slate-500 leading-normal">Synchronizing tool definitions with local workspace. 8 servers detected.</p>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 text-center">
                    <div className="text-[10px] text-slate-600 font-mono animate-pulse">
                        SCANNING FOR NEW DATA...
                    </div>
                </div>
            </Card>

            {/* --- TRENDING --- */}
            <Card className="bg-black/20 border border-white/5 p-4 shrink-0">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Trending Protocols</h4>
                <div className="flex flex-wrap gap-2">
                    {['#deepseek', '#mcp', '#r2', '#cuda', '#podman', '#optimization'].map(tag => (
                        <span key={tag} className="text-xs text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors font-mono">
                            {tag}
                        </span>
                    ))}
                </div>
            </Card>

        </aside>
    );
};
