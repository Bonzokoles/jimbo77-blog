import React, { useState, useEffect } from 'react';
// Build 2026-01-28-R2-DYNAMIC
import { Link } from 'react-router-dom';
import { Button, Input, Select, SelectItem, Card, Spinner } from "@heroui/react";
import BlogCard from '../components/BlogCard';
import { SidebarLeft, SidebarRight } from '../components/Sidebars';
import SEO from '../components/SEO';
import SchemaOrg from '../components/SchemaOrg';

import { blogPosts as staticPosts } from '../data/blogPosts';

const WORKER_URL = "https://r2-public-mybonzo.stolarnia-ams.workers.dev";

const Home = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [visiblePosts, setVisiblePosts] = useState(12);
    const [allPosts, setAllPosts] = useState(staticPosts);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDynamicPosts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${WORKER_URL}/api/posts`);
                if (!response.ok) throw new Error('Worker offline');
                const dynamicData = await response.json();
                
                // Map dynamic data to include full R2 URLs
                const mappedDynamic = dynamicData.map(post => ({
                    ...post,
                    image: `${WORKER_URL}${post.image}`,
                    isDynamic: true
                }));

                // Combine and sort by sortDate (newest first)
                const combined = [...staticPosts, ...mappedDynamic]
                    .sort((a, b) => {
                        const dateA = a.sortDate || '2026-01-01';
                        const dateB = b.sortDate || '2026-01-01';
                        return dateB.localeCompare(dateA);
                    })
                    .slice(0, 30);
                setAllPosts(combined);
            } catch (e) {
                console.warn("Using static fallback:", e.message);
                const sorted = [...staticPosts].sort((a, b) => {
                    const dateA = a.sortDate || '2026-01-01';
                    const dateB = b.sortDate || '2026-01-01';
                    return dateB.localeCompare(dateA);
                });
                setAllPosts(sorted);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDynamicPosts();
    }, []);

    const loadMore = () => {
        setVisiblePosts(prev => prev + 4);
    };

    const filteredPosts = allPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (post.description && post.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = selectedCategory === "all" || 
            (post.category === selectedCategory) ||
            (post.tech && post.tech.some(t => t.toLowerCase() === selectedCategory.toLowerCase()));
            
        return matchesSearch && matchesCategory;
    });

    const currentPosts = filteredPosts.slice(0, visiblePosts);
    const hasMore = visiblePosts < filteredPosts.length;

    return (
        <>
            <SEO 
                title="Home"
                description="Polski hub technologiczny AI & DevOps. Blog z case studies, architekturami systemów AI, MCP, Cloudflare Workers AI i multi-agent orchestration."
                url="/"
                type="website"
            />
            <SchemaOrg type="website" />
            <SchemaOrg type="organization" />
            
            <div className="min-h-screen bg-transparent pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-[1920px]">
                <div className="lg:hidden text-center mb-12">
                    <h1 className="font-display text-5xl md:text-7xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        JIMBO<span className="text-red-600">77</span>
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mb-6"></div>
                    <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
                        Dynamiczny Hub AI napędzany przez R2 & Jimbo OS.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
                    <div className="hidden lg:block lg:col-span-2 xl:col-span-2">
                        <SidebarLeft />
                    </div>

                    <main className="col-span-1 lg:col-span-10 xl:col-span-7 flex flex-col gap-6">
                        <Card className="p-4 bg-black/40 backdrop-blur-xl border border-white/5 sticky top-20 z-30 shadow-2xl shadow-black/50">
                            <div className="flex flex-col md:flex-row gap-4">
                                <Input
                                    classNames={{
                                        base: "w-full",
                                        mainWrapper: "h-full",
                                        input: "text-small",
                                        inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                                    }}
                                    placeholder="Szukaj w R2 Hub..."
                                    size="sm"
                                    startContent={<i className="ri-search-line text-slate-400" />}
                                    value={searchTerm}
                                    onValueChange={setSearchTerm}
                                />
                                <div className="flex gap-2 min-w-[300px]">
                                    <Select 
                                        size="sm" 
                                        label="Kategoria" 
                                        defaultSelectedKeys={["all"]} 
                                        className="w-full"
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <SelectItem key="all">Wszystkie</SelectItem>
                                        <SelectItem key="AI News">AI News</SelectItem>
                                        <SelectItem key="AI Odkrycia">AI Odkrycia</SelectItem>
                                        <SelectItem key="AI Nowości">AI Nowości</SelectItem>
                                        <SelectItem key="AI Zastosowania">AI Zastosowania</SelectItem>
                                        <SelectItem key="AI Moje Projekty">AI Moje Projekty</SelectItem>
                                        <SelectItem key="Technologia">Technologia</SelectItem>
                                        <SelectItem key="Inżynieria">Inżynieria</SelectItem>
                                        <SelectItem key="Edukacja">Edukacja</SelectItem>
                                        <SelectItem key="Strategia">Strategia</SelectItem>
                                        <SelectItem key="Funkcje">Funkcje</SelectItem>
                                    </Select>
                                    {isLoading && <Spinner size="sm" color="primary" />}
                                </div>
                            </div>
                        </Card>

                        {currentPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {currentPosts.map((post, index) => {
                                    const isFeatured = (index % 5 === 0);
                                    return (
                                        <div key={post.id || index} className={`col-span-1 ${isFeatured ? 'md:col-span-2' : ''}`}>
                                            <BlogCard
                                                blog={{
                                                    image: post.image,
                                                    title: post.title,
                                                    category: post.category || (post.tech && post.tech[0]),
                                                    date: post.date,
                                                    description: post.description || "Artykuł pobrany dynamicznie z R2 Storage.",
                                                    tech: post.tech || ["R2", "AI"],
                                                    slug: post.slug,
                                                    subtitle: post.subtitle || "",
                                                    isDynamic: post.isDynamic
                                                }}
                                                index={index}
                                                isFeatured={isFeatured}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-black/20 rounded-xl border border-white/5">
                                <p className="text-slate-500">Brak postów w R2 Hub.</p>
                            </div>
                        )}

                        {hasMore && (
                            <div className="py-8 text-center">
                                <Button variant="flat" className="w-full bg-white/5 text-slate-400" onClick={loadMore}>
                                    LOAD MORE DATA...
                                </Button>
                            </div>
                        )}

                        {/* Bottom bar — older posts redirect */}
                        <div className="mt-8 py-6 px-4 bg-black/40 backdrop-blur-xl border border-white/5 rounded-xl text-center">
                            <p className="text-slate-400 text-sm font-mono mb-3">
                                📰 Starsze wpisy i pełne archiwum artykułów znajdziesz na stronie&nbsp;
                                <Link to="/bloghub" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 font-semibold transition-colors">
                                    BLOG
                                </Link>
                            </p>
                            <Button as={Link} to="/bloghub" size="sm" variant="flat"
                                className="bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 font-mono text-[10px] tracking-widest uppercase">
                                🗂️ Przejdź do pełnego archiwum →
                            </Button>
                        </div>
                    </main>

                    <div className="hidden xl:block xl:col-span-3">
                        <SidebarRight />
                    </div>
                </div>

                {/* Full-width bottom bar under grids */}
                <div className="mt-10 py-4 border-t border-white/5 text-center">
                    <p className="text-[11px] text-slate-600 font-mono tracking-wider">
                        JIMBO<span className="text-red-500">77</span>.ORG — AI Community Hub &amp; Blog &nbsp;|&nbsp; Powered by R2 + Cloudflare Workers &nbsp;|&nbsp; © 2026
                    </p>
                </div>
            </div>
        </div>
        </>
    );
};

export default Home;
