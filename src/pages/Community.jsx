import React, { useEffect, useState, useCallback } from 'react';
import { Card, Avatar, Chip, Button, Spinner, Divider } from "@heroui/react";
import { MessageSquare, Heart, Eye, ChevronDown, Send, LogIn, UserPlus, ArrowLeft, Clock, Shield, Mail, Lock, User as UserIcon, KeyRound } from 'lucide-react';
import TerminalChat from '../components/TerminalChat';

const API = 'https://jimbo77-community.stolarnia-ams.workers.dev';

// ─── Helpers ────────────────────────────────────────────
const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'teraz';
    if (m < 60) return `${m}m temu`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h temu`;
    const d = Math.floor(h / 24);
    return `${d}d temu`;
};

const apiFetch = async (path, opts = {}) => {
    const token = localStorage.getItem('community_token');
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Security headers required by backend for POST/PUT/DELETE (replay protection)
    const method = (opts.method || 'GET').toUpperCase();
    if (['POST', 'PUT', 'DELETE'].includes(method)) {
        headers['X-Timestamp'] = String(Math.floor(Date.now() / 1000));
        headers['X-Nonce'] = crypto.randomUUID();
    }

    const res = await fetch(`${API}${path}`, { ...opts, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
};

// ─── Styled Input (native, dark-mode safe) ──────────────
const DarkInput = ({ label, icon: Icon, type = 'text', value, onChange, placeholder, required, maxLength, autoFocus, disabled }) => (
    <div className="space-y-1.5">
        <label className="text-[11px] text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
            {Icon && <Icon size={12} />} {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            autoFocus={autoFocus}
            disabled={disabled}
            autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'off'}
            className="w-full px-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 
                       text-white text-sm font-sans placeholder:text-slate-600
                       focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 focus:bg-white/[0.08]
                       outline-none transition-all duration-200 disabled:opacity-50"
        />
    </div>
);

// ─── AUTH FORMS ─────────────────────────────────────────
const AuthPanel = ({ onAuth }) => {
    const [mode, setMode] = useState('login'); // login | register
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [totp, setTotp] = useState('');
    const [needTotp, setNeedTotp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [err, setErr] = useState(null);

    // Map English backend errors to Polish
    const translateError = (msg) => {
        const map = {
            'Missing email or password': 'Podaj e-mail i hasło',
            'Username or Password Error': 'Nieprawidłowy e-mail lub hasło',
            'Please verify your email first': 'Najpierw zweryfikuj swój e-mail (sprawdź skrzynkę)',
            'TOTP_REQUIRED': 'Wymagany kod 2FA',
            'Invalid TOTP code': 'Nieprawidłowy kod 2FA',
            'Missing email, username or password': 'Wypełnij wszystkie pola',
            'Email already exists': 'Ten e-mail jest już zarejestrowany',
            'Username already taken': 'Ta nazwa użytkownika jest zajęta',
            'Username too long (Max 20 chars)': 'Nazwa max 20 znaków',
            'Password must be 8-16 characters': 'Hasło musi mieć 8–16 znaków',
            'Email too long (Max 50 chars)': 'E-mail max 50 znaków',
            'Turnstile verification failed': 'Weryfikacja CAPTCHA nie powiodła się',
        };
        return map[msg] || msg;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr(null); setMsg(null); setLoading(true);
        try {
            if (mode === 'login') {
                const data = await apiFetch('/api/login', {
                    method: 'POST',
                    body: JSON.stringify({ email: email.trim(), password, totp_code: totp || undefined }),
                });
                if (data.token) {
                    localStorage.setItem('community_token', data.token);
                    localStorage.setItem('community_user', JSON.stringify(data.user));
                    onAuth(data.user);
                } else {
                    setErr('Brak tokena w odpowiedzi — skontaktuj się z adminem');
                }
            } else {
                // Walidacja frontend
                if (password.length < 8) { setErr('Hasło musi mieć min. 8 znaków'); setLoading(false); return; }
                if (password.length > 16) { setErr('Hasło max 16 znaków'); setLoading(false); return; }
                if (!username.trim()) { setErr('Podaj nazwę użytkownika'); setLoading(false); return; }

                const data = await apiFetch('/api/register', {
                    method: 'POST',
                    body: JSON.stringify({ email: email.trim(), username: username.trim(), password }),
                });
                setMsg(data.message || 'Rejestracja udana! Sprawdź e-mail.');
                setMode('login');
                setPassword('');
            }
        } catch (error) {
            const msg = error.message;
            if (msg === 'TOTP_REQUIRED') { setNeedTotp(true); setErr('Wpisz kod 2FA z aplikacji'); }
            else setErr(translateError(msg));
        } finally { setLoading(false); }
    };

    return (
        <Card className="bg-black/60 backdrop-blur-xl border border-cyan-500/20 p-6 max-w-md mx-auto">
            <h2 className="font-display text-2xl text-white mb-1 tracking-widest text-center">
                {mode === 'login' ? 'LOGOWANIE' : 'REJESTRACJA'}
            </h2>
            <p className="text-slate-500 text-xs text-center mb-6 font-mono">COMMUNITY_AUTH_PROTOCOL</p>

            {msg && (
                <div className="mb-4 p-3 rounded bg-green-900/20 border border-green-500/30 text-green-400 text-xs font-mono">
                    ✓ {msg}
                </div>
            )}
            {err && (
                <div className="mb-4 p-3 rounded bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-mono">
                    ✗ {err}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <DarkInput
                    label="E-mail"
                    icon={Mail}
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="twoj@email.com"
                    required
                    autoFocus
                />

                {mode === 'register' && (
                    <DarkInput
                        label="Nazwa użytkownika"
                        icon={UserIcon}
                        value={username}
                        onChange={setUsername}
                        placeholder="np. hacker42"
                        required
                        maxLength={20}
                    />
                )}

                <DarkInput
                    label="Hasło"
                    icon={Lock}
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder={mode === 'register' ? '8–16 znaków' : '••••••••'}
                    required
                />

                {needTotp && (
                    <DarkInput
                        label="Kod 2FA (TOTP)"
                        icon={KeyRound}
                        value={totp}
                        onChange={setTotp}
                        placeholder="123456"
                        maxLength={6}
                        autoFocus
                    />
                )}

                <Button type="submit" isLoading={loading}
                    className="w-full bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 font-mono tracking-widest mt-2">
                    {mode === 'login' ? <><LogIn size={14} className="mr-2" /> ZALOGUJ</> : <><UserPlus size={14} className="mr-2" /> ZAREJESTRUJ</>}
                </Button>
            </form>

            <div className="mt-4 text-center">
                <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(null); setMsg(null); setNeedTotp(false); }}
                    className="text-xs text-slate-500 hover:text-cyan-400 transition-colors font-mono">
                    {mode === 'login' ? 'Nie masz konta? → ZAREJESTRUJ' : 'Masz konto? → ZALOGUJ'}
                </button>
            </div>
        </Card>
    );
};

// ─── POST DETAIL VIEW ───────────────────────────────────
const PostDetail = ({ postId, user, onBack }) => {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchPost = useCallback(async () => {
        try {
            const [p, c] = await Promise.all([
                apiFetch(`/api/posts/${postId}${user ? `?user_id=${user.id}` : ''}`),
                apiFetch(`/api/posts/${postId}/comments`),
            ]);
            setPost(p);
            setComments(c);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [postId, user]);

    useEffect(() => { fetchPost(); }, [fetchPost]);

    const handleLike = async () => {
        if (!user) return;
        try {
            const res = await apiFetch(`/api/posts/${postId}/like`, { method: 'POST', body: '{}' });
            setPost(prev => ({
                ...prev,
                liked: res.liked,
                like_count: prev.like_count + (res.liked ? 1 : -1)
            }));
        } catch (e) { console.error(e); }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;
        setSubmitting(true);
        try {
            const c = await apiFetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                body: JSON.stringify({ content: newComment }),
            });
            setComments(prev => [...prev, c]);
            setNewComment('');
            setPost(prev => ({ ...prev, comment_count: (prev.comment_count || 0) + 1 }));
        } catch (e) { console.error(e); }
        finally { setSubmitting(false); }
    };

    if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" color="success" /></div>;
    if (!post) return <p className="text-center text-red-400">Post nie znaleziony.</p>;

    return (
        <div className="space-y-6">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors text-sm font-mono">
                <ArrowLeft size={14}/> POWRÓT DO LISTY
            </button>

            <Card className="bg-black/40 backdrop-blur-xl border border-white/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Avatar name={post.author_name} src={post.author_avatar} className="w-10 h-10 bg-slate-900 border border-slate-800 text-slate-400" />
                    <div>
                        <span className="text-white font-medium">{post.author_name}</span>
                        {post.author_role === 'admin' && <Chip size="sm" className="ml-2 bg-red-900/20 text-red-400 border border-red-900/30 text-[10px]">ADMIN</Chip>}
                        <span className="block text-[10px] text-slate-600 font-mono"><Clock size={10} className="inline mr-1" />{timeAgo(post.created_at)}</span>
                    </div>
                </div>

                {post.category_name && <Chip size="sm" variant="flat" className="mb-3 bg-cyan-900/10 text-cyan-600 border border-cyan-900/20 font-mono text-[10px]">{post.category_name}</Chip>}

                <h2 className="text-2xl font-bold text-white mb-4">{post.title}</h2>
                <div className="text-slate-300 leading-relaxed whitespace-pre-wrap mb-6">{post.content}</div>

                <div className="flex items-center gap-6 text-sm text-slate-500 border-t border-white/5 pt-4">
                    <button onClick={handleLike} className={`flex items-center gap-1.5 transition-colors ${post.liked ? 'text-red-400' : 'hover:text-red-400'}`}>
                        <Heart size={16} fill={post.liked ? 'currentColor' : 'none'} /> {post.like_count || 0}
                    </button>
                    <span className="flex items-center gap-1.5"><MessageSquare size={16} /> {post.comment_count || 0}</span>
                    <span className="flex items-center gap-1.5"><Eye size={16} /> {post.view_count || 0}</span>
                </div>
            </Card>

            {/* Comments — Terminal Style */}
            <TerminalChat
                postId={postId}
                title={`KOMENTARZE // POST_${postId}`}
                maxMessages={50}
                className="min-h-[300px] max-h-[500px] relative"
            />
        </div>
    );
};

