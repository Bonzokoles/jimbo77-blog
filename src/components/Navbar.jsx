import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin, Mail, Terminal, Activity, Cpu } from 'lucide-react';
import { personalInfo } from '../data';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'SYSTEM', path: '/', icon: <Terminal size={14} /> },
        { name: 'LOGS', path: '/logs', icon: <Activity size={14} /> },
        { name: 'CORE', path: '/core', icon: <Cpu size={14} /> },
        { name: 'COMMUNITY', path: '/community', icon: <Activity size={14} /> },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled
            ? 'bg-slate-950/80 backdrop-blur-md border-cyan-500/30'
            : 'bg-transparent border-transparent'
            }`}>
            {/* Top decorative line */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo Area */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative flex items-center justify-center w-10 h-10 group-hover:scale-110 transition-transform duration-300">
                            <img
                                src="/apple-touch-icon.png"
                                alt="Jimbo Logo"
                                className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-white tracking-wider font-logo leading-none group-hover:text-cyan-400 transition-colors">
                                JIMBO77
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] group-hover:text-cyan-300">
                                AISocialClub
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation - Super Menu Style */}
                    <div className="hidden md:flex items-center gap-1">
                        <div className="flex items-center bg-slate-900/50 border border-slate-800 rounded p-1 backdrop-blur-sm">
                            {navLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    to={link.path}
                                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/30 rounded transition-all uppercase tracking-widest"
                                >
                                    {link.icon}
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="w-px h-8 bg-slate-800 mx-4" />

                        <div className="flex items-center gap-3">
                            {[
                                { icon: <Github size={18} />, href: personalInfo.github },
                                { icon: <Linkedin size={18} />, href: personalInfo.linkedin }
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/30 border border-transparent hover:border-cyan-500/30 rounded transition-all"
                                >
                                    {social.icon}
                                </a>
                            ))}

                            <a
                                href={`mailto:${personalInfo.email}`}
                                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded text-xs font-bold uppercase tracking-widest border border-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all"
                            >
                                <Mail size={14} />
                                <span>Connect</span>
                            </a>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-cyan-400 p-2 border border-cyan-500/30 bg-cyan-950/30 rounded hover:bg-cyan-900/50 transition-colors"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-cyan-500/30 overflow-hidden"
                    >
                        <div className="px-6 py-6 space-y-4">
                            {navLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    to={link.path}
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-300 hover:text-cyan-400 hover:bg-cyan-950/30 border border-transparent hover:border-cyan-500/30 rounded transition-all uppercase tracking-widest"
                                >
                                    {link.icon}
                                    {link.name}
                                </Link>
                            ))}
                            <div className="flex gap-4 pt-4 border-t border-slate-800">
                                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400">
                                    <Github size={20} />
                                </a>
                                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400">
                                    <Linkedin size={20} />
                                </a>
                                <a href={`mailto:${personalInfo.email}`} className="text-slate-400 hover:text-cyan-400">
                                    <Mail size={20} />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
