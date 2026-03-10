import React, { useState, useEffect, useCallback } from 'react';
import {
    Users, FileText, MessageSquare, ShoppingBag, Activity, Shield,
    LogOut, RefreshCw, ChevronDown, ChevronUp, Eye, EyeOff,
    AlertTriangle, XCircle, StickyNote, Send, Trash2, BarChart2, X
} from 'lucide-react';

const WORKER_URL = 'https://jimbo77-community.stolarnia-ams.workers.dev';
const ADMIN_USER = 'Jimbo77';
const SESSION_KEY = 'jimbo77_admin_auth';

const fmt = (v) => v ?? '—';
const fmtDate = (d) => {
    if (!d) return '—';
    try { return new Date(d).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' }); }
    catch { return String(d).slice(0, 16); }
};
const fmtShortDate = (d) => {
    if (!d) return '';
    try { return new Date(d).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' }); }
    catch { return String(d).slice(5, 10); }
};

// ── Bar Chart (CSS-based) ─────────────────────────────────────────────────────
const BarChart = ({ data, color, label }) => {
    if (!data?.length) return <div className="text-slate-600 text-xs font-mono py-4 text-center">Brak danych</div>;
    const max = Math.max(...data.map(d => d.count), 1);
    // fill last 30 days
    const days = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const found = data.find(r => r.day === key);
        days.push({ day: key, count: found?.count ?? 0 });
    }
    return (
        <div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-2">{label} — ostatnie 30 dni</p>
            <div className="flex items-end gap-[2px] h-16">
                {days.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                        <div
                            className={`w-full rounded-sm ${color} opacity-70 group-hover:opacity-100 transition-opacity`}
                            style={{ height: `${Math.max(2, (d.count / max) * 56)}px` }}
                        />
                        {d.count > 0 && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:flex bg-slate-800 border border-white/10 rounded px-1.5 py-0.5 text-[9px] font-mono text-white whitespace-nowrap z-10">
                                {fmtShortDate(d.day)}: {d.count}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-1">
                <span className="text-[9px] text-slate-600 font-mono">{fmtShortDate(days[0].day)}</span>
                <span className="text-[9px] text-slate-600 font-mono">{fmtShortDate(days[days.length - 1].day)}</span>
            </div>
        </div>
    );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-4 flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${color}`}><Icon size={18} className="text-white" /></div>
        <div>
            <p className="text-slate-400 text-[10px] font-mono uppercase tracking-wider">{label}</p>
            <p className="text-white text-xl font-bold font-mono">{value ?? '…'}</p>
        </div>
    </div>
);

// ── Section ───────────────────────────────────────────────────────────────────
const Section = ({ title, children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden mb-4">
            <button className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/5 transition-colors" onClick={() => setOpen(o => !o)}>
                <span className="text-white font-semibold text-xs font-mono uppercase tracking-wider">{title}</span>
                {open ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
            </button>
            {open && <div className="px-5 pb-5">{children}</div>}
        </div>
    );
};

// ── Badge ─────────────────────────────────────────────────────────────────────
const Badge = ({ v, t, f, tClass, fClass }) =>
    v ? <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${tClass}`}>{t}</span>
      : <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${fClass}`}>{f}</span>;

// ── Card Badge ─────────────────────────────────────────────────────────────────
const CardBadge = ({ type }) => {
    if (type === 'yellow') return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">🟡 Żółta</span>;
    if (type === 'red')    return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-400 border border-red-500/30">🔴 Czerwona</span>;
    return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-700 text-slate-300">📝 Nota</span>;
};

// ── User Action Modal ─────────────────────────────────────────────────────────
const UserModal = ({ user, secret, onClose, onRefresh }) => {
    const [tab, setTab] = useState('cards');
    const [cards, setCards] = useState([]);
    const [loadingCards, setLoadingCards] = useState(true);
    const [cardType, setCardType] = useState('yellow');
    const [cardMsg, setCardMsg] = useState('');
    const [msgSubject, setMsgSubject] = useState('');
    const [msgBody, setMsgBody] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetch(`${WORKER_URL}/api/panel/users/${user.id}/cards`, { headers: { 'X-Panel-Secret': secret } })
            .then(r => r.json()).then(d => setCards(Array.isArray(d) ? d : []))
            .finally(() => setLoadingCards(false));
    }, [user.id, secret]);

    const addCard = async () => {
        if (!cardMsg.trim()) return;
        setStatus('Zapisywanie…');
        const r = await fetch(`${WORKER_URL}/api/panel/users/${user.id}/cards`, {
            method: 'POST',
            headers: { 'X-Panel-Secret': secret, 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: cardType, message: cardMsg })
        });
        if (r.ok) { setCardMsg(''); setCards(c => [{ type: cardType, message: cardMsg, created_at: new Date().toISOString() }, ...c]); setStatus('✓ Dodano'); onRefresh(); }
        else setStatus('Błąd');
    };

    const deleteCard = async (id) => {
        await fetch(`${WORKER_URL}/api/panel/cards/${id}`, { method: 'DELETE', headers: { 'X-Panel-Secret': secret } });
        setCards(c => c.filter(x => x.id !== id));
        onRefresh();
    };

    const sendMsg = async () => {
        if (!msgSubject.trim() || !msgBody.trim()) return;
        setStatus('Wysyłanie…');
        const r = await fetch(`${WORKER_URL}/api/panel/users/${user.id}/message`, {
            method: 'POST',
            headers: { 'X-Panel-Secret': secret, 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject: msgSubject, message: msgBody })
        });
        if (r.ok) { setMsgSubject(''); setMsgBody(''); setStatus('✓ Wysłano email'); }
        else setStatus('Błąd wysyłania');
    };

    return (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <div>
                        <p className="text-white font-semibold font-mono">{user.username}</p>
                        <p className="text-slate-500 text-xs font-mono">{user.email}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10">
                    {[['cards', '🃏 Kartki'], ['message', '✉️ Wiadomość']].map(([k, l]) => (
                        <button key={k} onClick={() => setTab(k)}
                            className={`px-5 py-2.5 text-xs font-mono transition-colors ${tab === k ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                            {l}
                        </button>
                    ))}
                </div>

                <div className="overflow-y-auto flex-1 p-5 space-y-4">
                    {tab === 'cards' && (
                        <>
                            {/* Add card */}
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    {[['yellow','🟡 Żółta'], ['red','🔴 Czerwona'], ['note','📝 Nota']].map(([v, l]) => (
                                        <button key={v} onClick={() => setCardType(v)}
                                            className={`px-3 py-1 rounded text-[11px] font-mono border transition-all ${cardType === v ? 'bg-slate-700 border-white/20 text-white' : 'border-white/10 text-slate-500 hover:text-slate-300'}`}>
                                            {l}
                                        </button>
                                    ))}
                                </div>
                                <textarea value={cardMsg} onChange={e => setCardMsg(e.target.value)}
                                    placeholder="Treść notatki / powód kartki…"
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-cyan-500/50 resize-none h-20" />
                                <button onClick={addCard} className="px-4 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/30 text-cyan-400 text-xs font-mono rounded-lg transition-colors">
                                    Dodaj
                                </button>
                            </div>

                            {/* Card history */}
                            <div className="space-y-2">
                                {loadingCards ? <p className="text-slate-600 text-xs font-mono">Ładowanie…</p> :
                                    cards.length === 0 ? <p className="text-slate-600 text-xs font-mono">Brak kartek/notatek</p> :
                                    cards.map((c, i) => (
                                        <div key={c.id ?? i} className="flex items-start gap-2 bg-slate-800/50 rounded-lg p-3 border border-white/5">
                                            <CardBadge type={c.type} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-slate-300 text-xs font-mono leading-snug">{c.message}</p>
                                                <p className="text-slate-600 text-[10px] font-mono mt-1">{fmtDate(c.created_at)}</p>
                                            </div>
                                            {c.id && <button onClick={() => deleteCard(c.id)} className="text-slate-600 hover:text-red-400 transition-colors shrink-0"><Trash2 size={12} /></button>}
                                        </div>
                                    ))
                                }
                            </div>
                        </>
                    )}

                    {tab === 'message' && (
                        <div className="space-y-3">
                            <input value={msgSubject} onChange={e => setMsgSubject(e.target.value)}
                                placeholder="Temat wiadomości"
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-cyan-500/50" />
                            <textarea value={msgBody} onChange={e => setMsgBody(e.target.value)}
                                placeholder="Treść wiadomości…"
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-cyan-500/50 resize-none h-32" />
                            <button onClick={sendMsg} className="flex items-center gap-2 px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/30 text-cyan-400 text-xs font-mono rounded-lg transition-colors">
                                <Send size={12} /> Wyślij email do {user.username}
                            </button>
                            <p className="text-[10px] text-slate-500 font-mono">Email zostanie wysłany na: {user.email}</p>
                        </div>
                    )}
                </div>

                {status && <div className="px-5 py-2 border-t border-white/10 text-xs font-mono text-cyan-400">{status}</div>}
            </div>
        </div>
    );
};

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
            const res = await fetch(`${WORKER_URL}/api/panel`, { headers: { 'X-Panel-Secret': pass } });
            if (!res.ok) { setError('Nieprawidłowe hasło'); return; }
            sessionStorage.setItem(SESSION_KEY, pass);
            onLogin(pass);
        } catch { setError('Błąd połączenia z serverem'); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <div className="inline-flex p-3 bg-cyan-500/10 rounded-2xl mb-4"><Shield size={32} className="text-cyan-400" /></div>
                    <h1 className="text-2xl font-bold text-white font-mono">ADMIN PANEL</h1>
                    <p className="text-slate-500 text-sm mt-1 font-mono">jimbo77 community</p>
                </div>
                <form onSubmit={submit} className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
                    <div>
                        <label className="text-xs text-slate-500 font-mono uppercase tracking-wider block mb-1">Login</label>
                        <input value={user} onChange={e => setUser(e.target.value)}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-cyan-500/50"
                            placeholder="username" autoComplete="username" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 font-mono uppercase tracking-wider block mb-1">Hasło</label>
                        <div className="relative">
                            <input type={showPass ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-cyan-500/50 pr-10"
                                placeholder="••••••••" autoComplete="current-password" />
                            <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
                    <button type="submit" disabled={loading}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-mono text-sm py-2.5 rounded-lg transition-colors">
                        {loading ? 'Łączenie…' : 'Zaloguj'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = ({ secret, onLogout }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [lastRefresh, setLastRefresh] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const load = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const res = await fetch(`${WORKER_URL}/api/panel`, { headers: { 'X-Panel-Secret': secret } });
            if (!res.ok) throw new Error('Błąd autoryzacji');
            setData(await res.json());
            setLastRefresh(new Date());
        } catch (e) { setError(e.message); }
        finally { setLoading(false); }
    }, [secret]);

    useEffect(() => { load(); }, [load]);

    const stats = data?.stats ?? {};

    // Cards summary per user
    const cardsByUser = {};
    (data?.cards ?? []).forEach(c => {
        if (!cardsByUser[c.user_id]) cardsByUser[c.user_id] = { yellow: 0, red: 0, note: 0 };
        cardsByUser[c.user_id][c.type] = (cardsByUser[c.user_id][c.type] || 0) + 1;
    });

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield size={16} className="text-cyan-400" />
                        <span className="font-mono font-bold text-sm">JIMBO77 ADMIN</span>
                        {lastRefresh && <span className="text-slate-600 text-xs font-mono hidden sm:block">odświeżono: {fmtDate(lastRefresh)}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={load} disabled={loading}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg text-slate-300 transition-colors disabled:opacity-50">
                            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} /> Odśwież
                        </button>
                        <button onClick={onLogout}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-red-900/40 hover:bg-red-900/60 border border-red-500/20 rounded-lg text-red-400 transition-colors">
                            <LogOut size={11} /> Wyloguj
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {error && <div className="mb-4 p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-400 text-sm font-mono">{error}</div>}

                {loading && !data ? (
                    <div className="flex items-center justify-center py-32 text-slate-500 font-mono">
                        <RefreshCw size={18} className="animate-spin mr-3" /> Ładowanie…
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                            <StatCard icon={Users}         label="Użytkownicy"   value={stats.users}          color="bg-cyan-600" />
                            <StatCard icon={FileText}      label="Posty"         value={stats.posts}          color="bg-blue-600" />
                            <StatCard icon={MessageSquare} label="Komentarze"    value={stats.comments}       color="bg-purple-600" />
                            <StatCard icon={ShoppingBag}   label="Ogłoszenia"    value={stats.listings}       color="bg-orange-600" />
                            <StatCard icon={Activity}      label="Newsy"         value={stats.news}           color="bg-emerald-600" />
                            <StatCard icon={Shield}        label="Sesje aktywne" value={stats.activeSessions} color="bg-pink-600" />
                        </div>

                        {/* Charts */}
                        <Section title="Aktywność — ostatnie 30 dni" defaultOpen={true}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <BarChart data={data?.charts?.posts}    color="bg-blue-500"    label="Posty" />
                                <BarChart data={data?.charts?.comments} color="bg-purple-500"  label="Komentarze" />
                                <BarChart data={data?.charts?.users}    color="bg-cyan-500"    label="Rejestracje" />
                            </div>
                        </Section>

                        {/* Users */}
                        <Section title={`Użytkownicy (${data?.users?.length ?? 0})`}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs font-mono">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            {['ID','Username','Email','Rola','Status','Kartki','Rejestracja','Akcje'].map(c => (
                                                <th key={c} className="text-left py-2 px-3 text-slate-500 uppercase tracking-wider text-[10px]">{c}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(data?.users ?? []).map(u => {
                                            const uc = cardsByUser[u.id] || {};
                                            return (
                                                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="py-2 px-3 text-slate-500">{u.id}</td>
                                                    <td className="py-2 px-3 text-cyan-400">{u.username}</td>
                                                    <td className="py-2 px-3 text-slate-300">{u.email}</td>
                                                    <td className="py-2 px-3">
                                                        <Badge v={u.role === 'admin'} t="admin" f={u.role || 'user'}
                                                            tClass="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                                            fClass="bg-slate-700 text-slate-400" />
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <Badge v={u.verified} t="✓ ok" f="✗ nie"
                                                            tClass="bg-emerald-500/20 text-emerald-400"
                                                            fClass="bg-red-500/20 text-red-400" />
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <div className="flex gap-1">
                                                            {uc.yellow > 0 && <span className="text-yellow-400 font-bold">🟡{uc.yellow}</span>}
                                                            {uc.red > 0 && <span className="text-red-400 font-bold">🔴{uc.red}</span>}
                                                            {uc.note > 0 && <span className="text-slate-400">📝{uc.note}</span>}
                                                            {!uc.yellow && !uc.red && !uc.note && <span className="text-slate-700">—</span>}
                                                        </div>
                                                    </td>
                                                    <td className="py-2 px-3 text-slate-500">{fmtDate(u.created_at)}</td>
                                                    <td className="py-2 px-3">
                                                        <button onClick={() => setSelectedUser(u)}
                                                            className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded text-slate-400 hover:text-cyan-400 transition-colors text-[10px]">
                                                            <StickyNote size={10} /> Akcje
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Section>

                        {/* Recent cards */}
                        {(data?.cards?.length > 0) && (
                            <Section title={`Kartki i notatki (${data.cards.length})`} defaultOpen={false}>
                                <div className="space-y-2">
                                    {data.cards.map((c, i) => (
                                        <div key={c.id ?? i} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-white/5">
                                            <CardBadge type={c.type} />
                                            <div className="flex-1 min-w-0">
                                                <span className="text-cyan-400 text-xs font-mono mr-2">{c.username}</span>
                                                <span className="text-slate-300 text-xs font-mono">{c.message}</span>
                                                <p className="text-slate-600 text-[10px] font-mono mt-0.5">{fmtDate(c.created_at)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* Recent Posts */}
                        <Section title={`Ostatnie posty (${data?.recentPosts?.length ?? 0})`} defaultOpen={false}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs font-mono">
                                    <thead><tr className="border-b border-white/10">
                                        {['ID','Tytuł','Autor','Wyśw.','Data'].map(c => <th key={c} className="text-left py-2 px-3 text-slate-500 uppercase tracking-wider text-[10px]">{c}</th>)}
                                    </tr></thead>
                                    <tbody>
                                        {(data?.recentPosts ?? []).map(p => (
                                            <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                                                <td className="py-2 px-3 text-slate-500">{p.id}</td>
                                                <td className="py-2 px-3 text-slate-200 max-w-[200px] truncate">{p.title}</td>
                                                <td className="py-2 px-3 text-cyan-400">{p.username}</td>
                                                <td className="py-2 px-3 text-slate-400">{p.view_count ?? 0}</td>
                                                <td className="py-2 px-3 text-slate-500">{fmtDate(p.created_at)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Section>

                        {/* Listings */}
                        <Section title={`Ogłoszenia (${data?.listings?.length ?? 0})`} defaultOpen={false}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs font-mono">
                                    <thead><tr className="border-b border-white/10">
                                        {['ID','Tytuł','Autor','Cena','Data'].map(c => <th key={c} className="text-left py-2 px-3 text-slate-500 uppercase tracking-wider text-[10px]">{c}</th>)}
                                    </tr></thead>
                                    <tbody>
                                        {(data?.listings ?? []).map(l => (
                                            <tr key={l.id} className="border-b border-white/5 hover:bg-white/5">
                                                <td className="py-2 px-3 text-slate-500">{l.id}</td>
                                                <td className="py-2 px-3 text-slate-200">{l.title}</td>
                                                <td className="py-2 px-3 text-cyan-400">{l.username}</td>
                                                <td className="py-2 px-3 text-slate-400">{l.price ? `${l.price} ${l.currency || ''}` : '—'}</td>
                                                <td className="py-2 px-3 text-slate-500">{fmtDate(l.created_at)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Section>

                        {/* Audit Logs */}
                        <Section title={`Logi audytu (${data?.auditLogs?.length ?? 0})`} defaultOpen={false}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs font-mono">
                                    <thead><tr className="border-b border-white/10">
                                        {['Czas','Użytkownik','Akcja','Zasób','IP'].map(c => <th key={c} className="text-left py-2 px-3 text-slate-500 uppercase tracking-wider text-[10px]">{c}</th>)}
                                    </tr></thead>
                                    <tbody>
                                        {(data?.auditLogs ?? []).map((l, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                                <td className="py-2 px-3 text-slate-500">{fmtDate(l.created_at)}</td>
                                                <td className="py-2 px-3 text-cyan-400">{l.username || `#${l.user_id}`}</td>
                                                <td className="py-2 px-3 text-yellow-400">{l.action}</td>
                                                <td className="py-2 px-3 text-slate-400">{`${l.resource_type || ''}${l.resource_id ? ' #'+l.resource_id : ''}`}</td>
                                                <td className="py-2 px-3 text-slate-600">{l.ip_address || '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Section>
                    </>
                )}
            </div>

            {selectedUser && (
                <UserModal user={selectedUser} secret={secret} onClose={() => setSelectedUser(null)} onRefresh={load} />
            )}
        </div>
    );
};

// ── Root ──────────────────────────────────────────────────────────────────────
const AdminPanel = () => {
    const [secret, setSecret] = useState(() => sessionStorage.getItem(SESSION_KEY) || null);
    const handleLogout = () => { sessionStorage.removeItem(SESSION_KEY); setSecret(null); };
    if (!secret) return <LoginScreen onLogin={s => setSecret(s)} />;
    return <Dashboard secret={secret} onLogout={handleLogout} />;
};

export default AdminPanel;
