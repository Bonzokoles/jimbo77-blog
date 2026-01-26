import React from 'react';
import { Card } from "@heroui/react";

const LOGS = [
    { version: "v3.0.1", date: "2026-01-26", status: "STABLE", changes: ["Brand Re-injection: Apple Protocol", "Dark Mode Optimization: Glare Reduction", "Backend Sync Initialization"] },
    { version: "v3.0.0", date: "2026-01-25", status: "RELEASE", changes: ["Core System Launch", "MCP Integration: Active", "Agent Registry: Online"] },
    { version: "v2.9.4", date: "2026-01-24", status: "BETA", changes: ["UI Overhaul: Cyberpunk Aesthetic", "Neural Feed Algorithm Implementation"] },
];

const Logs = () => {
    return (
        <div className="min-h-screen pt-8 pb-12 w-full">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="font-display text-4xl text-white mb-2 tracking-widest">
                        SYSTEM_<span className="text-green-500">LOGS</span>
                    </h1>
                    <p className="font-mono text-green-500/50 text-xs tracking-[0.3em]">
                        CHANGELOG_SEQUENCE_INIT
                    </p>
                </div>

                <div className="space-y-8 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-px before:bg-green-500/20">
                    {LOGS.map((log, idx) => (
                        <div key={idx} className="relative pl-12 group">
                            <div className="absolute left-0 top-0 w-10 h-10 flex items-center justify-center bg-black border border-green-500/30 rounded-full z-10 group-hover:border-green-400 transition-colors shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            </div>

                            <Card className="bg-black/60 backdrop-blur border border-green-500/10 p-6 hover:border-green-500/30 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-green-400 font-mono text-xl">{log.version}</h3>
                                        <span className="text-slate-500 text-xs font-mono">{log.date}</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded bg-green-900/20 text-green-500 border border-green-500/20 text-[10px] font-mono tracking-wider">
                                        {log.status}
                                    </span>
                                </div>
                                <ul className="space-y-2">
                                    {log.changes.map((change, i) => (
                                        <li key={i} className="text-slate-400 font-mono text-sm flex items-start">
                                            <span className="text-green-500/50 mr-2">&gt;</span>
                                            {change}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Logs;