// ─── MAIN COMMUNITY PAGE ────────────────────────────────
const Community = () => {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('community_user')); } catch { return null; }
    });
    const [posts, setPosts] = useState([]);
    const [total, setTotal] = useState(0);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activePost, setActivePost] = useState(null);

    // New post form
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [postCategoryId, setPostCategoryId] = useState('');
    const [creating, setCreating] = useState(false);
    const [formErr, setFormErr] = useState(null);

    const LIMIT = 15;

    const fetchPosts = useCallback(async (off = 0, catId = null) => {
        setLoading(true);
        try {
            let q = `/api/posts?limit=${LIMIT}&offset=${off}`;
            if (catId) q += `&category_id=${catId}`;
            const data = await apiFetch(q);
            setPosts(data.posts || []);
            setTotal(data.total || 0);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await apiFetch('/api/categories');
            setCategories(data || []);
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);
    useEffect(() => { fetchPosts(offset, selectedCategory); }, [offset, selectedCategory, fetchPosts]);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        setCreating(true); setFormErr(null);
        try {
            await apiFetch('/api/posts', {
                method: 'POST',
                body: JSON.stringify({ title, content, category_id: postCategoryId || undefined }),
            });
            setTitle(''); setContent(''); setPostCategoryId(''); setShowForm(false);
            fetchPosts(0, selectedCategory);
            setOffset(0);
        } catch (e) { setFormErr(e.message); }
        finally { setCreating(false); }
    };

    const handleLogout = () => {
        localStorage.removeItem('community_token');
        localStorage.removeItem('community_user');
        setUser(null);
    };

    // If viewing a single post
    if (activePost) {
        return (
            <div className="min-h-screen pt-28 pb-12 w-full">
                <div className="container mx-auto px-4 max-w-4xl">
                    <PostDetail postId={activePost} user={user} onBack={() => setActivePost(null)} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-12 w-full">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* ─── Header ─── */}
                <div className="text-center mb-10">
                    <h1 className="font-display text-5xl md:text-6xl text-white mb-3 tracking-widest">
                        COMMUNITY<span className="text-cyan-500">_HUB</span>
                    </h1>
                    <p className="text-slate-500 max-w-xl mx-auto text-sm font-light">
                        Forum społeczności Jimbo77 — dyskusje, pytania, projekty.
                    </p>
                    <span className="block text-[10px] text-green-500/50 mt-2 font-mono">
                        CONNECTED_TO: {API.replace('https://', '')}
                    </span>
                </div>

                {/* ─── Auth Bar ─── */}
                {!user ? (
                    <AuthPanel onAuth={setUser} />
                ) : (
                    <>
                        {/* Logged-in bar */}
                        <Card className="bg-black/30 border border-white/5 p-3 mb-6 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar name={user.username} src={user.avatar_url} className="w-8 h-8 bg-slate-900 text-slate-400 text-sm" />
                                <span className="text-white text-sm">{user.username}</span>
                                {user.role === 'admin' && <Chip size="sm" className="bg-red-900/20 text-red-400 border border-red-900/30 text-[10px]">ADMIN</Chip>}
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" onPress={() => setShowForm(!showForm)}
                                    className="bg-cyan-600/15 hover:bg-cyan-600/25 text-cyan-400 border border-cyan-500/20 font-mono text-[10px] tracking-wider">
                                    + NOWY POST
                                </Button>
                                <Button size="sm" onPress={handleLogout}
                                    className="bg-white/5 hover:bg-white/10 text-slate-500 border border-white/10 font-mono text-[10px] tracking-wider">
                                    WYLOGUJ
                                </Button>
                            </div>
                        </Card>

                        {/* ─── New Post Form ─── */}
                        {showForm && (
                            <Card className="bg-black/40 border border-cyan-500/20 p-5 mb-6">
                                <h3 className="font-display text-lg text-cyan-500 mb-4 tracking-widest">NOWY_POST</h3>
                                {formErr && <div className="mb-3 p-2 rounded bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-mono">✗ {formErr}</div>}
                                <form onSubmit={handleCreatePost} className="space-y-3">
                                    <DarkInput
                                        label="Tytuł (max 30 znaków)"
                                        icon={MessageSquare}
                                        value={title}
                                        onChange={setTitle}
                                        placeholder="O czym chcesz napisać?"
                                        required
                                        maxLength={30}
                                    />
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                                            <Send size={12} /> Treść (max 3000 znaków)
                                        </label>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Napisz treść posta..."
                                            required
                                            maxLength={3000}
                                            rows={4}
                                            className="w-full px-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 
                                                       text-white text-sm font-sans placeholder:text-slate-600
                                                       focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 focus:bg-white/[0.08]
                                                       outline-none transition-all duration-200 resize-y min-h-[100px]"
                                        />
                                    </div>
                                    {categories.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            <button type="button" onClick={() => setPostCategoryId('')}
                                                className={`text-xs px-3 py-1 rounded border font-mono ${!postCategoryId ? 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                                                Brak kategorii
                                            </button>
                                            {categories.map(cat => (
                                                <button key={cat.id} type="button" onClick={() => setPostCategoryId(cat.id)}
                                                    className={`text-xs px-3 py-1 rounded border font-mono ${postCategoryId === cat.id ? 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <Button type="submit" isLoading={creating}
                                        className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 font-mono text-xs tracking-widest">
                                        <Send size={14} className="mr-2" /> OPUBLIKUJ
                                    </Button>
                                </form>
                            </Card>
                        )}

                        {/* ─── Category Filter ─── */}
                        {categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                <button onClick={() => { setSelectedCategory(null); setOffset(0); }}
                                    className={`text-xs px-3 py-1.5 rounded border font-mono transition-colors ${!selectedCategory ? 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30' : 'bg-white/5 text-slate-500 border-white/10 hover:border-cyan-500/20'}`}>
                                    Wszystkie
                                </button>
                                {categories.map(cat => (
                                    <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setOffset(0); }}
                                        className={`text-xs px-3 py-1.5 rounded border font-mono transition-colors ${selectedCategory === cat.id ? 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30' : 'bg-white/5 text-slate-500 border-white/10 hover:border-cyan-500/20'}`}>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* ─── Posts List ─── */}
                        {loading ? (
                            <div className="flex justify-center py-20"><Spinner size="lg" color="success" /></div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-slate-600 font-mono text-sm">BRAK POSTÓW — BĄDŹ PIERWSZY!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {posts.map(post => (
                                    <Card key={post.id} isPressable onPress={() => setActivePost(post.id)}
                                        className="bg-black/30 backdrop-blur-xl border border-white/5 p-4 hover:border-cyan-500/20 transition-all">
                                        <div className="flex items-start gap-3">
                                            <Avatar name={post.author_name} src={post.author_avatar} className="w-9 h-9 bg-slate-900 text-slate-400 text-xs shrink-0" />
                                            <div className="flex-grow min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="text-sm text-slate-300 font-medium">{post.author_name}</span>
                                                    {post.author_role === 'admin' && <Shield size={12} className="text-red-400" />}
                                                    {post.is_pinned === 1 && <Chip size="sm" className="bg-yellow-900/20 text-yellow-500 border border-yellow-900/30 text-[10px]">PINNED</Chip>}
                                                    {post.category_name && <Chip size="sm" variant="flat" className="bg-white/5 text-slate-500 border border-white/5 text-[10px] font-mono">{post.category_name}</Chip>}
                                                    <span className="text-[10px] text-slate-600 font-mono ml-auto"><Clock size={10} className="inline mr-0.5" />{timeAgo(post.created_at)}</span>
                                                </div>
                                                <h3 className="text-white font-medium truncate">{post.title}</h3>
                                                <p className="text-slate-500 text-xs mt-1 line-clamp-2">{post.content}</p>
                                                <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-600">
                                                    <span className="flex items-center gap-1"><Heart size={12} /> {post.like_count || 0}</span>
                                                    <span className="flex items-center gap-1"><MessageSquare size={12} /> {post.comment_count || 0}</span>
                                                    <span className="flex items-center gap-1"><Eye size={12} /> {post.view_count || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {total > LIMIT && (
                            <div className="flex justify-center gap-3 mt-8">
                                <Button size="sm" isDisabled={offset === 0} onPress={() => setOffset(Math.max(0, offset - LIMIT))}
                                    className="bg-white/5 text-slate-400 border border-white/10 font-mono text-xs">← PREV</Button>
                                <span className="text-xs text-slate-600 font-mono self-center">
                                    {offset + 1}–{Math.min(offset + LIMIT, total)} z {total}
                                </span>
                                <Button size="sm" isDisabled={offset + LIMIT >= total} onPress={() => setOffset(offset + LIMIT)}
                                    className="bg-white/5 text-slate-400 border border-white/10 font-mono text-xs">NEXT →</Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Community;
