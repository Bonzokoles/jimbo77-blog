import React, { useState, useEffect } from 'react';
import { Card, Chip } from "@heroui/react";
import { X, Star, ImageIcon, Zap, Download } from 'lucide-react';
import SEO from '../components/SEO';

// ─── Seed data (fallback if JSON fails to load) ───────────────────────────────
const GALLERY_SEED = [
    // Buduje własnego AI agenta
    {
        id: 'agent-flux-pro-1',
        src: '/gallery/buduje-wlasnego-ai-agenta-do-monitorowania-wiadomosci/variant_2_flux_pro.webp',
        topic: 'AI Agent',
        model: 'FLUX Pro',
        modelTag: 'flux-pro',
        prompt: 'Buduje własnego AI agenta do monitorowania wiadomości',
        date: '2026-03-09',
    },
    {
        id: 'agent-flux11pro-1',
        src: '/gallery/buduje-wlasnego-ai-agenta-do-monitorowania-wiadomosci/variant_2_flux_1.1_pro.webp',
        topic: 'AI Agent',
        model: 'FLUX 1.1 Pro',
        modelTag: 'flux-1.1-pro',
        prompt: 'Buduje własnego AI agenta do monitorowania wiadomości',
        date: '2026-03-09',
    },
    {
        id: 'agent-flux-pro-2',
        src: '/gallery/buduje-wlasnego-ai-agenta-do-monitorowania-wiadomosci/variant_3_flux_pro.webp',
        topic: 'AI Agent',
        model: 'FLUX Pro',
        modelTag: 'flux-pro',
        prompt: 'Buduje własnego AI agenta do monitorowania wiadomości',
        date: '2026-03-09',
    },
    {
        id: 'agent-schnell-1',
        src: '/gallery/buduje-wlasnego-ai-agenta-do-monitorowania-wiadomosci/variant_1_flux_schnell_(free).webp',
        topic: 'AI Agent',
        model: 'FLUX Schnell',
        modelTag: 'flux-schnell',
        prompt: 'Buduje własnego AI agenta do monitorowania wiadomości',
        date: '2026-03-09',
    },
    {
        id: 'agent-gpt1-1',
        src: '/gallery/buduje-wlasnego-ai-agenta-do-monitorowania-wiadomosci/variant_1_gpt_image_1_(openai).png',
        topic: 'AI Agent',
        model: 'GPT Image 1',
        modelTag: 'gpt-image-1',
        prompt: 'Buduje własnego AI agenta do monitorowania wiadomości',
        date: '2026-03-09',
    },
    {
        id: 'agent-gptmini-1',
        src: '/gallery/buduje-wlasnego-ai-agenta-do-monitorowania-wiadomosci/variant_1_gpt_image_1_mini_(openai).png',
        topic: 'AI Agent',
        model: 'GPT Image 1 Mini',
        modelTag: 'gpt-image-mini',
        prompt: 'Buduje własnego AI agenta do monitorowania wiadomości',
        date: '2026-03-09',
    },
    {
        id: 'agent-gptmini-2',
        src: '/gallery/buduje-wlasnego-ai-agenta-do-monitorowania-wiadomosci/variant_3_gpt_image_1_mini_(openai).png',
        topic: 'AI Agent',
        model: 'GPT Image 1 Mini',
        modelTag: 'gpt-image-mini',
        prompt: 'Buduje własnego AI agenta do monitorowania wiadomości',
        date: '2026-03-09',
    },

    // Google Gemma 3
    {
        id: 'gemma-flux11pro-1',
        src: '/gallery/google-gemma-3-darmowy-model-ktory-zaskakuje/variant_2_flux_1.1_pro.webp',
        topic: 'Google Gemma 3',
        model: 'FLUX 1.1 Pro',
        modelTag: 'flux-1.1-pro',
        prompt: 'Google Gemma 3 - darmowy model który zaskakuje',
        date: '2026-03-09',
    },
    {
        id: 'gemma-flux-pro-1',
        src: '/gallery/google-gemma-3-darmowy-model-ktory-zaskakuje/variant_3_flux_pro.webp',
        topic: 'Google Gemma 3',
        model: 'FLUX Pro',
        modelTag: 'flux-pro',
        prompt: 'Google Gemma 3 - darmowy model który zaskakuje',
        date: '2026-03-09',
    },
    {
        id: 'gemma-schnell-1',
        src: '/gallery/google-gemma-3-darmowy-model-ktory-zaskakuje/variant_1_flux_schnell_(free).webp',
        topic: 'Google Gemma 3',
        model: 'FLUX Schnell',
        modelTag: 'flux-schnell',
        prompt: 'Google Gemma 3 - darmowy model który zaskakuje',
        date: '2026-03-09',
    },
    {
        id: 'gemma-schnell-2',
        src: '/gallery/google-gemma-3-darmowy-model-ktory-zaskakuje/variant_2_flux_schnell_(free).webp',
        topic: 'Google Gemma 3',
        model: 'FLUX Schnell',
        modelTag: 'flux-schnell',
        prompt: 'Google Gemma 3 - darmowy model który zaskakuje',
        date: '2026-03-09',
    },
    {
        id: 'gemma-dalle-1',
        src: '/gallery/google-gemma-3-darmowy-model-ktory-zaskakuje/variant_2_dall-e_3_(openai).png',
        topic: 'Google Gemma 3',
        model: 'DALL-E 3',
        modelTag: 'dalle-3',
        prompt: 'Google Gemma 3 - darmowy model który zaskakuje',
        date: '2026-03-09',
    },
    {
        id: 'gemma-dalle-2',
        src: '/gallery/google-gemma-3-darmowy-model-ktory-zaskakuje/variant_3_dall-e_3_(openai).png',
        topic: 'Google Gemma 3',
        model: 'DALL-E 3',
        modelTag: 'dalle-3',
        prompt: 'Google Gemma 3 - darmowy model który zaskakuje',
        date: '2026-03-09',
    },
    {
        id: 'gemma-gpt1-1',
        src: '/gallery/google-gemma-3-darmowy-model-ktory-zaskakuje/variant_1_gpt_image_1_(openai).png',
        topic: 'Google Gemma 3',
        model: 'GPT Image 1',
        modelTag: 'gpt-image-1',
        prompt: 'Google Gemma 3 - darmowy model który zaskakuje',
        date: '2026-03-09',
    },
    {
        id: 'gemma-gptmini-1',
        src: '/gallery/google-gemma-3-darmowy-model-ktory-zaskakuje/variant_1_gpt_image_1_mini_(openai).png',
        topic: 'Google Gemma 3',
        model: 'GPT Image 1 Mini',
        modelTag: 'gpt-image-mini',
        prompt: 'Google Gemma 3 - darmowy model który zaskakuje',
        date: '2026-03-09',
    },

    // Diagnostyka medyczna
    {
        id: 'med-flux11pro-1',
        src: '/gallery/jak-ai-pomaga-w-diagnostyce-medycznej-konkretne-przypadki/variant_1_flux_1.1_pro.webp',
        topic: 'AI w medycynie',
        model: 'FLUX 1.1 Pro',
        modelTag: 'flux-1.1-pro',
        prompt: 'Jak AI pomaga w diagnostyce medycznej - konkretne przypadki',
        date: '2026-03-09',
    },
    {
        id: 'med-flux-pro-1',
        src: '/gallery/jak-ai-pomaga-w-diagnostyce-medycznej-konkretne-przypadki/variant_1_flux_pro.webp',
        topic: 'AI w medycynie',
        model: 'FLUX Pro',
        modelTag: 'flux-pro',
        prompt: 'Jak AI pomaga w diagnostyce medycznej - konkretne przypadki',
        date: '2026-03-09',
    },
    {
        id: 'med-flux11pro-2',
        src: '/gallery/jak-ai-pomaga-w-diagnostyce-medycznej-konkretne-przypadki/variant_2_flux_1.1_pro.webp',
        topic: 'AI w medycynie',
        model: 'FLUX 1.1 Pro',
        modelTag: 'flux-1.1-pro',
        prompt: 'Jak AI pomaga w diagnostyce medycznej - konkretne przypadki',
        date: '2026-03-09',
    },
    {
        id: 'med-flux11pro-3',
        src: '/gallery/jak-ai-pomaga-w-diagnostyce-medycznej-konkretne-przypadki/variant_3_flux_1.1_pro.webp',
        topic: 'AI w medycynie',
        model: 'FLUX 1.1 Pro',
        modelTag: 'flux-1.1-pro',
        prompt: 'Jak AI pomaga w diagnostyce medycznej - konkretne przypadki',
        date: '2026-03-09',
    },
    {
        id: 'med-schnell-1',
        src: '/gallery/jak-ai-pomaga-w-diagnostyce-medycznej-konkretne-przypadki/variant_3_flux_schnell_(free).webp',
        topic: 'AI w medycynie',
        model: 'FLUX Schnell',
        modelTag: 'flux-schnell',
        prompt: 'Jak AI pomaga w diagnostyce medycznej - konkretne przypadki',
        date: '2026-03-09',
    },
    {
        id: 'med-dalle-1',
        src: '/gallery/jak-ai-pomaga-w-diagnostyce-medycznej-konkretne-przypadki/variant_2_dall-e_3_(openai).png',
        topic: 'AI w medycynie',
        model: 'DALL-E 3',
        modelTag: 'dalle-3',
        prompt: 'Jak AI pomaga w diagnostyce medycznej - konkretne przypadki',
        date: '2026-03-09',
    },
    {
        id: 'med-gpt1-1',
        src: '/gallery/jak-ai-pomaga-w-diagnostyce-medycznej-konkretne-przypadki/variant_1_gpt_image_1_(openai).png',
        topic: 'AI w medycynie',
        model: 'GPT Image 1',
        modelTag: 'gpt-image-1',
        prompt: 'Jak AI pomaga w diagnostyce medycznej - konkretne przypadki',
        date: '2026-03-09',
    },
    {
        id: 'med-gpt1-2',
        src: '/gallery/jak-ai-pomaga-w-diagnostyce-medycznej-konkretne-przypadki/variant_2_gpt_image_1_(openai).png',
        topic: 'AI w medycynie',
        model: 'GPT Image 1',
        modelTag: 'gpt-image-1',
        prompt: 'Jak AI pomaga w diagnostyce medycznej - konkretne przypadki',
        date: '2026-03-09',
    },

    // Blog hero images
    {
        id: 'hero-medycyna',
        src: '/blog-images/ai-w-medycynie-jak-algorytmy-wykrywaja-c-hero.png',
        topic: 'AI w medycynie',
        model: 'FLUX Pro',
        modelTag: 'flux-pro',
        prompt: 'AI w medycynie: Jak algorytmy wykrywają choroby serca',
        date: '2026-03-09',
    },
    {
        id: 'hero-rolnictwo',
        src: '/blog-images/ai-w-rolnictwie-autonomiczne-ciagniki-zw-hero.webp',
        topic: 'AI w rolnictwie',
        model: 'FLUX Pro',
        modelTag: 'flux-pro',
        prompt: 'AI w rolnictwie: autonomiczne ciągniki zwiększają plony',
        date: '2026-03-09',
    },
];

