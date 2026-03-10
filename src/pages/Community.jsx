import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Card, Avatar, Chip, Button, Spinner, Divider } from "@heroui/react";
import { MessageSquare, Heart, Eye, Send, LogIn, UserPlus, ArrowLeft, Clock, Shield, Mail, Lock,
    User as UserIcon, KeyRound, Image as ImageIcon, X, Search, SortAsc, SortDesc, Edit3, Trash2,
    Settings, Award, Check, Pin, Globe, MapPin, Github, Twitter, Linkedin, Plus, GripVertical,
    BarChart3, FileText, ChevronDown, ChevronUp, ExternalLink, Megaphone, Briefcase, HeartHandshake,
    Newspaper, BookOpen, Video, Lightbulb, ScrollText, Tag, Zap, Rocket, MonitorPlay, Compass, Cloud,
    Sparkles, Flame, Link2, Radio } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TerminalChat from '../components/TerminalChat';

const API = 'https://jimbo77-community.stolarnia-ams.workers.dev';

// ─── Helpers ────────────────────────────────────────────
const IMG_RE = /!\[[^\]]*\]\(([^)]+)\)/g;
const extractFirstImage = (text) => { const m = IMG_RE.exec(text); IMG_RE.lastIndex = 0; return m ? m[1] : null; };
const stripImages = (text) => text.replace(IMG_RE, '').trim();

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

const generateUUID = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16));
};

