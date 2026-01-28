import React from 'react';
import { Card, Chip, Button, Avatar, Divider } from "@heroui/react";
import { Terminal as TerminalIcon, Quote, Youtube, Zap, Activity, Shield, Cpu } from 'lucide-react';

export const SidebarLeft = () => {
    // Mock data for navigation
    const navItems = [
        { name: "Ai Agents", icon: "🤖", count: 234, color: "primary" },
        { name: "Python", icon: "🐍", count: 189, color: "success" },
        { name: "React", icon: "⚛️", count: 156, color: "secondary" },
        { name: "DevOps", icon: "🚀", count: 98, color: "warning" },
        { name: "CyberSec", icon: "🔒", count: 45, color: "danger" },
    ];

    const quotes = [
        "The future belongs to those who prepare for it today.",
        "Artificial Intelligence is the new electricity.",
        "Code is like humor. When you have to explain it, it’s bad.",
        "Simplicity is the ultimate sophistication."
    ];

    const aiNews = [
        { title: "OpenAI o1: A new era of reasoning", url: "https://youtube.com/results?search_query=openai+o1" },
        { title: "Claude 3.5 Sonnet: Coding benchmark king", url: "https://youtube.com/results?search_query=claude+3.5+sonnet" },
        { title: "AgentZero: Autonomous workflow mastery", url: "https://youtube.com/results?search_query=agentzero+ai" }
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
                    <p className="text-[10px] text-cyan-500/80 uppercase tracking-[0.4em] font-bold">
                        AI SOCIAL CLUB
                    </p>
                </div>

                <h3 className="font-display text-xl text-cyan-600 mb-4 tracking-widest border-b border-cyan-500/20 pb-2">
                    NERVE CENTER
                </h3>
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <Button
                            key={item.name}
                            variant="light"
                            className="justify-start text-slate-400 hover:text-cyan-600 hover:bg-white/5 h-12 group transition-all duration-300"
                        >
                            <span className="text-2xl mr-2 group-hover:scale-105 transition-transform opacity-70 group-hover:opacity-100">{item.icon}</span>
                            <span className="font-sans tracking-wide flex-1 text-left">{item.name}</span>
                            <Chip size="sm" variant="flat" className={`bg-${item.color}-900/10 text-${item.color}-700 text-xs border border-${item.color}-900/20 min-w-[30px]`}>
                                {item.count}
                            </Chip>
                        </Button>
                    ))}
                </nav>
            </Card>

            {/* --- EXTENDED TERMINAL SECTOR --- */}
            <Card className="bg-black/80 border border-green-500/30 p-0 overflow-hidden relative group flex-grow min-h-[500px]">
                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>
                
                <div className="p-1 bg-green-900/20 border-b border-green-500/30 flex items-center justify-between sticky top-0 bg-black z-20">
                    <div className="flex items-center gap-2 px-2">
                        <TerminalIcon size={12} className="text-green-500" />
                        <span className="text-[10px] text-green-500 font-mono">JIMBO_CORE_V.3.1.0</span>
                    </div>
                    <div className="flex gap-1 pr-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                </div>

                <div className="p-4 font-mono text-xs text-green-400/80 space-y-6">
                    <div className="border-l-2 border-green-500/50 pl-3">
                        <span className="text-green-300 block mb-1 font-bold">&gt;&gt; SYSTEM_STATUS</span>
                        <div className="flex items-center gap-2 text-[10px]">
                            <Activity size={10} /> <span>CPU_LOAD: 45%</span>
                            <Divider orientation="vertical" className="h-3 bg-green-900" />
                            <Shield size={10} /> <span>SEC_FIREWALL: ACTIVE</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <span className="text-green-300 block mb-1 flex items-center gap-2">
                            <Quote size={12} /> THOUGHT_INJECT
                        </span>
                        {quotes.map((q, i) => (
                            <p key={i} className="pl-3 border-l border-green-900/50 italic opacity-70 hover:opacity-100 transition-opacity">
                                "{q}"
                            </p>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <span className="text-green-300 block mb-1 flex items-center gap-2">
                            <Youtube size={12} /> AI_STREAMS_LIVE
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
                                        <span className="text-green-600 font-bold">[{i+1}]</span>
                                        <span className="group-hover:text-green-300 truncate">{news.title}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 opacity-40 text-[10px] text-center border-t border-green-900/30">
                        ESTABLISHING NEURAL LINK... <br />
                        [READY FOR COMMAND]
                    </div>
                </div>
            </Card>

        </aside>
    );
};

export const SidebarRight = () => {
    // Mock user data
    const users = [
        { name: "Neo_Anderson", role: "Architect", status: "online" },
        { name: "Trinity_X", role: "DevOps", status: "busy" },
        { name: "Morpheus_Dev", role: "Mentor", status: "online" },
        { name: "Cypher_Sec", role: "Security", status: "offline" },
        { name: "Tank_Operator", role: "SysAdmin", status: "online" },
        { name: "Switch_UI", role: "Frontend", status: "away" },
    ];

    return (
        <aside className="hidden xl:flex flex-col gap-6 w-full sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide pl-2">

            {/* --- PROMO HOLO-AD --- */}
            <Card className="bg-gradient-to-br from-red-950/30 to-black border border-red-900/30 p-5 relative overflow-hidden group hover:border-red-800/60 transition-colors shrink-0">
                <div className="absolute top-0 right-0 p-2 opacity-30">
                    <div className="w-16 h-16 rounded-full bg-red-900/20 blur-xl"></div>
                </div>
                <h4 className="font-display text-2xl text-red-700 mb-1 z-10 relative flex items-center gap-2">
                    <Zap size={20} /> JOIN THE ELITE
                </h4>
                <p className="text-sm text-slate-500 mb-4 z-10 relative leading-tight">Access premium Agent workflows and MCP tools.</p>
                <Button className="w-full bg-red-950/40 hover:bg-red-900/60 text-red-600 border border-red-900/50 font-mono text-xs tracking-widest uppercase shadow-[0_0_10px_rgba(153,27,27,0.2)]">
                    Initialize Protocol
                </Button>
            </Card>

            {/* --- NETRUNNERS SECTOR --- */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/5 p-4 shrink-0">
                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                    <h3 className="font-display text-xl text-slate-400 tracking-widest">
                        NETRUNNERS
                    </h3>
                    <Chip size="sm" variant="dot" color="success" className="bg-transparent border-0 text-success-600">
                        {users.filter(u => u.status === 'online').length} Online
                    </Chip>
                </div>

                <div className="space-y-4">
                    {users.map((user, idx) => (
                        <div key={idx} className="flex items-center gap-3 group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-all">
                            <div className="relative">
                                <Avatar
                                    name={user.name}
                                    className="w-8 h-8 text-xs bg-slate-900 border border-white/5 text-slate-500"
                                />
                                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-black ${user.status === 'online' ? 'bg-green-700 shadow-[0_0_5px_green]' :
                                    user.status === 'busy' ? 'bg-red-700' :
                                        user.status === 'away' ? 'bg-yellow-700' : 'bg-slate-700'
                                    }`}></span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-400 font-medium group-hover:text-cyan-700 transition-colors">{user.name}</span>
                                <span className="text-[10px] text-slate-600 uppercase tracking-wide">{user.role}</span>
                            </div>
                        </div>
                    ))}

                    <div className="pt-2 text-center">
                        <Button size="sm" variant="light" className="text-slate-500 text-xs hover:text-white w-full">
                            View All Members ({34})
                        </Button>
                    </div>
                </div>
            </Card>

            {/* --- NEW: SYSTEM LOGS / INTELLIGENCE FEED --- */}
            <Card className="bg-slate-950/60 border border-cyan-900/30 p-4 flex-grow flex flex-col overflow-hidden">
                <h3 className="font-display text-lg text-cyan-800 mb-4 tracking-widest border-b border-cyan-900/20 pb-2 flex items-center gap-2">
                    <Cpu size={16} /> INTELLIGENCE_FEED
                </h3>
                
                <div className="space-y-4 flex-grow overflow-y-auto pr-1 text-xs">
                    <div className="p-2 rounded border border-white/5 bg-white/[0.02]">
                        <span className="text-cyan-600 block mb-1">[UPDATE]</span>
                        <p className="text-slate-500 leading-normal">Jimbo OS v1.3 migration to R2 dynamic hub completed successfully. All assets moved to chloud.</p>
                    </div>
                    
                    <div className="p-2 rounded border border-white/5 bg-white/[0.02]">
                        <span className="text-purple-600 block mb-1">[AGENT_LOG]</span>
                        <p className="text-slate-500 leading-normal">Sisyphus processed 5 upcoming articles. Optimization level: ULTRA.</p>
                    </div>

                    <div className="p-2 rounded border border-white/5 bg-white/[0.02]">
                        <span className="text-blue-600 block mb-1">[SYSTEM]</span>
                        <p className="text-slate-500 leading-normal">Neural gateway 4940 established. Latency: 12ms. Secure tunnel active.</p>
                    </div>

                    <div className="p-2 rounded border border-white/5 bg-white/[0.02]">
                        <span className="text-yellow-600 block mb-1">[INFO]</span>
                        <p className="text-slate-500 leading-normal">New MCP server added: Brave Search. Accessing real-time web data enabled.</p>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 text-center">
                    <div className="text-[10px] text-slate-600 font-mono animate-pulse">
                        SCANNING FOR NEW DATA...
                    </div>
                </div>
            </Card>

            {/* --- TRENDING TAGS --- */}
            <Card className="bg-black/20 border border-white/5 p-4 shrink-0">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Trending Protocols</h4>
                <div className="flex flex-wrap gap-2">
                    {['#agentzero', '#mcp', '#web3', '#rust', '#tokio', '#r2', '#cloudflare'].map(tag => (
                        <span key={tag} className="text-xs text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>
            </Card>

        </aside>
    );
};