// ─── Kolory modeli ─────────────────────────────────────────────────────────────
const MODEL_COLORS = {
    'flux-pro':      'text-cyan-400 border-cyan-500/30 bg-cyan-900/20',
    'flux-1.1-pro':  'text-blue-400 border-blue-500/30 bg-blue-900/20',
    'flux-schnell':  'text-emerald-400 border-emerald-500/30 bg-emerald-900/20',
    'dalle-3':       'text-purple-400 border-purple-500/30 bg-purple-900/20',
    'gpt-image-1':   'text-orange-400 border-orange-500/30 bg-orange-900/20',
    'gpt-image-mini':'text-yellow-400 border-yellow-500/30 bg-yellow-900/20',
    'flux-ultra':    'text-pink-400 border-pink-500/30 bg-pink-900/20',
};

const ALL_MODELS = ['Wszystkie', 'FLUX Pro', 'FLUX 1.1 Pro', 'FLUX Schnell', 'DALL-E 3', 'GPT Image 1', 'GPT Image 1 Mini'];

// ─── Star Rating ───────────────────────────────────────────────────────────────
const StarRating = ({ imageId, size = 14 }) => {
    const key = `gallery_rating_${imageId}`;
    const [rating, setRating] = useState(() => parseInt(localStorage.getItem(key) || '0'));
    const [hover, setHover] = useState(0);

    const handleRate = (val) => {
        setRating(val);
        localStorage.setItem(key, val);
    };

    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(n => (
                <button
                    key={n}
                    onClick={(e) => { e.stopPropagation(); handleRate(n); }}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-colors"
                >
                    <Star
                        size={size}
                        className={n <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}
                    />
                </button>
            ))}
        </div>
    );
};

