import React from 'react';
import { Card, Chip, Button, Avatar } from "@heroui/react";

export const SidebarLeft = () => {
    // Mock data for navigation
    const navItems = [
        { name: "Ai Agents", icon: "🤖", count: 234, color: "primary" },
        { name: "Python", icon: "🐍", count: 189, color: "success" },
        { name: "React", icon: "⚛️", count: 156, color: "secondary" },
        { name: "DevOps", icon: "🚀", count: 98, color: "warning" },
        { name: "CyberSec", icon: "🔒", count: 45, color: "danger" },
    ];

    return (
        <aside className="hidden lg:flex flex-col gap-6 w-full sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide pr-2">

            {/* --- NAVIGATION SECTOR --- */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/5 p-4 w-full">

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

            {/* --- DAILY BRIEF SECTOR (TERMINAL STYLE) --- */}
            <Card className="bg-black/80 border border-green-500/30 p-0 overflow-hidden relative group">
                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>
                <div className="p-1 bg-green-900/20 border-b border-green-500/30 flex items-center justify-between">
                    <span className="text-[10px] text-green-500 font-mono px-2">TERMINAL_V.3.0.1</span>
                    <div className="flex gap-1 pr-2">
                        <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                    </div>
                </div>
                <div className="p-4 font-mono text-xs text-green-400/80 space-y-3">
                    <div className="border-l-2 border-green-500/50 pl-2">
                        <span className="text-green-300 block mb-1">&gt;&gt; DAILY_INJECT</span>
                        <p className="typing-effect">"The future is already here, it's just not evenly distributed."</p>
                    </div>

                    <div className="space-y-2 mt-4">
                        <p className="text-white/60 text-[10px] uppercase tracking-wider mb-2">INCOMING_STREAMS:</p>
                        <a href="#" className="block hover:bg-green-500/10 p-1 -mx-1 rounded transition-colors truncate">
                            &gt; [YT] Agent Zero 2.0 Released
                        </a>
                        <a href="#" className="block hover:bg-green-500/10 p-1 -mx-1 rounded transition-colors truncate">
                            &gt; [MED] RAG Systems Optimization
                        </a>
                        <a href="#" className="block hover:bg-green-500/10 p-1 -mx-1 rounded transition-colors truncate">
                            &gt; [TUT] Cursor + MCP Guide
                        </a>
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
            <Card className="bg-gradient-to-br from-red-950/30 to-black border border-red-900/30 p-5 relative overflow-hidden group hover:border-red-800/60 transition-colors">
                <div className="absolute top-0 right-0 p-2 opacity-30">
                    <div className="w-16 h-16 rounded-full bg-red-900/20 blur-xl"></div>
                </div>
                <h4 className="font-display text-2xl text-red-700 mb-1 z-10 relative">JOIN THE ELITE</h4>
                <p className="text-sm text-slate-500 mb-4 z-10 relative">Access premium Agent workflows and MCP tools.</p>
                <Button className="w-full bg-red-950/40 hover:bg-red-900/60 text-red-600 border border-red-900/50 font-mono text-xs tracking-widest uppercase">
                    Initialize Protocol
                </Button>
            </Card>

            {/* --- COMMUNITY PULSE --- */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/5 p-4 flex-1">
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

                    <div className="pt-4 text-center">
                        <Button size="sm" variant="light" className="text-slate-500 text-xs hover:text-white">
                            View All Members ({34})
                        </Button>
                    </div>
                </div>
            </Card>

            {/* --- TRENDING TAGS --- */}
            <Card className="bg-black/20 border border-white/5 p-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Trending Protocols</h4>
                <div className="flex flex-wrap gap-2">
                    {['#agentzero', '#mcp', '#web3', '#rust', '#tokio'].map(tag => (
                        <span key={tag} className="text-xs text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>
            </Card>

        </aside>
    );
};
