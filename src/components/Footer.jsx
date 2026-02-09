
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Heart, ArrowUp } from 'lucide-react';
import { personalInfo } from '../data';

const Footer = () => {
    return (
        <footer className="relative border-t border-white/5 bg-slate-950/40 backdrop-blur-md pt-8 pb-4 overflow-hidden">
            {/* Grid Pattern & Gradient */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-[1920px] mx-auto px-6 relative z-10 flex flex-col xl:flex-row items-center justify-between gap-6">

                {/* 1. BRAND & SOCIALS (Start) */}
                <div className="flex items-center gap-6 shrink-0">
                    <Link to="/" className="group tracking-tight flex items-center gap-2">
                        <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-display tracking-widest">
                            JIMBO77
                        </span>
                        <span className="text-[10px] text-slate-600 font-mono hidden sm:block">| AISocialClub</span>
                    </Link>

                    <div className="h-4 w-px bg-white/10 hidden sm:block"></div>

                    <div className="flex space-x-2">
                        <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-900/50 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all border border-slate-800 hover:border-cyan-500/30">
                            <Github size={14} />
                        </a>
                        <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-900/50 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all border border-slate-800 hover:border-cyan-500/30">
                            <Linkedin size={14} />
                        </a>
                        <a href={`mailto:${personalInfo.email} `} className="p-1.5 bg-slate-900/50 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all border border-slate-800 hover:border-cyan-500/30">
                            <Mail size={14} />
                        </a>
                    </div>
                </div>

                {/* 2. NEWSLETTER BAR (Center/Fill) */}
                <div className="flex-1 w-full xl:w-auto border-y xl:border-y-0 xl:border-x border-white/5 py-4 xl:py-0 xl:px-8 bg-black/20 xl:bg-transparent rounded-lg xl:rounded-none">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <div className="text-center md:text-right shrink-0">
                            <span className="text-xs font-bold text-white uppercase tracking-wider mr-2 block md:inline">Bądź na Bieżąco:</span>
                            <span className="text-xs text-slate-500">Newsy o AI & DevOps w jednej linii.</span>
                        </div>
                        <form className="flex gap-2 w-full md:w-auto max-w-md" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Twój email..."
                                className="w-full md:w-64 bg-slate-900/80 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                            <button
                                type="submit"
                                className="px-4 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 border border-cyan-500/30 text-xs font-bold rounded uppercase tracking-wider transition-all"
                            >
                                Zapisz
                            </button>
                        </form>
                    </div>
                </div>

                {/* 3. TECH STACK & SYSTEM (End) */}
                <div className="flex flex-col md:flex-row items-center gap-4 shrink-0 text-xs text-slate-500">
                    <Link to="/tools" className="text-cyan-500 hover:text-cyan-400 transition-colors font-mono text-[10px] uppercase tracking-wider">
                        🛠 Dev Tools
                    </Link>
                    <div className="hidden md:block w-1 h-1 bg-slate-700 rounded-full"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-cyan-600 font-mono">&lt;Stack /&gt;</span>
                        <div className="flex gap-1">
                            {['React', 'Tailwind', 'Vite'].map(tech => (
                                <span key={tech} className="px-1.5 py-0.5 bg-slate-900 rounded text-[10px] border border-slate-800 text-slate-400">{tech}</span>
                            ))}
                        </div>
                    </div>
                    <div className="hidden md:block w-1 h-1 bg-slate-700 rounded-full"></div>
                    <div className="flex items-center gap-1">
                        <span>v1.0.4</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_lime]"></div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
