import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Chip } from "@heroui/react";
import { Cpu, Server, Shield, Globe, CheckCircle, XCircle, RefreshCw, GitCommit, Database, Zap, Brain, Cloud, Code2, Layers, Box, Activity } from 'lucide-react';
import { ReactFlow, Background, Controls, MarkerType, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const WORKER_URL = "https://r2-public-mybonzo.stolarnia-ams.workers.dev";

// ─── Custom node dla flow diagramu ───────────────────────────────────────────
const FlowNode = ({ data }) => (
    <div className={`px-4 py-3 rounded-xl border text-xs font-mono min-w-[130px] text-center shadow-lg ${data.style}`}>
        <Handle type="target" position={Position.Left} style={{ background: '#06b6d4', border: 'none', width: 8, height: 8 }} />
        <div className="text-lg mb-1">{data.icon}</div>
        <div className="font-bold text-white">{data.label}</div>
        {data.sub && <div className="text-[10px] mt-0.5 opacity-60">{data.sub}</div>}
        <Handle type="source" position={Position.Right} style={{ background: '#06b6d4', border: 'none', width: 8, height: 8 }} />
    </div>
);

const nodeTypes = { flowNode: FlowNode };

const flowNodes = [
    { id: '1', type: 'flowNode', position: { x: 0, y: 60 },   data: { label: 'User / Browser', sub: 'jimbo77.org', icon: '👤', style: 'bg-slate-800 border-slate-600' } },
    { id: '2', type: 'flowNode', position: { x: 200, y: 60 }, data: { label: 'Cloudflare Edge', sub: 'CDN + WAF', icon: '🌐', style: 'bg-orange-900/60 border-orange-500/50' } },
    { id: '3', type: 'flowNode', position: { x: 400, y: 0 },  data: { label: 'Vercel', sub: 'React SPA', icon: '▲', style: 'bg-slate-800 border-slate-500' } },
    { id: '4', type: 'flowNode', position: { x: 400, y: 120 },data: { label: 'CF Workers', sub: 'API / R2 proxy', icon: '⚙️', style: 'bg-orange-900/60 border-orange-500/50' } },
    { id: '5', type: 'flowNode', position: { x: 620, y: 0 },  data: { label: 'R2 Storage', sub: 'posts + images', icon: '🪣', style: 'bg-cyan-900/60 border-cyan-500/50' } },
    { id: '6', type: 'flowNode', position: { x: 620, y: 120 },data: { label: 'D1 Database', sub: 'listings + news', icon: '🗄️', style: 'bg-cyan-900/60 border-cyan-500/50' } },
    { id: '7', type: 'flowNode', position: { x: 840, y: 60 }, data: { label: 'Claude AI', sub: 'MCP + Agents', icon: '🤖', style: 'bg-purple-900/60 border-purple-500/50' } },
];

const edgeStyle = { stroke: '#06b6d4', strokeWidth: 1.5 };
const flowEdges = [
    { id: 'e1-2', source: '1', target: '2', style: edgeStyle, markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' }, animated: true },
    { id: 'e2-3', source: '2', target: '3', style: edgeStyle, markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' } },
    { id: 'e2-4', source: '2', target: '4', style: edgeStyle, markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' } },
    { id: 'e4-5', source: '4', target: '5', style: edgeStyle, markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' } },
    { id: 'e4-6', source: '4', target: '6', style: edgeStyle, markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' } },
    { id: 'e5-7', source: '5', target: '7', style: { ...edgeStyle, stroke: '#a855f7' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' }, animated: true },
];

// ─── Dane ─────────────────────────────────────────────────────────────────────
const mcpStack = [
    { icon: <Brain size={18} />, name: 'Claude Sonnet 4.6', tag: 'LLM', desc: 'Główny model AI — code review, artykuły, architektura systemu.', color: 'text-purple-400 border-purple-500/30 bg-purple-900/20' },
    { icon: <Cloud size={18} />, name: 'Cloudflare Workers AI', tag: 'Edge AI', desc: 'Inference na edge — embeddingi, klasyfikacja, szybkie odpowiedzi.', color: 'text-orange-400 border-orange-500/30 bg-orange-900/20' },
    { icon: <Box size={18} />, name: 'Replicate', tag: 'Image AI', desc: 'Generowanie obrazów do artykułów i hero grafik.', color: 'text-pink-400 border-pink-500/30 bg-pink-900/20' },
    { icon: <Layers size={18} />, name: 'MCP Protocol', tag: 'Standard', desc: 'Model Context Protocol — integracja narzędzi z agentami AI.', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-900/20' },
    { icon: <Database size={18} />, name: 'Cloudflare D1', tag: 'DB', desc: 'SQLite na edge — marketplace listings, community news.', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-900/20' },
    { icon: <Server size={18} />, name: 'Cloudflare R2', tag: 'Storage', desc: 'Object storage — posty Markdown, obrazy, pliki statyczne.', color: 'text-blue-400 border-blue-500/30 bg-blue-900/20' },
    { icon: <Code2 size={18} />, name: 'Vite + React 18', tag: 'Frontend', desc: 'SPA z HeroUI, Tailwind CSS, React Router, Framer Motion.', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20' },
    { icon: <Zap size={18} />, name: 'Hono.js', tag: 'API', desc: 'Ultra-lekki framework dla Cloudflare Workers API.', color: 'text-red-400 border-red-500/30 bg-red-900/20' },
];

const changelog = [
    { version: 'v1.0.5', date: '2026-03-10', label: 'current', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-900/20', items: ['Home: 8 postów (2 duże + 6 małych), sortowanie wg daty', 'Footer: uproszczony newsletter bar', 'BlogHub: 7 artykułów MIT News AI (Polish)', 'Core: Live Status + Architecture Diagram + MCP Stack + Changelog'] },
    { version: 'v1.0.4', date: '2026-03-10', label: '', color: 'text-slate-400 border-slate-600 bg-slate-900/40', items: ['Community Hub v2.0 — MarketplaceSidebar + GazetkaSidebar', 'Layout 25/50/25 (max-w-1920px)', 'Collapsible sidebars, klikalny autor w marketplace', 'Linki ekosystemu: jimbo77.com / mybonzo.com / zenbrowsers.org'] },
    { version: 'v1.0.3', date: '2026-02-01', label: '', color: 'text-slate-400 border-slate-600 bg-slate-900/40', items: ['GEO artykuły: llms.txt, AI Bot Tracking, Reputation Score', 'BlogPost: ReactMarkdown + rehype-highlight', 'R2 Dynamic posts — fetch z Cloudflare Worker'] },
    { version: 'v1.0.2', date: '2026-01-15', label: '', color: 'text-slate-400 border-slate-600 bg-slate-900/40', items: ['Navbar redesign, mobilna nawigacja', 'SEO: SchemaOrg + react-helmet', 'Sidebars na stronie głównej'] },
    { version: 'v1.0.0', date: '2026-01-01', label: 'launch', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-900/20', items: ['Launch JIMBO77.ORG — AI Social Club', 'Pierwsze artykuły: Orkiestracja Multi-Agentowa, Pumo RAG', 'Stack: React + Vite + Tailwind + Cloudflare Workers'] },
];

// ─── Component ────────────────────────────────────────────────────────────────
const Core = () => {
    const [workerStatus, setWorkerStatus] = useState('checking');
    const [lastChecked, setLastChecked] = useState(null);

    const checkWorker = useCallback(async () => {
        setWorkerStatus('checking');
        try {
            const res = await fetch(`${WORKER_URL}/api/posts`, { signal: AbortSignal.timeout(4000) });
            setWorkerStatus(res.ok ? 'online' : 'degraded');
        } catch {
            setWorkerStatus('offline');
        }
        setLastChecked(new Date().toLocaleTimeString('pl-PL'));
    }, []);

    useEffect(() => { checkWorker(); }, [checkWorker]);

    const statusCfg = {
        online:   { icon: <CheckCircle size={14} />, label: 'Online',    color: 'text-emerald-400', dot: 'bg-emerald-400' },
        offline:  { icon: <XCircle size={14} />,     label: 'Offline',   color: 'text-red-400',     dot: 'bg-red-400' },
        degraded: { icon: <Activity size={14} />,    label: 'Degraded',  color: 'text-yellow-400',  dot: 'bg-yellow-400' },
        checking: { icon: <RefreshCw size={14} className="animate-spin" />, label: 'Checking…', color: 'text-slate-400', dot: 'bg-slate-400' },
    };

    const statusItems = [
        { label: 'R2 Worker', value: statusCfg[workerStatus], type: 'status' },
        { label: 'Frontend', value: { label: 'Vercel / CF Pages', color: 'text-emerald-400', dot: 'bg-emerald-400', icon: <CheckCircle size={14} /> }, type: 'status' },
        { label: 'Wersja', value: { label: 'v1.0.5', color: 'text-cyan-400' }, type: 'text' },
        { label: 'Artykuły w bazie', value: { label: '18 static + R2 dynamic', color: 'text-slate-300' }, type: 'text' },
        { label: 'Stack', value: { label: 'React 18 · Vite 6 · Tailwind 3', color: 'text-slate-300' }, type: 'text' },
        { label: 'Hosting', value: { label: 'Vercel + Cloudflare', color: 'text-orange-400' }, type: 'text' },
    ];

    return (
        <div className="min-h-screen pt-24 pb-16 w-full">
            <div className="container mx-auto px-4 max-w-6xl space-y-20">

                {/* ── HERO ─────────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
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
                    {/* Inline architecture illustration */}
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-cyan-500/10 blur-[80px] rounded-full"></div>
                        <div className="relative z-10 w-full rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden p-6">
                            <svg viewBox="0 0 420 260" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                                {/* Grid background */}
                                <defs>
                                    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                                        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
                                    </pattern>
                                    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#06b6d4"/>
                                        <stop offset="100%" stopColor="#3b82f6"/>
                                    </linearGradient>
                                    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#f97316"/>
                                        <stop offset="100%" stopColor="#ea580c"/>
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                                    </filter>
                                    <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                                        <path d="M0,0 L0,6 L6,3 z" fill="#06b6d4"/>
                                    </marker>
                                </defs>
                                <rect width="420" height="260" fill="url(#grid)"/>

                                {/* Isometric layers */}
                                {/* Layer 3 - bottom (storage) */}
                                <polygon points="210,200 80,160 80,180 210,220 340,180 340,160" fill="#0f172a" stroke="#1e40af" strokeWidth="1"/>
                                <polygon points="210,200 340,160 210,120 80,160" fill="#0f1f35" stroke="#1e40af" strokeWidth="1"/>
                                <text x="210" y="165" textAnchor="middle" fill="#3b82f6" fontSize="9" fontFamily="monospace">R2 / D1 Storage</text>

                                {/* Layer 2 - middle (workers) */}
                                <polygon points="210,155 80,115 80,135 210,175 340,135 340,115" fill="#0f172a" stroke="#0891b2" strokeWidth="1"/>
                                <polygon points="210,155 340,115 210,75 80,115" fill="#091929" stroke="#0891b2" strokeWidth="1"/>
                                <text x="210" y="120" textAnchor="middle" fill="#06b6d4" fontSize="9" fontFamily="monospace">Cloudflare Workers</text>

                                {/* Layer 1 - top (edge) */}
                                <polygon points="210,110 80,70 80,90 210,130 340,90 340,70" fill="#0f172a" stroke="#ea580c" strokeWidth="1"/>
                                <polygon points="210,110 340,70 210,30 80,70" fill="#1a0f05" stroke="#ea580c" strokeWidth="1"/>
                                <text x="210" y="75" textAnchor="middle" fill="#f97316" fontSize="9" fontFamily="monospace">Cloudflare Edge / CDN</text>

                                {/* Vertical connectors */}
                                <line x1="210" y1="30" x2="210" y2="15" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3,2"/>
                                <circle cx="210" cy="12" r="3" fill="#06b6d4" filter="url(#glow)"/>
                                <text x="210" y="7" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace">User Request</text>

                                {/* Right side - CF Workers badge */}
                                <rect x="330" y="20" width="80" height="28" rx="6" fill="#1c1a07" stroke="#f97316" strokeWidth="1"/>
                                <text x="370" y="31" textAnchor="middle" fill="#f97316" fontSize="7" fontFamily="monospace" fontWeight="bold">⚙ CF Workers</text>
                                <text x="370" y="41" textAnchor="middle" fill="#78716c" fontSize="6" fontFamily="monospace">for Platforms</text>

                                {/* Left side - MCP badge */}
                                <rect x="10" y="20" width="70" height="28" rx="6" fill="#0a0e1a" stroke="#06b6d4" strokeWidth="1"/>
                                <text x="45" y="31" textAnchor="middle" fill="#06b6d4" fontSize="7" fontFamily="monospace" fontWeight="bold">◈ MCP</text>
                                <text x="45" y="41" textAnchor="middle" fill="#475569" fontSize="6" fontFamily="monospace">Protocol</text>

                                {/* Bottom labels */}
                                <text x="50" y="215" fill="#1e40af" fontSize="7" fontFamily="monospace">jimbo77.org</text>
                                <text x="330" y="215" fill="#1e40af" fontSize="7" fontFamily="monospace">mybonzo.com</text>
                                <text x="175" y="245" fill="#334155" fontSize="7" fontFamily="monospace">Powered by Cloudflare Workers for Platforms</text>

                                {/* Animated dot on top */}
                                <circle cx="210" cy="12" r="5" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.5">
                                    <animate attributeName="r" values="3;8;3" dur="2s" repeatCount="indefinite"/>
                                    <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite"/>
                                </circle>
                            </svg>
                            <div className="flex justify-center gap-4 mt-2 text-[10px] font-mono text-slate-600">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-orange-500/50 inline-block"></span>Edge Layer</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-cyan-500/50 inline-block"></span>Workers Layer</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-500/50 inline-block"></span>Storage Layer</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── SEKCJA 1: LIVE STATUS ─────────────────────────────────── */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-2xl text-white tracking-widest uppercase">
                            <span className="text-cyan-400">01</span> — Live System Status
                        </h2>
                        <button onClick={checkWorker} className="flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-400 transition-colors font-mono">
                            <RefreshCw size={12} /> Odśwież {lastChecked && `· ${lastChecked}`}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {statusItems.map((item, i) => (
                            <Card key={i} className="bg-slate-900/50 border border-white/5 p-4 hover:border-cyan-500/30 transition-all">
                                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-2">{item.label}</p>
                                {item.type === 'status' ? (
                                    <div className={`flex items-center gap-1.5 text-xs font-bold ${item.value.color}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.value.dot} animate-pulse`}></div>
                                        {item.value.label}
                                    </div>
                                ) : (
                                    <p className={`text-xs font-mono ${item.value.color}`}>{item.value.label}</p>
                                )}
                            </Card>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                        {[
                            { icon: <Cpu size={32} />, title: "Neural Processing", desc: "Advanced LLM integration via MCP." },
                            { icon: <Server size={32} />, title: "Edge Network", desc: "Distributed on Cloudflare Workers." },
                            { icon: <Shield size={32} />, title: "Quantized Security", desc: "Zero-Trust Agent Auth." },
                            { icon: <Globe size={32} />, title: "Global Mesh", desc: "Low-latency context synchronization." },
                        ].map((item, idx) => (
                            <Card key={idx} className="bg-slate-900/50 border border-white/5 p-6 hover:border-cyan-500/50 hover:-translate-y-1 transition-all group">
                                <div className="mb-4 text-slate-500 group-hover:text-cyan-400 transition-colors">{item.icon}</div>
                                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm">{item.desc}</p>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* ── SEKCJA 2: ARCHITECTURE DIAGRAM ───────────────────────── */}
                <section>
                    <h2 className="font-display text-2xl text-white tracking-widest uppercase mb-6">
                        <span className="text-cyan-400">02</span> — Architecture Diagram
                    </h2>
                    <Card className="bg-slate-900/50 border border-white/5 overflow-hidden">
                        <div style={{ height: 260 }} className="bg-slate-950/60">
                            <ReactFlow
                                nodes={flowNodes}
                                edges={flowEdges}
                                nodeTypes={nodeTypes}
                                fitView
                                fitViewOptions={{ padding: 0.3 }}
                                nodesDraggable={false}
                                nodesConnectable={false}
                                elementsSelectable={false}
                                panOnDrag={false}
                                zoomOnScroll={false}
                                zoomOnPinch={false}
                                proOptions={{ hideAttribution: true }}
                            >
                                <Background color="#1e293b" gap={24} />
                                <Controls showInteractive={false} className="[&>button]:bg-slate-800 [&>button]:border-slate-700 [&>button]:text-slate-300" />
                            </ReactFlow>
                        </div>
                        <div className="px-6 py-3 border-t border-white/5 flex flex-wrap gap-4 text-[11px] font-mono text-slate-500">
                            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-cyan-400 inline-block"></span> data flow</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-purple-400 inline-block"></span> AI pipeline</span>
                            <span className="text-slate-600">· animowane = live traffic</span>
                        </div>
                    </Card>
                </section>

                {/* ── SEKCJA 3: MCP STACK ───────────────────────────────────── */}
                <section>
                    <h2 className="font-display text-2xl text-white tracking-widest uppercase mb-6">
                        <span className="text-cyan-400">03</span> — MCP Stack &amp; Tools
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {mcpStack.map((tool, i) => (
                            <Card key={i} className="bg-slate-900/50 border border-white/5 p-5 hover:border-cyan-500/30 hover:-translate-y-0.5 transition-all group">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-2 rounded-lg border ${tool.color}`}>{tool.icon}</div>
                                    <Chip size="sm" className={`text-[10px] font-mono border ${tool.color}`} variant="bordered">{tool.tag}</Chip>
                                </div>
                                <h3 className="text-white font-bold text-sm mb-1">{tool.name}</h3>
                                <p className="text-slate-500 text-xs leading-relaxed">{tool.desc}</p>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* ── SEKCJA 4: CHANGELOG ───────────────────────────────────── */}
                <section>
                    <h2 className="font-display text-2xl text-white tracking-widest uppercase mb-6">
                        <span className="text-cyan-400">04</span> — Changelog
                    </h2>
                    <div className="relative">
                        <div className="absolute left-[11px] top-0 bottom-0 w-px bg-white/5"></div>
                        <div className="space-y-6">
                            {changelog.map((entry, i) => (
                                <div key={i} className="flex gap-5">
                                    <div className="relative flex-shrink-0 mt-1">
                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${entry.color}`}>
                                            <GitCommit size={10} />
                                        </div>
                                    </div>
                                    <Card className="flex-1 bg-slate-900/50 border border-white/5 p-5 hover:border-white/10 transition-all">
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className={`font-mono font-bold text-sm ${entry.color.split(' ')[0]}`}>{entry.version}</span>
                                            <span className="text-[11px] text-slate-600 font-mono">{entry.date}</span>
                                            {entry.label && (
                                                <Chip size="sm" className={`text-[10px] font-mono border ${entry.color}`} variant="bordered">{entry.label}</Chip>
                                            )}
                                        </div>
                                        <ul className="space-y-1">
                                            {entry.items.map((item, j) => (
                                                <li key={j} className="text-slate-400 text-xs flex items-start gap-2">
                                                    <span className="text-cyan-500 mt-0.5 flex-shrink-0">›</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Core;
