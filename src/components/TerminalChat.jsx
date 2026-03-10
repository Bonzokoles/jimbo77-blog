import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Terminal, ChevronRight, User, Shield, Loader } from 'lucide-react';

const COMMUNITY_API = 'https://jimbo77-community.stolarnia-ams.workers.dev';

/**
 * TerminalChat — cyberpunk terminal-style chat/comment widget
 * 
 * Modes:
 *  - "shoutbox"  → community-wide quick messages (default)
 *  - "comments"  → post-specific comments (pass postId)
 * 
 * Props:
 *  - postId: (optional) if set, operates as comment terminal for that post
 *  - maxMessages: max messages to display (default 30)
 *  - title: terminal header text
 *  - className: additional CSS classes
 */
const TerminalChat = ({ postId = null, maxMessages = 30, title = 'COMMUNITY_TERMINAL', className = '' }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    // Check auth
    useEffect(() => {
        try {
            const stored = localStorage.getItem('community_user');
            if (stored) setUser(JSON.parse(stored));
        } catch { }
    }, []);

    const getToken = () => localStorage.getItem('community_token');

    const fetchMessages = useCallback(async () => {
        try {
            let url;
            if (postId) {
                url = `${COMMUNITY_API}/api/posts/${postId}/comments`;
            } else {
                // Shoutbox: fetch latest posts as "messages"
                url = `${COMMUNITY_API}/api/posts?limit=${maxMessages}&offset=0`;
            }
            const res = await fetch(url);
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();

            // Normalize to message format
            if (postId) {
                // Comments
                setMessages((data || []).map(c => ({
                    id: c.id,
                    user: c.username || 'Anon',
                    role: c.role || 'user',
                    text: c.content,
                    time: c.created_at,
                })));
            } else {
                // Posts as shoutbox
                const posts = data.posts || data || [];
                setMessages(posts.map(p => ({
                    id: p.id,
                    user: p.author_name || 'Anon',
                    role: p.author_role || 'user',
                    text: p.title,
                    time: p.created_at,
                })).reverse());
            }
        } catch (e) {
            console.warn('TerminalChat fetch error:', e.message);
        } finally {
            setLoading(false);
        }
    }, [postId, maxMessages]);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, [fetchMessages]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !user || sending) return;

        const token = getToken();
        if (!token) { setError('Sesja wygasła — zaloguj się ponownie'); return; }

        setSending(true);
        setError(null);

        try {
            let url, body;
            if (postId) {
                // Comment on post
                url = `${COMMUNITY_API}/api/posts/${postId}/comments`;
                body = { content: input.trim() };
            } else {
                // Quick shoutbox post
                url = `${COMMUNITY_API}/api/posts`;
                body = { title: input.trim().slice(0, 30), content: input.trim() };
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Send failed');

            // Add to local messages immediately
            setMessages(prev => [...prev, {
                id: data.id || Date.now(),
                user: user.username || 'Ty',
                role: user.role || 'user',
                text: postId ? input.trim() : input.trim().slice(0, 30),
                time: new Date().toISOString(),
            }]);
            setInput('');
            inputRef.current?.focus();
        } catch (e) {
            setError(e.message);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (iso) => {
        if (!iso) return '';
        const d = new Date(iso);
        return d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`bg-black/80 border border-green-500/30 rounded-lg overflow-hidden flex flex-col ${className}`}>
            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.03)_50%)] bg-[length:100%_4px] pointer-events-none z-10 rounded-lg"></div>

            {/* Header */}
            <div className="p-2 bg-green-900/20 border-b border-green-500/30 flex items-center justify-between shrink-0 relative z-20">
                <div className="flex items-center gap-2">
                    <Terminal size={12} className="text-green-500" />
                    <span className="text-[10px] text-green-500 font-mono tracking-wider">{title}</span>
                </div>
                <div className="flex items-center gap-2">
                    {user && (
                        <span className="text-[9px] text-green-600 font-mono">
                            {user.username}
                        </span>
                    )}
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                </div>
            </div>

            {/* Messages area */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-3 space-y-1.5 font-mono text-xs min-h-[200px] max-h-[400px] relative z-20 scrollbar-hide">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader size={16} className="text-green-500 animate-spin" />
                        <span className="ml-2 text-green-600 text-[10px]">CONNECTING...</span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-green-700 text-[10px] text-center py-8">
                        <p>[NO_DATA]</p>
                        <p className="mt-1">Brak wiadomości — napisz pierwszą!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="group hover:bg-green-500/5 rounded px-1 py-0.5 transition-colors">
                            <div className="flex items-start gap-1.5">
                                <ChevronRight size={10} className="text-green-700 mt-0.5 shrink-0" />
                                <span className="text-green-600 text-[10px] shrink-0">[{formatTime(msg.time)}]</span>
                                <span className={`shrink-0 font-bold ${msg.role === 'admin' ? 'text-red-400' : 'text-cyan-500'}`}>
                                    {msg.role === 'admin' && <Shield size={9} className="inline mr-0.5 -mt-0.5" />}
                                    {msg.user}:
                                </span>
                                <span className="text-green-400/90 break-words">{msg.text}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input */}
            <div className="border-t border-green-500/30 relative z-20">
                {error && (
                    <div className="px-3 py-1 bg-red-900/20 text-red-400 text-[10px] font-mono">
                        [ERROR] {error}
                    </div>
                )}

                {user ? (
                    <form onSubmit={handleSend} className="flex items-center gap-2 p-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Wpisz wiadomość..."
                            maxLength={postId ? 1000 : 30}
                            className="flex-grow bg-transparent text-green-400 font-mono text-xs placeholder:text-green-800 outline-none caret-green-500"
                            disabled={sending}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || sending}
                            className="text-green-500 hover:text-green-300 disabled:text-green-900 transition-colors shrink-0"
                        >
                            {sending ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                        </button>
                    </form>
                ) : (
                    <div className="p-2 text-center">
                        <a href="/community" className="text-[10px] text-green-700 hover:text-green-400 font-mono transition-colors">
                            <User size={10} className="inline mr-1" />
                            ZALOGUJ SIĘ, ABY PISAĆ →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TerminalChat;