const apiFetch = async (path, opts = {}) => {
    const token = localStorage.getItem('community_token');
    const headers = { ...(opts.headers || {}) };
    if (!(opts.body instanceof FormData)) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const method = (opts.method || 'GET').toUpperCase();
    if (['POST', 'PUT', 'DELETE'].includes(method)) {
        headers['X-Timestamp'] = String(Math.floor(Date.now() / 1000));
        headers['X-Nonce'] = generateUUID();
    }
    let res;
    try {
        res = await fetch(`${API}${path}`, { ...opts, headers, mode: 'cors' });
    } catch (networkErr) {
        console.error('[apiFetch] Network error:', networkErr);
        throw new Error(`Błąd sieci: ${networkErr.message || 'Failed to fetch'} — sprawdź konsolę (F12)`);
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Błąd serwera (HTTP ${res.status})`);
    return data;
};

const apiUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiFetch('/api/upload', { method: 'POST', body: formData });
};

// ─── Styled Input ───────────────────────────────────────
const DarkInput = ({ label, icon: Icon, type = 'text', value, onChange, placeholder, required, maxLength, autoFocus, disabled }) => (
    <div className="space-y-1.5">
        <label className="text-[11px] text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
            {Icon && <Icon size={12} />} {label}
        </label>
        <input
            type={type} value={value} onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder} required={required} maxLength={maxLength}
            autoFocus={autoFocus} disabled={disabled}
            autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'off'}
            className="w-full px-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 
                       text-white text-sm font-sans placeholder:text-slate-600
                       focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 focus:bg-white/[0.08]
                       outline-none transition-all duration-200 disabled:opacity-50"
        />
    </div>
);

// ─── Markdown Renderer ──────────────────────────────────
const MarkdownContent = ({ children }) => (
    <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
            img: ({ src, alt }) => (
                <img src={src} alt={alt || ''} loading="lazy"
                    className="rounded-lg max-w-full max-h-96 my-2 border border-white/10" />
            ),
            a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{children}</a>
            ),
            code: ({ inline, children }) => inline
                ? <code className="bg-white/10 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                : <pre className="bg-black/40 border border-white/10 rounded-lg p-3 overflow-x-auto my-2"><code className="text-green-400 text-sm font-mono">{children}</code></pre>,
            blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-cyan-500/40 pl-3 my-2 text-slate-400 italic">{children}</blockquote>
            ),
            h1: ({ children }) => <h1 className="text-xl font-bold text-white mt-4 mb-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-lg font-bold text-white mt-3 mb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-md font-bold text-white mt-2 mb-1">{children}</h3>,
            ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
            table: ({ children }) => <div className="overflow-x-auto my-2"><table className="min-w-full text-sm border border-white/10">{children}</table></div>,
            th: ({ children }) => <th className="border border-white/10 px-3 py-1 bg-white/5 text-left font-mono text-cyan-400">{children}</th>,
            td: ({ children }) => <td className="border border-white/10 px-3 py-1">{children}</td>,
        }}
        className="text-slate-300 leading-relaxed prose-invert max-w-none [&>p]:mb-2"
    >
        {children}
    </ReactMarkdown>
);

// ─── Image Upload Button ────────────────────────────────
const ImageUploader = ({ onUpload, disabled }) => {
    const fileRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { alert('Maks. 2MB!'); return; }
        if (!file.type.startsWith('image/')) { alert('Tylko obrazy!'); return; }
        setUploading(true);
        try {
            const data = await apiUpload(file);
            onUpload(data.url || data.publicUrl);
        } catch (e) { alert('Upload error: ' + e.message); }
        finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
    };

    return (
        <>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <button type="button" disabled={disabled || uploading} onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors disabled:opacity-50 font-mono">
                {uploading ? <Spinner size="sm" /> : <ImageIcon size={14} />}
                {uploading ? 'UPLOADING...' : 'DODAJ OBRAZ'}
            </button>
        </>
    );
};

// ─── AUTH PANEL ─────────────────────────────────────────
const AuthPanel = ({ onAuth }) => {
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [totp, setTotp] = useState('');
    const [needTotp, setNeedTotp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [err, setErr] = useState(null);

    const translateError = (msg) => {
        const map = {
            'Missing email or password': 'Podaj e-mail i hasło',
            'Username or Password Error': 'Nieprawidłowy e-mail lub hasło',
            'Please verify your email first': 'Najpierw zweryfikuj swój e-mail',
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
                } else setErr('Brak tokena w odpowiedzi');
            } else {
                if (password.length < 8) { setErr('Hasło musi mieć min. 8 znaków'); setLoading(false); return; }
                if (password.length > 16) { setErr('Hasło max 16 znaków'); setLoading(false); return; }
                if (!username.trim()) { setErr('Podaj nazwę użytkownika'); setLoading(false); return; }
                const data = await apiFetch('/api/register', {
                    method: 'POST',
                    body: JSON.stringify({ email: email.trim(), username: username.trim(), password }),
                });
                setMsg(data.message || 'Rejestracja udana!');
                setMode('login'); setPassword('');
            }
        } catch (error) {
            if (error.message === 'TOTP_REQUIRED') { setNeedTotp(true); setErr('Wpisz kod 2FA z aplikacji'); }
            else setErr(translateError(error.message));
        } finally { setLoading(false); }
    };

    return (
        <Card className="bg-black/60 backdrop-blur-xl border border-cyan-500/20 p-6 max-w-md mx-auto">
            <h2 className="font-display text-2xl text-white mb-1 tracking-widest text-center">
                {mode === 'login' ? 'LOGOWANIE' : 'REJESTRACJA'}
            </h2>
            <p className="text-slate-500 text-xs text-center mb-6 font-mono">COMMUNITY_AUTH_PROTOCOL</p>
            {msg && <div className="mb-4 p-3 rounded bg-green-900/20 border border-green-500/30 text-green-400 text-xs font-mono">✓ {msg}</div>}
            {err && <div className="mb-4 p-3 rounded bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-mono">✗ {err}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <DarkInput label="E-mail" icon={Mail} type="email" value={email} onChange={setEmail} placeholder="twoj@email.com" required autoFocus />
                {mode === 'register' && (
                    <DarkInput label="Nazwa użytkownika" icon={UserIcon} value={username} onChange={setUsername} placeholder="np. hacker42" required maxLength={20} />
                )}
                <DarkInput label="Hasło" icon={Lock} type="password" value={password} onChange={setPassword}
                    placeholder={mode === 'register' ? '8–16 znaków' : '••••••••'} required />
                {needTotp && <DarkInput label="Kod 2FA (TOTP)" icon={KeyRound} value={totp} onChange={setTotp} placeholder="123456" maxLength={6} autoFocus />}
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

// ─── USER PROFILE PANEL (Dashboard Editor) ─────────────
const SECTION_TEMPLATES = [
    { type: 'introduction', title: 'Wprowadzenie', default_content: '# Cześć! 👋\nJestem **[Twoje imię]** — pasjonat technologii.' },
    { type: 'about', title: 'O mnie', default_content: '🚀 **O mnie**\n\nPełnoprawny developer z pasją do...' },
    { type: 'links', title: 'Linki', default_content: '🔗 **Linki**\n\n- [Portfolio](https://)\n- [Blog](https://)' },
    { type: 'skills', title: 'Umiejętności', default_content: '🛠 **Tech Stack**\n\nJavaScript, React, Node.js, Python...' },
    { type: 'projects', title: 'Projekty', default_content: '📂 **Projekty**\n\n- **Projekt 1** — opis\n- **Projekt 2** — opis' },
    { type: 'custom', title: 'Własna sekcja', default_content: '## Moja sekcja\n\nTreść...' },
];

const ProfilePanel = ({ user, onUpdate, onClose }) => {
    const [username, setUsername] = useState(user.username || '');
    const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');
    const [bio, setBio] = useState(user.bio || '');
    const [location, setLocation] = useState(user.location || '');
    const [website, setWebsite] = useState(user.website || '');
    const [githubUrl, setGithubUrl] = useState(user.github_url || '');
    const [twitterUrl, setTwitterUrl] = useState(user.twitter_url || '');
    const [linkedinUrl, setLinkedinUrl] = useState(user.linkedin_url || '');
    const [skills, setSkills] = useState(user.skills || '');
    const [sections, setSections] = useState(() => {
        try { return JSON.parse(user.dashboard_sections || '[]'); } catch { return []; }
    });
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);
    const [err, setErr] = useState(null);
    const [tab, setTab] = useState('profile');
    const [previewDashboard, setPreviewDashboard] = useState(false);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true); setErr(null); setMsg(null);
        try {
            const data = await apiFetch('/api/user/profile', {
                method: 'POST',
                body: JSON.stringify({
                    username: username.trim(), avatar_url: avatarUrl,
                    bio, location, website, github_url: githubUrl,
                    twitter_url: twitterUrl, linkedin_url: linkedinUrl,
                    skills, dashboard_sections: JSON.stringify(sections),
                }),
            });
            const updated = { ...user, ...data.user, dashboard_sections: JSON.stringify(sections) };
            localStorage.setItem('community_user', JSON.stringify(updated));
            onUpdate(updated);
            setMsg('Profil i dashboard zaktualizowane!');
        } catch (e) { setErr(e.message); }
        finally { setSaving(false); }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPw.length < 8 || newPw.length > 16) { setErr('Nowe hasło: 8–16 znaków'); return; }
        setSaving(true); setErr(null); setMsg(null);
        try {
            await apiFetch('/api/user/change-password', {
                method: 'POST',
                body: JSON.stringify({ current_password: currentPw, new_password: newPw }),
            });
            setMsg('Hasło zmienione!'); setCurrentPw(''); setNewPw('');
        } catch (e) { setErr(e.message); }
        finally { setSaving(false); }
    };

    const addSection = (template) => {
        setSections(prev => [...prev, { id: Date.now(), type: template.type, title: template.title, content: template.default_content }]);
    };
    const updateSection = (id, field, value) => setSections(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    const removeSection = (id) => setSections(prev => prev.filter(s => s.id !== id));
    const moveSection = (idx, dir) => {
        setSections(prev => {
            const arr = [...prev];
            const target = idx + dir;
            if (target < 0 || target >= arr.length) return arr;
            [arr[idx], arr[target]] = [arr[target], arr[idx]];
            return arr;
        });
    };

    const tabs = [['profile', 'Profil'], ['dashboard', 'Dashboard'], ['password', 'Hasło'], ['security', 'Info']];

    return (
        <Card className="bg-black/60 backdrop-blur-xl border border-cyan-500/20 p-6 max-w-2xl mx-auto mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-cyan-500 tracking-widest flex items-center gap-2"><Settings size={18} /> PROFIL & DASHBOARD</h2>
                <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
                {tabs.map(([key, label]) => (
                    <button key={key} onClick={() => { setTab(key); setErr(null); setMsg(null); }}
                        className={`text-xs px-3 py-1.5 rounded border font-mono transition-colors ${tab === key ? 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                        {label}
                    </button>
                ))}
            </div>
            {msg && <div className="mb-3 p-2 rounded bg-green-900/20 border border-green-500/30 text-green-400 text-xs font-mono">✓ {msg}</div>}
            {err && <div className="mb-3 p-2 rounded bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-mono">✗ {err}</div>}

            {tab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-3">
                    <div className="flex items-center gap-4 mb-2">
                        <Avatar name={username} src={avatarUrl} className="w-16 h-16 bg-slate-900 border border-slate-700 text-slate-400" />
                        <div className="space-y-1">
                            <p className="text-white text-sm">{user.email}</p>
                            <ImageUploader onUpload={(url) => setAvatarUrl(url)} />
                        </div>
                    </div>
                    <DarkInput label="Nazwa użytkownika" icon={UserIcon} value={username} onChange={setUsername} maxLength={20} required />
                    <DarkInput label="Bio (krótki opis)" icon={FileText} value={bio} onChange={setBio} placeholder="Kilka słów o sobie..." maxLength={500} />
                    <div className="grid grid-cols-2 gap-3">
                        <DarkInput label="Lokalizacja" icon={MapPin} value={location} onChange={setLocation} placeholder="np. Warszawa" maxLength={100} />
                        <DarkInput label="Strona WWW" icon={Globe} value={website} onChange={setWebsite} placeholder="https://..." maxLength={200} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <DarkInput label="GitHub" icon={Github} value={githubUrl} onChange={setGithubUrl} placeholder="github.com/..." maxLength={200} />
                        <DarkInput label="Twitter/X" icon={Twitter} value={twitterUrl} onChange={setTwitterUrl} placeholder="x.com/..." maxLength={200} />
                        <DarkInput label="LinkedIn" icon={Linkedin} value={linkedinUrl} onChange={setLinkedinUrl} placeholder="linkedin.com/in/..." maxLength={200} />
                    </div>
                    <DarkInput label="Umiejętności (oddziel przecinkami)" icon={Award} value={skills} onChange={setSkills} placeholder="React, Python, AI, ..." maxLength={500} />
                    <Button type="submit" isLoading={saving}
                        className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 font-mono text-xs tracking-widest">
                        <Check size={14} className="mr-2" /> ZAPISZ PROFIL
                    </Button>
                </form>
            )}

            {tab === 'dashboard' && (
                <div className="space-y-4">
                    <p className="text-xs text-slate-500 font-mono">Dodaj sekcje Markdown do swojego publicznego dashboard — jak profil na dev.to / GitHub README</p>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-mono">SEKCJE ({sections.length})</span>
                        <div className="flex gap-2">
                            <button onClick={() => setPreviewDashboard(!previewDashboard)}
                                className={`text-xs px-2 py-1 rounded border font-mono transition-colors ${previewDashboard ? 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                                {previewDashboard ? 'EDYTUJ' : 'PODGLĄD'}
                            </button>
                        </div>
                    </div>

                    {previewDashboard ? (
                        <div className="bg-black/40 border border-white/10 rounded-lg p-4 space-y-4">
                            {sections.length === 0 ? <p className="text-slate-600 text-sm font-mono">Brak sekcji — dodaj pierwszą!</p> :
                                sections.map(s => (
                                    <div key={s.id}><MarkdownContent>{s.content}</MarkdownContent></div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sections.map((section, idx) => (
                                <div key={section.id} className="p-3 rounded-lg bg-white/[0.03] border border-white/10 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <GripVertical size={14} className="text-slate-600" />
                                        <input value={section.title} onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                                            className="flex-grow bg-transparent text-white text-sm font-medium outline-none border-b border-transparent focus:border-cyan-500/30" />
                                        <Chip size="sm" className="bg-white/5 text-slate-600 text-[10px] font-mono">{section.type}</Chip>
                                        <button onClick={() => moveSection(idx, -1)} disabled={idx === 0}
                                            className="text-slate-600 hover:text-cyan-400 disabled:opacity-30 transition-colors"><ChevronUp size={14} /></button>
                                        <button onClick={() => moveSection(idx, 1)} disabled={idx === sections.length - 1}
                                            className="text-slate-600 hover:text-cyan-400 disabled:opacity-30 transition-colors"><ChevronDown size={14} /></button>
                                        <button onClick={() => removeSection(section.id)}
                                            className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                    <textarea value={section.content} onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                                        rows={4} className="w-full px-2 py-2 rounded bg-white/[0.04] border border-white/5 text-slate-300 text-xs font-mono
                                                           placeholder:text-slate-600 focus:border-cyan-500/30 outline-none resize-y" />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="border-t border-white/5 pt-3">
                        <p className="text-[10px] text-slate-600 font-mono mb-2">+ DODAJ SEKCJĘ:</p>
                        <div className="flex flex-wrap gap-2">
                            {SECTION_TEMPLATES.map(tpl => (
                                <button key={tpl.type} onClick={() => addSection(tpl)}
                                    className="text-[11px] px-3 py-1.5 rounded border border-white/10 bg-white/5 text-slate-400 hover:border-cyan-500/20 hover:text-cyan-400 font-mono transition-colors flex items-center gap-1">
                                    <Plus size={11} /> {tpl.title}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Button onPress={handleSaveProfile} isLoading={saving}
                        className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 font-mono text-xs tracking-widest mt-2">
                        <Check size={14} className="mr-2" /> ZAPISZ DASHBOARD
                    </Button>
                </div>
            )}

            {tab === 'password' && (
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <DarkInput label="Aktualne hasło" icon={Lock} type="password" value={currentPw} onChange={setCurrentPw} required />
                    <DarkInput label="Nowe hasło (8–16)" icon={KeyRound} type="password" value={newPw} onChange={setNewPw} required />
                    <Button type="submit" isLoading={saving}
                        className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 font-mono text-xs tracking-widest">
                        <Check size={14} className="mr-2" /> ZMIEŃ HASŁO
                    </Button>
                </form>
            )}
            {tab === 'security' && (
                <div className="space-y-3 text-sm text-slate-400">
                    <div className="flex items-center gap-2"><Shield size={16} className="text-cyan-500" />
                        <span>2FA: <span className={user.totp_enabled ? 'text-green-400' : 'text-yellow-500'}>{user.totp_enabled ? 'AKTYWNE' : 'NIEAKTYWNE'}</span></span></div>
                    <div className="flex items-center gap-2"><Award size={16} className="text-cyan-500" />
                        <span>Rola: <span className="text-white font-mono">{user.role?.toUpperCase()}</span></span></div>
                </div>
            )}
        </Card>
    );
};

// ─── PUBLIC USER DASHBOARD ──────────────────────────────
const UserDashboard = ({ username, onBack }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await apiFetch(`/api/users/${encodeURIComponent(username)}/dashboard`);
                setProfile(data);
            } catch (e) { setErr(e.message); }
            finally { setLoading(false); }
        })();
    }, [username]);

    if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" color="success" /></div>;
    if (err || !profile) return (
        <div className="text-center py-20">
            <p className="text-red-400 font-mono text-sm mb-4">{err || 'Profil nie znaleziony'}</p>
            <button onClick={onBack} className="text-cyan-400 text-sm font-mono hover:underline">← POWRÓT</button>
        </div>
    );

    const sections = (() => { try { return JSON.parse(profile.dashboard_sections || '[]'); } catch { return []; } })();
    const skillTags = (profile.skills || '').split(',').map(s => s.trim()).filter(Boolean);
    const links = [
        profile.website && { icon: Globe, label: 'Strona WWW', url: profile.website },
        profile.github_url && { icon: Github, label: 'GitHub', url: profile.github_url },
        profile.twitter_url && { icon: Twitter, label: 'Twitter/X', url: profile.twitter_url },
        profile.linkedin_url && { icon: Linkedin, label: 'LinkedIn', url: profile.linkedin_url },
    ].filter(Boolean);

    return (
        <div className="space-y-6">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors text-sm font-mono">
                <ArrowLeft size={14} /> POWRÓT DO LISTY
            </button>

            {/* Profile Header */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/5 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-cyan-900/30 via-purple-900/20 to-cyan-900/30" />
                <div className="relative flex flex-col md:flex-row items-start md:items-end gap-4 mt-10">
                    <Avatar name={profile.username} src={profile.avatar_url}
                        className="w-24 h-24 bg-slate-900 border-4 border-black text-slate-400 text-2xl ring-2 ring-cyan-500/20 -mt-14" />
                    <div className="flex-grow">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
                            {profile.role === 'admin' && <Chip size="sm" className="bg-red-900/20 text-red-400 border border-red-900/30 text-[10px]">ADMIN</Chip>}
                        </div>
                        {profile.bio && <p className="text-slate-400 text-sm mt-1">{profile.bio}</p>}
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-600 font-mono flex-wrap">
                            {profile.location && <span className="flex items-center gap-1"><MapPin size={12} /> {profile.location}</span>}
                            <span className="flex items-center gap-1"><Clock size={12} /> Dołączył: {new Date(profile.created_at).toLocaleDateString('pl-PL')}</span>
                        </div>
                    </div>
                </div>

                {/* Links */}
                {links.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 ml-1">
                        {links.map((link, i) => (
                            <a key={i} href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-white/5 border border-white/10
                                           text-slate-400 hover:border-cyan-500/30 hover:text-cyan-400 transition-colors">
                                <link.icon size={13} /> {link.label} <ExternalLink size={10} />
                            </a>
                        ))}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/5">
                    {[
                        { label: 'Posty', value: profile.stats?.posts || 0, icon: FileText },
                        { label: 'Komentarze', value: profile.stats?.comments || 0, icon: MessageSquare },
                        { label: 'Polubienia', value: profile.stats?.likes_received || 0, icon: Heart },
                    ].map((stat, i) => (
                        <div key={i} className="text-center p-3 rounded-lg bg-white/[0.03] border border-white/5">
                            <stat.icon size={16} className="mx-auto text-cyan-500/60 mb-1" />
                            <div className="text-xl font-bold text-white font-mono">{stat.value}</div>
                            <div className="text-[10px] text-slate-600 font-mono uppercase">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Skills */}
            {skillTags.length > 0 && (
                <Card className="bg-black/30 border border-white/5 p-4">
                    <h3 className="text-sm text-cyan-500 font-mono tracking-wider mb-3 flex items-center gap-2"><Award size={14} /> UMIEJĘTNOŚCI</h3>
                    <div className="flex flex-wrap gap-2">
                        {skillTags.map((skill, i) => (
                            <Chip key={i} size="sm" className="bg-cyan-900/10 text-cyan-500 border border-cyan-900/20 font-mono text-xs">{skill}</Chip>
                        ))}
                    </div>
                </Card>
            )}

            {/* Markdown Dashboard Sections */}
            {sections.length > 0 && sections.map((section, i) => (
                <Card key={section.id || i} className="bg-black/30 border border-white/5 p-5">
                    <div className="prose-invert max-w-none"><MarkdownContent>{section.content}</MarkdownContent></div>
                </Card>
            ))}

            {/* Recent Posts */}
            {profile.recent_posts?.length > 0 && (
                <Card className="bg-black/30 border border-white/5 p-4">
                    <h3 className="text-sm text-cyan-500 font-mono tracking-wider mb-3 flex items-center gap-2"><FileText size={14} /> OSTATNIE POSTY</h3>
                    <div className="space-y-2">
                        {profile.recent_posts.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5">
                                <div>
                                    <span className="text-sm text-white">{p.title}</span>
                                    <span className="text-[10px] text-slate-600 font-mono ml-2">{timeAgo(p.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-slate-600">
                                    <span className="flex items-center gap-1"><Heart size={11} /> {p.like_count}</span>
                                    <span className="flex items-center gap-1"><MessageSquare size={11} /> {p.comment_count}</span>
                                    <span className="flex items-center gap-1"><Eye size={11} /> {p.view_count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};

// ─── POST DETAIL VIEW ───────────────────────────────────
const PostDetail = ({ postId, user, onBack, onDelete }) => {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editErr, setEditErr] = useState(null);

    const fetchPost = useCallback(async () => {
        try {
            const [p, c] = await Promise.all([
                apiFetch(`/api/posts/${postId}${user ? `?user_id=${user.id}` : ''}`),
                apiFetch(`/api/posts/${postId}/comments`),
            ]);
            setPost(p); setComments(c);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [postId, user]);

    useEffect(() => { fetchPost(); }, [fetchPost]);

    const handleLike = async () => {
        if (!user) return;
        try {
            const res = await apiFetch(`/api/posts/${postId}/like`, { method: 'POST', body: '{}' });
            setPost(prev => ({ ...prev, liked: res.liked, like_count: prev.like_count + (res.liked ? 1 : -1) }));
        } catch (e) { console.error(e); }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;
        setSubmitting(true);
        try {
            const c = await apiFetch(`/api/posts/${postId}/comments`, {
                method: 'POST', body: JSON.stringify({ content: newComment }),
            });
            setComments(prev => [...prev, c]);
            setNewComment('');
            setPost(prev => ({ ...prev, comment_count: (prev.comment_count || 0) + 1 }));
        } catch (e) { console.error(e); }
        finally { setSubmitting(false); }
    };

    const handleDeleteComment = async (commentId) => {
        if (!confirm('Usunąć komentarz?')) return;
        try {
            await apiFetch(`/api/comments/${commentId}`, { method: 'DELETE' });
            setComments(prev => prev.filter(c => c.id !== commentId));
            setPost(prev => ({ ...prev, comment_count: Math.max(0, (prev.comment_count || 0) - 1) }));
        } catch (e) { console.error(e); }
    };

    const handleEdit = () => { setEditTitle(post.title); setEditContent(post.content); setEditing(true); setEditErr(null); };

    const handleSaveEdit = async () => {
        setEditErr(null);
        try {
            await apiFetch(`/api/posts/${postId}`, { method: 'PUT', body: JSON.stringify({ title: editTitle, content: editContent }) });
            setPost(prev => ({ ...prev, title: editTitle, content: editContent }));
            setEditing(false);
        } catch (e) { setEditErr(e.message); }
    };

    const handleDeletePost = async () => {
        if (!confirm('Na pewno usunąć ten post?')) return;
        try { await apiFetch(`/api/posts/${postId}`, { method: 'DELETE' }); onDelete?.(); onBack(); }
        catch (e) { alert('Błąd: ' + e.message); }
    };

    const handleImageUpload = (url) => setEditContent(prev => prev + `\n![obraz](${url})\n`);

    if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" color="success" /></div>;
    if (!post) return <p className="text-center text-red-400">Post nie znaleziony.</p>;
    const isOwner = user && (user.id === post.author_id || user.role === 'admin');

    return (
        <div className="space-y-6">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors text-sm font-mono">
                <ArrowLeft size={14} /> POWRÓT DO LISTY
            </button>
            <Card className="bg-black/40 backdrop-blur-xl border border-white/5 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar name={post.author_name} src={post.author_avatar} className="w-10 h-10 bg-slate-900 border border-slate-800 text-slate-400" />
                        <div>
                            <span className="text-white font-medium">{post.author_name}</span>
                            {post.author_role === 'admin' && <Chip size="sm" className="ml-2 bg-red-900/20 text-red-400 border border-red-900/30 text-[10px]">ADMIN</Chip>}
                            <span className="block text-[10px] text-slate-600 font-mono"><Clock size={10} className="inline mr-1" />{timeAgo(post.created_at)}</span>
                        </div>
                    </div>
                    {isOwner && !editing && (
                        <div className="flex gap-2">
                            <button onClick={handleEdit} className="text-slate-500 hover:text-cyan-400 transition-colors p-1.5 rounded hover:bg-white/5"><Edit3 size={15} /></button>
                            <button onClick={handleDeletePost} className="text-slate-500 hover:text-red-400 transition-colors p-1.5 rounded hover:bg-white/5"><Trash2 size={15} /></button>
                        </div>
                    )}
                </div>
                {post.category_name && <Chip size="sm" variant="flat" className="mb-3 bg-cyan-900/10 text-cyan-600 border border-cyan-900/20 font-mono text-[10px]">{post.category_name}</Chip>}

                {editing ? (
                    <div className="space-y-3">
                        {editErr && <div className="p-2 rounded bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-mono">✗ {editErr}</div>}
                        <DarkInput label="Tytuł" icon={MessageSquare} value={editTitle} onChange={setEditTitle} maxLength={30} required />
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">Treść (Markdown)</label>
                                <ImageUploader onUpload={handleImageUpload} />
                            </div>
                            <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} maxLength={3000} rows={8}
                                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm font-mono
                                           placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20
                                           outline-none transition-all resize-y min-h-[150px]" />
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" onPress={handleSaveEdit}
                                className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 font-mono text-xs">
                                <Check size={14} className="mr-1" /> ZAPISZ
                            </Button>
                            <Button size="sm" onPress={() => setEditing(false)}
                                className="bg-white/5 text-slate-500 border border-white/10 font-mono text-xs">ANULUJ</Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-4">{post.title}</h2>
                        <div className="mb-6"><MarkdownContent>{post.content}</MarkdownContent></div>
                    </>
                )}

                <div className="flex items-center gap-6 text-sm text-slate-500 border-t border-white/5 pt-4">
                    <button onClick={handleLike} className={`flex items-center gap-1.5 transition-colors ${post.liked ? 'text-red-400' : 'hover:text-red-400'}`}>
                        <Heart size={16} fill={post.liked ? 'currentColor' : 'none'} /> {post.like_count || 0}
                    </button>
                    <span className="flex items-center gap-1.5"><MessageSquare size={16} /> {post.comment_count || 0}</span>
                    <span className="flex items-center gap-1.5"><Eye size={16} /> {post.view_count || 0}</span>
                </div>
            </Card>

            {/* Comments */}
            {comments.length > 0 && (
                <Card className="bg-black/30 border border-white/5 p-4">
                    <h3 className="font-mono text-sm text-cyan-500 mb-4 tracking-wider">KOMENTARZE ({comments.length})</h3>
                    <div className="space-y-3">
                        {comments.map(c => (
                            <div key={c.id} className="flex gap-3 p-3 rounded bg-white/[0.02] border border-white/5">
                                <Avatar name={c.author_name} src={c.author_avatar} className="w-7 h-7 bg-slate-900 text-slate-500 text-[10px] shrink-0" />
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-slate-300">{c.author_name}</span>
                                        <span className="text-[10px] text-slate-600 font-mono">{timeAgo(c.created_at)}</span>
                                        {user && (user.id === c.author_id || user.role === 'admin') && (
                                            <button onClick={() => handleDeleteComment(c.id)} className="ml-auto text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                                        )}
                                    </div>
                                    <div className="text-sm text-slate-400"><MarkdownContent>{c.content}</MarkdownContent></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* New comment */}
            {user && (
                <form onSubmit={handleComment} className="flex gap-2">
                    <input value={newComment} onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Napisz komentarz (Markdown)..." maxLength={1000}
                        className="flex-grow px-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm
                                   placeholder:text-slate-600 focus:border-cyan-500/50 outline-none transition-all" />
                    <Button type="submit" isLoading={submitting} size="sm"
                        className="bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 font-mono text-xs shrink-0">
                        <Send size={14} />
                    </Button>
                </form>
            )}
        </div>
    );
};

// ─── SEARCH & SORT BAR ─────────────────────────────────
const SearchBar = ({ query, setQuery, sortBy, setSortBy, sortDir, setSortDir, onSearch }) => (
    <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex-grow relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                placeholder="Szukaj postów..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm
                           placeholder:text-slate-600 focus:border-cyan-500/50 outline-none transition-all font-mono" />
        </div>
        <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); onSearch(); }}
            className="px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-slate-400 text-xs font-mono focus:border-cyan-500/50 outline-none cursor-pointer appearance-none">
            <option value="">Najnowsze</option>
            <option value="likes">❤ Polubienia</option>
            <option value="comments">💬 Komentarze</option>
            <option value="views">👁 Wyświetlenia</option>
        </select>
        {sortBy && (
            <button onClick={() => { setSortDir(d => d === 'desc' ? 'asc' : 'desc'); onSearch(); }}
                className="px-2 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-slate-400 hover:text-cyan-400 transition-colors">
                {sortDir === 'desc' ? <SortDesc size={16} /> : <SortAsc size={16} />}
            </button>
        )}
        <button onClick={onSearch}
            className="px-4 py-2 rounded-lg bg-cyan-600/15 border border-cyan-500/20 text-cyan-400 text-xs font-mono hover:bg-cyan-600/25 transition-colors">
            SZUKAJ
        </button>
    </div>
);

// ─── NEW POST FORM ──────────────────────────────────────
const NewPostForm = ({ categories, onCreated, onClose }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [creating, setCreating] = useState(false);
    const [formErr, setFormErr] = useState(null);
    const [preview, setPreview] = useState(false);

    const handleImageUpload = (url) => setContent(prev => prev + `\n![obraz](${url})\n`);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        setCreating(true); setFormErr(null);
        try {
            await apiFetch('/api/posts', {
                method: 'POST',
                body: JSON.stringify({ title, content, category_id: categoryId || undefined }),
            });
            onCreated();
        } catch (e) { setFormErr(e.message); }
        finally { setCreating(false); }
    };

    return (
        <Card className="bg-black/40 border border-cyan-500/20 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg text-cyan-500 tracking-widest">NOWY_POST</h3>
                <div className="flex gap-2">
                    <button onClick={() => setPreview(!preview)}
                        className={`text-xs px-2 py-1 rounded border font-mono transition-colors ${preview ? 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                        {preview ? 'EDYTUJ' : 'PODGLĄD'}
                    </button>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={16} /></button>
                </div>
            </div>
            {formErr && <div className="mb-3 p-2 rounded bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-mono">✗ {formErr}</div>}
            <form onSubmit={handleSubmit} className="space-y-3">
                <DarkInput label="Tytuł (max 30 znaków)" icon={MessageSquare} value={title} onChange={setTitle}
                    placeholder="O czym chcesz napisać?" required maxLength={30} />
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                            <Send size={12} /> Treść (Markdown, max 3000)
                        </label>
                        <ImageUploader onUpload={handleImageUpload} />
                    </div>
                    {preview ? (
                        <div className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 min-h-[120px]">
                            <MarkdownContent>{content || '*Pusty podgląd...*'}</MarkdownContent>
                        </div>
                    ) : (
                        <textarea value={content} onChange={(e) => setContent(e.target.value)}
                            placeholder={"Napisz treść... **bold** | *italic* | ![obraz](url) | `kod`"}
                            required maxLength={3000} rows={5}
                            className="w-full px-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 
                                       text-white text-sm font-mono placeholder:text-slate-600
                                       focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20
                                       outline-none transition-all resize-y min-h-[120px]" />
                    )}
                    <p className="text-[10px] text-slate-600 font-mono">
                        **bold** | *italic* | [link](url) | ![obraz](url) | `kod` | &gt; cytat
                    </p>
                </div>
                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => setCategoryId('')}
                            className={`text-xs px-3 py-1 rounded border font-mono ${!categoryId ? 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                            Brak kategorii
                        </button>
                        {categories.map(cat => (
                            <button key={cat.id} type="button" onClick={() => setCategoryId(cat.id)}
                                className={`text-xs px-3 py-1 rounded border font-mono ${categoryId === cat.id ? 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30' : 'bg-white/5 text-slate-500 border-white/10'}`}>
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
    );
};

// ─── LIGHTBOX ───────────────────────────────────────────
const Lightbox = ({ src, onClose }) => (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        onClick={onClose}>
        <img src={src} alt="" className="max-w-full max-h-[90vh] rounded-lg border border-white/10 shadow-2xl object-contain" />
        <button className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors" onClick={onClose}>
            <X size={24} />
        </button>
    </div>
);

// ─── POST CARD (list item) ──────────────────────────────
const PostCard = ({ post, onClick, onViewProfile }) => {
    const [lightbox, setLightbox] = useState(null);
    const thumb = extractFirstImage(post.content);
    const cleanText = stripImages(post.content);

    return (
        <>
            {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
            <Card isPressable onPress={onClick}
                className="bg-black/30 backdrop-blur-xl border border-white/5 p-4 hover:border-cyan-500/20 transition-all">
                <div className="flex items-start gap-3">
                    <Avatar name={post.author_name} src={post.author_avatar}
                        className="w-9 h-9 bg-slate-900 text-slate-400 text-xs shrink-0 cursor-pointer hover:ring-2 hover:ring-cyan-500/30 transition-all"
                        onClick={(e) => { e.stopPropagation(); onViewProfile?.(post.author_name); }} />
                    <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <button onClick={(e) => { e.stopPropagation(); onViewProfile?.(post.author_name); }}
                                className="text-sm text-slate-300 font-medium hover:text-cyan-400 transition-colors">{post.author_name}</button>
                            {post.author_role === 'admin' && <Shield size={12} className="text-red-400" />}
                            {post.is_pinned === 1 && <Chip size="sm" className="bg-yellow-900/20 text-yellow-500 border border-yellow-900/30 text-[10px]">📌 PINNED</Chip>}
                            {post.category_name && <Chip size="sm" variant="flat" className="bg-white/5 text-slate-500 border border-white/5 text-[10px] font-mono">{post.category_name}</Chip>}
                            <span className="text-[10px] text-slate-600 font-mono ml-auto"><Clock size={10} className="inline mr-0.5" />{timeAgo(post.created_at)}</span>
                        </div>
                        <h3 className="text-white font-medium truncate">{post.title}</h3>
                        <div className="flex gap-3 mt-1">
                            <div className="flex-grow min-w-0">
                                {cleanText && <p className="text-slate-500 text-xs line-clamp-2">{cleanText}</p>}
                            </div>
                            {thumb && (
                                <div className="shrink-0 relative group" onClick={(e) => { e.stopPropagation(); setLightbox(thumb); }}>
                                    <img src={thumb} alt="" loading="lazy"
                                        className="w-20 h-16 object-cover rounded-lg border border-white/10
                                                   group-hover:border-cyan-500/40 group-hover:scale-105 transition-all duration-200 cursor-zoom-in" />
                                    <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <Eye size={14} className="text-white/0 group-hover:text-white/80 transition-colors" />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-600">
                            <span className="flex items-center gap-1"><Heart size={12} /> {post.like_count || 0}</span>
                            <span className="flex items-center gap-1"><MessageSquare size={12} /> {post.comment_count || 0}</span>
                            <span className="flex items-center gap-1"><Eye size={12} /> {post.view_count || 0}</span>
                        </div>
                    </div>
                </div>
            </Card>
        </>
    );
};

// ─── LEFT SIDEBAR: MARKETPLACE / OGŁOSZENIA ────────────
const MarketplaceSidebar = ({ user, onViewProfile }) => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState('');
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('oferuję');
    const [contact, setContact] = useState('');
    const [creating, setCreating] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [sectionOpen, setSectionOpen] = useState(true);

    const fetchListings = useCallback(async () => {
        try {
            const path = filter ? `/api/listings?type=${encodeURIComponent(filter)}` : '/api/listings';
            const data = await apiFetch(path);
            setListings(data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [filter]);

    useEffect(() => { fetchListings(); }, [fetchListings]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!title.trim() || !desc.trim()) return;
        setCreating(true);
        try {
            await apiFetch('/api/listings', {
                method: 'POST',
                body: JSON.stringify({ title, description: desc, type, contact }),
            });
            setTitle(''); setDesc(''); setContact(''); setShowForm(false);
            fetchListings();
        } catch (e) { alert(e.message); }
        finally { setCreating(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Usunąć ogłoszenie?')) return;
        try { await apiFetch(`/api/listings/${id}`, { method: 'DELETE' }); fetchListings(); }
        catch (e) { alert(e.message); }
    };

    const typeIcon = (t) => t === 'szukam' ? <HeartHandshake size={12} className="text-orange-400" /> : <Briefcase size={12} className="text-green-400" />;
    const typeLabel = (t) => t === 'szukam' ? 'SZUKAM' : 'OFERUJĘ';
    const typeColor = (t) => t === 'szukam' ? 'bg-orange-900/20 text-orange-400 border-orange-900/30' : 'bg-green-900/20 text-green-400 border-green-900/30';

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <button onClick={() => setSectionOpen(!sectionOpen)}
                    className="flex items-center gap-1.5 group">
                    <h3 className="font-mono text-xs text-cyan-500 tracking-widest flex items-center gap-1.5">
                        <Megaphone size={13} /> MARKETPLACE
                    </h3>
                    <ChevronDown size={14} className={`text-slate-600 group-hover:text-cyan-400 transition-all ${sectionOpen ? 'rotate-180' : ''}`} />
                </button>
                {user && (
                    <button onClick={() => setShowForm(!showForm)}
                        className="text-[10px] px-2 py-1 rounded border border-cyan-500/20 text-cyan-400 font-mono hover:bg-cyan-600/10 transition-colors">
                        <Plus size={10} className="inline mr-0.5" /> DODAJ
                    </button>
                )}
            </div>

            {!sectionOpen ? (
                <p className="text-[10px] text-slate-600 font-mono">Kliknij aby rozwiąć...</p>
            ) : (<>

            {/* Filter tabs */}
            <div className="flex gap-1">
                {[['', 'Wszystko'], ['szukam', '🔍 Szukam'], ['oferuję', '💼 Oferuję']].map(([val, label]) => (
                    <button key={val} onClick={() => setFilter(val)}
                        className={`text-[10px] px-2 py-1 rounded border font-mono transition-colors ${filter === val ? 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30' : 'bg-white/5 text-slate-600 border-white/5'}`}>
                        {label}
                    </button>
                ))}
            </div>

            {/* Create form */}
            {showForm && user && (
                <form onSubmit={handleCreate} className="p-3 rounded-lg bg-black/40 border border-cyan-500/20 space-y-2">
                    <div className="flex gap-2">
                        {['oferuję', 'szukam'].map(t => (
                            <button key={t} type="button" onClick={() => setType(t)}
                                className={`text-[10px] px-2 py-1 rounded border font-mono flex items-center gap-1 ${type === t ? typeColor(t) : 'bg-white/5 text-slate-500 border-white/10'}`}>
                                {typeIcon(t)} {typeLabel(t)}
                            </button>
                        ))}
                    </div>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tytuł ogłoszenia..."
                        maxLength={80} required
                        className="w-full px-2 py-1.5 rounded bg-white/[0.06] border border-white/10 text-white text-xs
                                   placeholder:text-slate-600 focus:border-cyan-500/50 outline-none" />
                    <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Opis..."
                        maxLength={500} rows={3} required
                        className="w-full px-2 py-1.5 rounded bg-white/[0.06] border border-white/10 text-white text-xs font-mono
                                   placeholder:text-slate-600 focus:border-cyan-500/50 outline-none resize-none" />
                    <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Kontakt (opcja)"
                        maxLength={100}
                        className="w-full px-2 py-1.5 rounded bg-white/[0.06] border border-white/10 text-white text-xs
                                   placeholder:text-slate-600 focus:border-cyan-500/50 outline-none" />
                    <Button type="submit" size="sm" isLoading={creating}
                        className="w-full bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 font-mono text-[10px]">
                        <Send size={11} className="mr-1" /> OPUBLIKUJ
                    </Button>
                </form>
            )}

            {/* Listings */}
            {loading ? <div className="text-center py-4"><Spinner size="sm" color="success" /></div> : (
                <div className="space-y-2">
                    {listings.length === 0 ? (
                        <p className="text-slate-600 text-[11px] font-mono text-center py-4">Brak ogłoszeń</p>
                    ) : listings.map(l => (
                        <div key={l.id} className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-start justify-between gap-1">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Chip size="sm" className={`${typeColor(l.type)} text-[9px] font-mono border`}>
                                            {typeLabel(l.type)}
                                        </Chip>
                                        <span className="text-[10px] text-slate-600 font-mono">{timeAgo(l.created_at)}</span>
                                    </div>
                                    <h4 className="text-xs text-white font-medium leading-tight">{l.title}</h4>
                                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{l.description}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-[10px] text-slate-600">@{l.author_name}</span>
                                        {l.contact && <span className="text-[10px] text-cyan-600 font-mono">📧 {l.contact}</span>}
                                    </div>
                                </div>
                                {user && (user.id === l.author_id || user.role === 'admin') && (
                                    <button onClick={() => handleDelete(l.id)}
                                        className="text-slate-700 hover:text-red-400 transition-colors shrink-0 p-0.5">
                                        <Trash2 size={11} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ─── QUICK LINKS - NASZE STRONY ─── */}
            <div className="pt-3 border-t border-white/5">
                <h4 className="font-mono text-[10px] text-cyan-500 tracking-widest mb-2 flex items-center gap-1.5">
                    <Radio size={11} className="animate-pulse" /> QUICK LINKS
                </h4>
                <div className="space-y-1">
                    {[
                        { url: 'https://jimbo77.com', label: 'jimbo77.com', icon: <Rocket size={11} className="text-cyan-400" />, color: 'text-cyan-400' },
                        { url: 'https://mybonzo.com', label: 'mybonzo.com', icon: <Flame size={11} className="text-orange-400" />, color: 'text-orange-400' },
                        { url: 'https://zenbrowsers.org', label: 'zenbrowsers.org', icon: <Compass size={11} className="text-emerald-400" />, color: 'text-emerald-400' },
                    ].map(site => (
                        <a key={site.url} href={site.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all group">
                            <span className="group-hover:scale-110 transition-transform">{site.icon}</span>
                            <span className={`text-[10px] font-mono ${site.color} group-hover:brightness-125 transition-all`}>{site.label}</span>
                            <ExternalLink size={8} className="text-slate-700 ml-auto" />
                        </a>
                    ))}
                </div>
            </div>

            {/* ─── ZEN BROWSER MINI WIDGET ─── */}
            <div className="pt-2 border-t border-white/5">
                <div className="relative rounded-lg overflow-hidden border border-emerald-500/15 bg-black/60 group cursor-pointer"
                    onClick={() => window.open('https://zenbrowsers.org', '_blank')}>
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/5 pointer-events-none" />
                    <div className="p-2.5 relative z-10">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Compass size={12} className="text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
                            <span className="text-[10px] font-mono text-emerald-400 tracking-wider">ZEN BROWSER</span>
                        </div>
                        <p className="text-[9px] text-slate-500 leading-relaxed">Przeglądarka nowej generacji. Prywatność, szybkość, minimalny design.</p>
                        <div className="flex items-center gap-1 mt-1.5">
                            <Sparkles size={8} className="text-emerald-500/60" />
                            <span className="text-[8px] font-mono text-emerald-600">SPRAWDŹ →</span>
                        </div>
                    </div>
                </div>
            </div>
            </>)}
        </div>
    );
};

// ─── RIGHT SIDEBAR: GAZETKA / COMMUNITY INFO ───────────
const GazetkaSidebar = ({ user }) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const [showRules, setShowRules] = useState(false);
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    useEffect(() => {
        (async () => {
            try { const data = await apiFetch('/api/community-news'); setNews(data || []); }
            catch (e) { console.error(e); }
            finally { setLoading(false); }
        })();
    }, []);

    const rules = news.find(n => n.type === 'rules');
    const items = news.filter(n => n.type !== 'rules');

    const typeIcon = (t) => {
        const map = { news: <Newspaper size={12} className="text-blue-400" />, video: <Video size={12} className="text-red-400" />, fact: <Lightbulb size={12} className="text-yellow-400" />, update: <Zap size={12} className="text-green-400" /> };
        return map[t] || <ScrollText size={12} className="text-slate-400" />;
    };
    const typeLabel = (t) => ({ news: 'NOWOŚĆ', video: 'VIDEO', fact: 'FAKT', update: 'UPDATE' }[t] || 'INFO');
    const typeBg = (t) => ({ news: 'bg-blue-900/15 border-blue-900/20', video: 'bg-red-900/15 border-red-900/20', fact: 'bg-yellow-900/15 border-yellow-900/20', update: 'bg-green-900/15 border-green-900/20' }[t] || 'bg-white/5 border-white/5');

    return (
        <div className="space-y-3">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className="w-full flex items-center justify-between group">
                <h3 className="font-mono text-xs text-cyan-500 tracking-widest flex items-center gap-1.5">
                    <Newspaper size={13} /> GAZETKA
                </h3>
                <ChevronDown size={14} className={`text-slate-600 group-hover:text-cyan-400 transition-all ${sidebarExpanded ? 'rotate-180' : ''}`} />
            </button>

            {!sidebarExpanded ? (
                <p className="text-[10px] text-slate-600 font-mono">Kliknij aby rozwinąć...</p>
            ) : (<>
            {/* Rules button */}
            {rules && (
                <button onClick={() => setShowRules(!showRules)}
                    className="w-full p-2.5 rounded-lg bg-purple-900/15 border border-purple-500/20 text-left hover:border-purple-500/30 transition-colors group">
                    <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-purple-400 shrink-0" />
                        <span className="text-xs text-purple-300 font-mono tracking-wider">ZASADY COMMUNITY</span>
                        <ChevronDown size={12} className={`text-purple-400 ml-auto transition-transform ${showRules ? 'rotate-180' : ''}`} />
                    </div>
                    {showRules && (
                        <div className="mt-3 pt-2 border-t border-purple-500/10">
                            <MarkdownContent>{rules.content}</MarkdownContent>
                        </div>
                    )}
                </button>
            )}

            {loading ? <div className="text-center py-4"><Spinner size="sm" color="success" /></div> : (
                <div className="space-y-2">
                    {items.length === 0 ? (
                        <p className="text-slate-600 text-[11px] font-mono text-center py-4">Brak aktualności</p>
                    ) : items.map(item => (
                        <div key={item.id}
                            className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${typeBg(item.type)} ${expanded === item.id ? 'border-cyan-500/20' : ''}`}
                            onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
                            <div className="flex items-start gap-2">
                                <div className="mt-0.5 shrink-0">{typeIcon(item.type)}</div>
                                <div className="min-w-0 flex-grow">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <span className="text-[9px] font-mono text-slate-500 uppercase">{typeLabel(item.type)}</span>
                                        <span className="text-[9px] text-slate-700 font-mono">{timeAgo(item.created_at)}</span>
                                    </div>
                                    <h4 className="text-xs text-white font-medium leading-tight">{item.title}</h4>
                                    {expanded === item.id ? (
                                        <div className="mt-2 text-[11px]">
                                            <MarkdownContent>{item.content}</MarkdownContent>
                                            {item.url && (
                                                <a href={item.url} target="_blank" rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 mt-2 text-cyan-400 hover:underline text-[11px] font-mono">
                                                    <ExternalLink size={10} /> Otwórz link
                                                </a>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.content.replace(/[#*\[\]]/g, '').slice(0, 60)}...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ─── ZEN BROWSER MINI FRAME ─── */}
            <div className="pt-2 border-t border-white/5">
                <h4 className="font-mono text-[10px] text-cyan-500 tracking-widest mb-2 flex items-center gap-1.5">
                    <MonitorPlay size={11} /> LIVE PREVIEW
                </h4>
                <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black/60 group">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none z-10" />
                    <iframe
                        src="https://zenbrowsers.org"
                        title="ZenBrowsers.org"
                        className="w-full h-[180px] opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                        loading="lazy"
                        sandbox="allow-scripts allow-same-origin"
                        style={{ filter: 'saturate(0.8) contrast(1.1)' }}
                    />
                    <a href="https://zenbrowsers.org" target="_blank" rel="noopener noreferrer"
                        className="absolute bottom-1 right-1 z-20 text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/20 transition-colors flex items-center gap-1">
                        <ExternalLink size={8} /> OTWÓRZ
                    </a>
                </div>
            </div>

            {/* ─── NASZE STRONY / OUR SITES ─── */}
            <div className="pt-3 border-t border-white/5">
                <h4 className="font-mono text-[10px] text-cyan-500 tracking-widest mb-2 flex items-center gap-1.5">
                    <Link2 size={11} /> NASZE STRONY
                </h4>
                <div className="space-y-1.5">
                    {[
                        { url: 'https://jimbo77.com', name: 'jimbo77.com', desc: 'Centralny Hub AI', icon: <Rocket size={13} className="text-cyan-400" />, gradient: 'from-cyan-500/10 to-blue-500/5', border: 'border-cyan-500/20 hover:border-cyan-400/40' },
                        { url: 'https://mybonzo.com', name: 'mybonzo.com', desc: 'Blog & Portfolio', icon: <Flame size={13} className="text-orange-400" />, gradient: 'from-orange-500/10 to-red-500/5', border: 'border-orange-500/20 hover:border-orange-400/40' },
                        { url: 'https://zenbrowsers.org', name: 'zenbrowsers.org', desc: 'Przeglądarka Zen', icon: <Compass size={13} className="text-emerald-400" />, gradient: 'from-emerald-500/10 to-green-500/5', border: 'border-emerald-500/20 hover:border-emerald-400/40' },
                    ].map(site => (
                        <a key={site.url} href={site.url} target="_blank" rel="noopener noreferrer"
                            className={`block p-2 rounded-lg bg-gradient-to-r ${site.gradient} border ${site.border} transition-all duration-300 group`}>
                            <div className="flex items-center gap-2">
                                <div className="shrink-0 group-hover:scale-110 transition-transform duration-300">{site.icon}</div>
                                <div className="min-w-0">
                                    <p className="text-[11px] text-white font-mono font-medium group-hover:text-cyan-300 transition-colors">{site.name}</p>
                                    <p className="text-[9px] text-slate-500">{site.desc}</p>
                                </div>
                                <ExternalLink size={9} className="text-slate-600 ml-auto shrink-0 group-hover:text-cyan-400 transition-colors" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Community info footer */}
            <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-center gap-2">
                    <Cloud size={11} className="text-orange-400" />
                    <p className="text-[9px] text-slate-600 font-mono">Powered by Cloudflare Workers + D1 + R2</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-slate-700 font-mono">JIMBO77 COMMUNITY © 2026</p>
                </div>
            </div>
            </>)}
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
    const [showForm, setShowForm] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [viewUserDashboard, setViewUserDashboard] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortDir, setSortDir] = useState('desc');

    const LIMIT = 15;

    const fetchPosts = useCallback(async (off = 0, catId = null, q = '', sort = '', dir = 'desc') => {
        setLoading(true);
        try {
            let path = `/api/posts?limit=${LIMIT}&offset=${off}`;
            if (catId) path += `&category_id=${catId}`;
            if (q) path += `&q=${encodeURIComponent(q)}`;
            if (sort) path += `&sort_by=${sort}&sort_dir=${dir}`;
            const data = await apiFetch(path);
            setPosts(data.posts || []); setTotal(data.total || 0);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    const fetchCategories = useCallback(async () => {
        try { const data = await apiFetch('/api/categories'); setCategories(data || []); }
        catch (e) { console.error(e); }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);
    useEffect(() => { fetchPosts(offset, selectedCategory, searchQuery, sortBy, sortDir); }, [offset, selectedCategory, fetchPosts]);

    const handleSearch = () => { setOffset(0); fetchPosts(0, selectedCategory, searchQuery, sortBy, sortDir); };

    const handleLogout = () => {
        localStorage.removeItem('community_token');
        localStorage.removeItem('community_user');
        setUser(null);
    };

    if (viewUserDashboard) {
        return (
            <div className="min-h-screen pt-28 pb-12 w-full">
                <div className="container mx-auto px-4 max-w-4xl">
                    <UserDashboard username={viewUserDashboard} onBack={() => setViewUserDashboard(null)} />
                </div>
            </div>
        );
    }

    if (activePost) {
        return (
            <div className="min-h-screen pt-28 pb-12 w-full">
                <div className="container mx-auto px-4 max-w-4xl">
                    <PostDetail postId={activePost} user={user} onBack={() => setActivePost(null)}
                        onDelete={() => fetchPosts(0, selectedCategory, searchQuery, sortBy, sortDir)} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-12 w-full">
            <div className="container mx-auto px-4 max-w-[1920px]">
                <div className="text-center mb-10">
                    <h1 className="font-display text-5xl md:text-6xl text-white mb-3 tracking-widest">
                        COMMUNITY<span className="text-cyan-500">_HUB</span>
                    </h1>
                    <p className="text-slate-500 max-w-xl mx-auto text-sm font-light">
                        Forum społeczności Jimbo77 — dyskusje, pytania, projekty.
                    </p>
                    <span className="block text-[10px] text-green-500/50 mt-2 font-mono">CONNECTED_TO: {API.replace('https://', '')}</span>
                </div>

                {!user ? <AuthPanel onAuth={setUser} /> : (
                    <>
                        {showProfile && <ProfilePanel user={user} onUpdate={setUser} onClose={() => setShowProfile(false)} />}

                        <Card className="bg-black/30 border border-white/5 p-3 mb-6 flex flex-row flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowProfile(!showProfile)}>
                                <Avatar name={user.username} src={user.avatar_url} className="w-8 h-8 bg-slate-900 text-slate-400 text-sm" />
                                <span className="text-white text-sm hover:text-cyan-400 transition-colors">{user.username}</span>
                                {user.role === 'admin' && <Chip size="sm" className="bg-red-900/20 text-red-400 border border-red-900/30 text-[10px]">ADMIN</Chip>}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button size="sm" onPress={() => setViewUserDashboard(user.username)}
                                    className="bg-purple-600/15 hover:bg-purple-600/25 text-purple-400 border border-purple-500/20 font-mono text-[10px] tracking-wider">
                                    <BarChart3 size={13} className="mr-1" /> DASHBOARD
                                </Button>
                                <Button size="sm" onPress={() => { setShowProfile(!showProfile); setShowForm(false); }}
                                    className="bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10 font-mono text-[10px] tracking-wider">
                                    <Settings size={13} className="mr-1" /> PROFIL
                                </Button>
                                <Button size="sm" onPress={() => { setShowForm(!showForm); setShowProfile(false); }}
                                    className="bg-cyan-600/15 hover:bg-cyan-600/25 text-cyan-400 border border-cyan-500/20 font-mono text-[10px] tracking-wider">
                                    + NOWY POST
                                </Button>
                                <Button size="sm" onPress={handleLogout}
                                    className="bg-white/5 hover:bg-white/10 text-slate-500 border border-white/10 font-mono text-[10px] tracking-wider">
                                    WYLOGUJ
                                </Button>
                            </div>
                        </Card>

                        {showForm && (
                            <NewPostForm categories={categories}
                                onCreated={() => { setShowForm(false); setOffset(0); fetchPosts(0, selectedCategory, searchQuery, sortBy, sortDir); }}
                                onClose={() => setShowForm(false)} />
                        )}

                        {/* ═══ 3-COLUMN LAYOUT ═══ */}
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-5">

                            {/* LEFT: Marketplace */}
                            <aside className="hidden lg:block">
                                <div className="sticky top-28 bg-black/30 backdrop-blur-xl border border-white/5 rounded-xl p-4">
                                    <MarketplaceSidebar user={user} onViewProfile={(name) => setViewUserDashboard(name)} />
                                </div>
                            </aside>

                            {/* CENTER: Posts */}
                            <main className="min-w-0">
                                <SearchBar query={searchQuery} setQuery={setSearchQuery}
                                    sortBy={sortBy} setSortBy={setSortBy} sortDir={sortDir} setSortDir={setSortDir}
                                    onSearch={handleSearch} />

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

                                {loading ? (
                                    <div className="flex justify-center py-20"><Spinner size="lg" color="success" /></div>
                                ) : posts.length === 0 ? (
                                    <div className="text-center py-20">
                                        <p className="text-slate-600 font-mono text-sm">
                                            {searchQuery ? `BRAK WYNIKÓW DLA "${searchQuery}"` : 'BRAK POSTÓW — BĄDŹ PIERWSZY!'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {posts.map(post => <PostCard key={post.id} post={post} onClick={() => setActivePost(post.id)} onViewProfile={(name) => setViewUserDashboard(name)} />)}
                                    </div>
                                )}

                                {total > LIMIT && (
                                    <div className="flex justify-center gap-3 mt-8">
                                        <Button size="sm" isDisabled={offset === 0} onPress={() => setOffset(Math.max(0, offset - LIMIT))}
                                            className="bg-white/5 text-slate-400 border border-white/10 font-mono text-xs">← PREV</Button>
                                        <span className="text-xs text-slate-600 font-mono self-center">{offset + 1}–{Math.min(offset + LIMIT, total)} z {total}</span>
                                        <Button size="sm" isDisabled={offset + LIMIT >= total} onPress={() => setOffset(offset + LIMIT)}
                                            className="bg-white/5 text-slate-400 border border-white/10 font-mono text-xs">NEXT →</Button>
                                    </div>
                                )}

                                {/* Mobile sidebars collapsed */}
                                <div className="lg:hidden mt-8 space-y-6">
                                    <div className="bg-black/30 backdrop-blur-xl border border-white/5 rounded-xl p-4">
                                        <MarketplaceSidebar user={user} onViewProfile={(name) => setViewUserDashboard(name)} />
                                    </div>
                                    <div className="bg-black/30 backdrop-blur-xl border border-white/5 rounded-xl p-4">
                                        <GazetkaSidebar user={user} />
                                    </div>
                                </div>
                            </main>

                            {/* RIGHT: Gazetka */}
                            <aside className="hidden lg:block">
                                <div className="sticky top-28 bg-black/30 backdrop-blur-xl border border-white/5 rounded-xl p-4">
                                    <GazetkaSidebar user={user} />
                                </div>
                            </aside>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Community;
