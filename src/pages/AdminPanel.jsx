import React, { useState, useEffect, useCallback } from 'react';
import { Users, FileText, MessageSquare, ShoppingBag, Activity, Shield, LogOut, RefreshCw, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

const WORKER_URL = 'https://jimbo77-community.stolarnia-ams.workers.dev';
const ADMIN_USER = 'Jimbo77';
const SESSION_KEY = 'jimbo77_admin_auth';

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = (v) => v ?? '—';
const fmtDate = (d) => {
    if (!d) return '—';
    try { return new Date(d).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' }); }
    catch { return String(d).slice(0, 16); }
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-5 flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>
            <Icon size={20} className="text-white" />
        </div>
        <div>
            <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">{label}</p>
            <p className="text-white text-2xl font-bold font-mono">{value ?? '…'}</p>
        </div>
    </div>
);

// ── Section ───────────────────────────────────────────────────────────────────
const Section = ({ title, children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden mb-4">
            <button
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
                onClick={() => setOpen(o => !o)}
            >
                <span className="text-white font-semibold text-sm font-mono uppercase tracking-wider">{title}</span>
                {open ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
            </button>
            {open && <div className="px-5 pb-5">{children}</div>}
        </div>
    );
};

// ── Table ─────────────────────────────────────────────────────────────────────
const Table = ({ cols, rows, emptyMsg = 'Brak danych' }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
            <thead>
                <tr className="border-b border-white/10">
                    {cols.map(c => (
                        <th key={c} className="text-left py-2 px-3 text-slate-500 uppercase tracking-wider font-medium">{c}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.length === 0 ? (
                    <tr><td colSpan={cols.length} className="py-6 text-center text-slate-600">{emptyMsg}</td></tr>
                ) : rows.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        {row.map((cell, j) => (
                            <td key={j} className="py-2 px-3 text-slate-300 max-w-xs truncate">{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// ── Badge ─────────────────────────────────────────────────────────────────────
const Badge = ({ v, t, f, tClass, fClass }) =>
    v ? <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${tClass}`}>{t}</span>
      : <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${fClass}`}>{f}</span>;

// ── Login Screen ──────────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }) => {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        if (user !== ADMIN_USER) { setError('Nieprawidłowy login'); return; }
        setLoading(true);
        try {
            const res = await fetch(`${WORKER_URL}/api/panel`, {
                headers: { 'X-Panel-Secret': pass }
            });
            if (!res.ok) { setError('Nieprawidłowe hasło'); return; }
            sessionStorage.setItem(SESSION_KEY, pass);
            onLogin(pass);
        } catch {
            setError('Błąd połączenia z serverem');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <div className="inline-flex p-3 bg-cyan-500/10 rounded-2xl mb-4">
                        <Shield size={32} className="text-cyan-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white font-mono">ADMIN PANEL</h1>
                    <p className="text-slate-500 text-sm mt-1 font-mono">jimbo77 community</p>
                </div>

                <form onSubmit={submit} className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
                    <div>
                        <label className="text-xs text-slate-500 font-mono uppercase tracking-wider block mb-1">Login</label>
                        <input
                            value={user}
                            onChange={e => setUser(e.target.value)}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-cyan-500/50"
                            placeholder="username"
                            autoComplete="username"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 font-mono uppercase tracking-wider block mb-1">Hasło</label>
                        <div className="relative">
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={pass}
                                onChange={e => setPass(e.target.value)}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-cyan-500/50 pr-10"
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                            <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-mono text-sm py-2.5 rounded-lg transition-colors"
                    >
                        {loading ? 'Łączenie…' : 'Zaloguj'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard = ({ secret, onLogout }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [lastRefresh, setLastRefresh] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${WORKER_URL}/api/panel`, {
                headers: { 'X-Panel-Secret': secret }
            });
            if (!res.ok) throw new Error('Błąd autoryzacji');
            const json = await res.json();
            setData(json);
            setLastRefresh(new Date());
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [secret]);

    useEffect(() => { load(); }, [load]);

    const stats = data?.stats ?? {};

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield size={18} className="text-cyan-400" />
                        <span className="font-mono font-bold text-sm">JIMBO77 ADMIN</span>
                        {lastRefresh && (
                            <span className="text-slate-600 text-xs font-mono hidden sm:block">
                                odświeżono: {fmtDate(lastRefresh)}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={load}
                            disabled={loading}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg text-slate-300 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                            Odśwież
                        </button>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-red-900/40 hover:bg-red-900/60 border border-red-500/20 rounded-lg text-red-400 transition-colors"
                        >
                            <LogOut size={12} />
                            Wyloguj
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {error && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-400 text-sm font-mono">{error}</div>
                )}

                {loading && !data ? (
                    <div className="flex items-center justify-center py-32 text-slate-500 font-mono">
                        <RefreshCw size={20} className="animate-spin mr-3" /> Ładowanie danych…
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                            <StatCard icon={Users}         label="Użytkownicy"    value={stats.users}          color="bg-cyan-600" />
                            <StatCard icon={FileText}      label="Posty"          value={stats.posts}          color="bg-blue-600" />
                            <StatCard icon={MessageSquare} label="Komentarze"     value={stats.comments}       color="bg-purple-600" />
                            <StatCard icon={ShoppingBag}   label="Ogłoszenia"     value={stats.listings}       color="bg-orange-600" />
                            <StatCard icon={Activity}      label="Newsy"          value={stats.news}           color="bg-emerald-600" />
                            <StatCard icon={Shield}        label="Sesje aktywne"  value={stats.activeSessions} color="bg-pink-600" />
                        </div>

                        {/* Users */}
                        <Section title={`Użytkownicy (${data?.users?.length ?? 0})`}>
                            <Table
                                cols={['ID', 'Username', 'Email', 'Rola', 'Zweryfikowany', 'Data rejestracji', 'Lokalizacja']}
                                rows={(data?.users ?? []).map(u => [
                                    u.id,
                                    <span className="text-cyan-400">{u.username}</span>,
                                    u.email,
                                    <Badge v={u.role === 'admin'} t="admin" f={u.role || 'user'}
                                        tClass="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                        fClass="bg-slate-700 text-slate-400" />,
                                    <Badge v={u.verified} t="✓ tak" f="✗ nie"
                                        tClass="bg-emerald-500/20 text-emerald-400"
                                        fClass="bg-red-500/20 text-red-400" />,
                                    fmtDate(u.created_at),
                                    fmt(u.location),
                                ])}
                            />
                        </Section>

                        {/* Recent Posts */}
                        <Section title={`Ostatnie posty (${data?.recentPosts?.length ?? 0})`} defaultOpen={false}>
                            <Table
                                cols={['ID', 'Tytuł', 'Autor', 'Wyświetlenia', 'Data']}
                                rows={(data?.recentPosts ?? []).map(p => [
                                    p.id,
                                    <span className="text-slate-200 truncate max-w-[200px] block">{p.title}</span>,
                                    <span className="text-cyan-400">{p.username}</span>,
                                    p.view_count ?? 0,
                                    fmtDate(p.created_at),
                                ])}
                            />
                        </Section>

                        {/* Listings */}
                        <Section title={`Ogłoszenia marketplace (${data?.listings?.length ?? 0})`} defaultOpen={false}>
                            <Table
                                cols={['ID', 'Tytuł', 'Autor', 'Cena', 'Data']}
                                rows={(data?.listings ?? []).map(l => [
                                    l.id,
                                    l.title,
                                    <span className="text-cyan-400">{l.username}</span>,
                                    l.price ? `${l.price} ${l.currency || ''}` : '—',
                                    fmtDate(l.created_at),
                                ])}
                                emptyMsg="Brak ogłoszeń"
                            />
                        </Section>

                        {/* Audit Logs */}
                        <Section title={`Logi audytu (${data?.auditLogs?.length ?? 0} ostatnich)`} defaultOpen={false}>
                            <Table
                                cols={['Czas', 'Użytkownik', 'Akcja', 'Zasób', 'IP']}
                                rows={(data?.auditLogs ?? []).map(l => [
                                    fmtDate(l.created_at),
                                    <span className="text-cyan-400">{l.username || `#${l.user_id}`}</span>,
                                    <span className="text-yellow-400">{l.action}</span>,
                                    `${l.resource_type || ''}${l.resource_id ? ' #' + l.resource_id : ''}`,
                                    <span className="text-slate-500">{l.ip_address || '—'}</span>,
                                ])}
                                emptyMsg="Brak logów"
                            />
                        </Section>
                    </>
                )}
            </div>
        </div>
    );
};

// ── Root ──────────────────────────────────────────────────────────────────────
const AdminPanel = () => {
    const [secret, setSecret] = useState(() => sessionStorage.getItem(SESSION_KEY) || null);

    const handleLogin = (s) => setSecret(s);
    const handleLogout = () => {
        sessionStorage.removeItem(SESSION_KEY);
        setSecret(null);
    };

    if (!secret) return <LoginScreen onLogin={handleLogin} />;
    return <Dashboard secret={secret} onLogout={handleLogout} />;
};

export default AdminPanel;