// ─── Lightbox ──────────────────────────────────────────────────────────────────
const Lightbox = ({ item, onClose, onPrev, onNext }) => {
    useEffect(() => {
        const fn = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, [onClose, onNext, onPrev]);

    return (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 gap-4" onClick={onClose}>
            {/* Close */}
            <button onClick={onClose} className="self-end mr-2 p-2 text-slate-400 hover:text-white transition-colors">
                <X size={22} />
            </button>

            {/* Image + side arrows */}
            <div className="relative max-w-5xl w-full flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <button
                    onClick={onPrev}
                    className="shrink-0 w-10 h-10 flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 rounded-full border border-white/10 text-white text-xl transition-all"
                >‹</button>

                <img
                    src={item.src}
                    alt={item.prompt}
                    className="flex-1 min-w-0 rounded-xl border border-white/10 shadow-2xl object-contain max-h-[75vh]"
                />

                <button
                    onClick={onNext}
                    className="shrink-0 w-10 h-10 flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 rounded-full border border-white/10 text-white text-xl transition-all"
                >›</button>
            </div>

            {/* Info bar */}
            <div className="max-w-5xl w-full flex items-start justify-between gap-4 px-12" onClick={e => e.stopPropagation()}>
                <div>
                    <p className="text-white text-sm font-medium mb-1 line-clamp-2">{item.prompt}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Chip size="sm" className={`text-[10px] font-mono border ${MODEL_COLORS[item.modelTag] || 'text-slate-400 border-slate-600'}`} variant="bordered">
                            {item.model}
                        </Chip>
                        <span className="text-[11px] text-slate-500 font-mono">{item.topic}</span>
                        <span className="text-[11px] text-slate-600 font-mono">{item.date}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <StarRating imageId={item.id} size={16} />
                    <a
                        href={item.src}
                        download
                        onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-cyan-400 transition-colors font-mono"
                    >
                        <Download size={11} /> pobierz
                    </a>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const Gallery = () => {
    const [items, setItems] = useState(GALLERY_SEED);
    const [modelFilter, setModelFilter] = useState('Wszystkie');
    const [topicFilter, setTopicFilter] = useState('Wszystkie');
    const [lightbox, setLightbox] = useState(null); // index

    useEffect(() => {
        fetch('/gallery/gallery-index.json')
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data?.length) setItems(data); })
            .catch(() => {});
    }, []);

    const allTopics = ['Wszystkie', ...new Set(items.map(i => i.topic))];

    const filtered = items.filter(item =>
        (modelFilter === 'Wszystkie' || item.model === modelFilter) &&
        (topicFilter === 'Wszystkie' || item.topic === topicFilter)
    );

    const openLightbox = (idx) => setLightbox(idx);
    const closeLightbox = () => setLightbox(null);
    const prevItem = () => setLightbox(i => (i - 1 + filtered.length) % filtered.length);
    const nextItem = () => setLightbox(i => (i + 1) % filtered.length);

    const stats = {
        total: items.length,
        models: new Set(items.map(i => i.model)).size,
        topics: new Set(items.map(i => i.topic)).size,
    };

    return (
        <>
            <SEO title="AI Gallery" description="Galeria obrazów generowanych przez AI — FLUX Pro, FLUX Schnell, DALL-E 3, GPT Image 1. Porównaj modele, oceń grafiki." url="/gallery" />

            <div className="min-h-screen pt-24 pb-16 w-full">
                <div className="container mx-auto px-4 max-w-7xl">

                    {/* ── Header ── */}
                    <div className="mb-10">
                        <h1 className="font-display text-5xl text-white mb-3 leading-tight">
                            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">GALLERY</span>
                        </h1>
                        <p className="text-slate-400 text-sm mb-6 max-w-xl">
                            Obrazy generowane automatycznie przez publisher przy każdym artykule. Kilka wariantów z różnych modeli — oceń który najlepszy.
                        </p>

                        {/* Stats */}
                        <div className="flex gap-6 text-xs font-mono text-slate-500 mb-6">
                            <span><span className="text-cyan-400 font-bold">{stats.total}</span> obrazów</span>
                            <span><span className="text-purple-400 font-bold">{stats.models}</span> modeli</span>
                            <span><span className="text-emerald-400 font-bold">{stats.topics}</span> tematów</span>
                            <span className="flex items-center gap-1"><Zap size={10} className="text-yellow-400" /> Powered by Replicate + Cloudflare</span>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex flex-wrap gap-2">
                                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider self-center mr-1">Model:</span>
                                {ALL_MODELS.map(m => (
                                    <button key={m} onClick={() => setModelFilter(m)}
                                        className={`px-3 py-1 rounded-full text-[11px] font-mono border transition-all ${
                                            modelFilter === m
                                                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                                                : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                                        }`}>
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider self-center mr-1">Temat:</span>
                            {allTopics.map(t => (
                                <button key={t} onClick={() => setTopicFilter(t)}
                                    className={`px-3 py-1 rounded-full text-[11px] font-mono border transition-all ${
                                        topicFilter === t
                                            ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                                            : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                                    }`}>
                                    {t}
                                </button>
                            ))}
                        </div>

                        <p className="text-[11px] text-slate-600 font-mono mt-3">
                            {filtered.length} z {items.length} obrazów
                        </p>
                    </div>

                    {/* ── Grid ── */}
                    {filtered.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 font-mono">Brak obrazów dla wybranych filtrów.</div>
                    ) : (
                        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3">
                            {filtered.map((item, idx) => (
                                <div key={item.id} className="break-inside-avoid">
                                    <Card
                                        className="bg-slate-900/50 border border-white/5 overflow-hidden hover:border-cyan-500/30 hover:scale-[1.01] transition-all cursor-pointer group"
                                        onClick={() => openLightbox(idx)}
                                    >
                                        <div className="relative">
                                            <img
                                                src={item.src}
                                                alt={item.prompt}
                                                className="w-full object-cover"
                                                loading="lazy"
                                                onError={e => { e.target.parentElement.parentElement.style.display = 'none'; }}
                                            />
                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <ImageIcon size={24} className="text-white/70" />
                                            </div>
                                        </div>
                                        <div className="p-2.5">
                                            <Chip
                                                size="sm"
                                                className={`text-[9px] font-mono border mb-2 ${MODEL_COLORS[item.modelTag] || 'text-slate-400 border-slate-600'}`}
                                                variant="bordered"
                                            >
                                                {item.model}
                                            </Chip>
                                            <p className="text-[10px] text-slate-500 leading-snug line-clamp-2 mb-2">{item.prompt}</p>
                                            <StarRating imageId={item.id} size={12} />
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Info banner ── */}
                    <div className="mt-12 p-4 border border-white/5 rounded-xl bg-slate-900/30 text-center">
                        <p className="text-[11px] text-slate-500 font-mono">
                            Galeria uzupełnia się automatycznie przy każdej publikacji artykułu przez publisher.
                            Obrazy przechowywane na <span className="text-orange-400">Cloudflare Images</span> · Oceny zapisywane lokalnie (D1 backend — wkrótce)
                        </p>
                    </div>

                </div>
            </div>

            {/* ── Lightbox ── */}
            {lightbox !== null && (
                <Lightbox
                    item={filtered[lightbox]}
                    onClose={closeLightbox}
                    onPrev={prevItem}
                    onNext={nextItem}
                />
            )}
        </>
    );
};

export default Gallery;
