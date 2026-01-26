import React, { useState } from 'react';
// Build 2026-01-26-v2
import { Button, Input, Select, SelectItem, Card } from "@heroui/react";
import BlogCard from '../components/BlogCard';
import { SidebarLeft, SidebarRight } from '../components/Sidebars';

import { blogPosts } from '../data/blogPosts';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [visiblePosts, setVisiblePosts] = useState(6);

    // Simulating infinite scroll load
    const loadMore = () => {
        setVisiblePosts(prev => prev + 4);
    };

    // Filter posts
    const filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || post.tags.includes(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    const currentPosts = filteredPosts.slice(0, visiblePosts);
    const hasMore = visiblePosts < filteredPosts.length;

    return (
        <div className="min-h-screen bg-transparent pt-8 pb-12">
            <div className="container mx-auto px-4 max-w-[1920px]">
                {/* -- HERO SECTION (Mobile Only) -- */}
                <div className="lg:hidden text-center mb-12">
                    <h1 className="font-display text-5xl md:text-7xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        JIMBO<span className="text-red-600">77</span>
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mb-6"></div>
                    <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
                        Najnowsze artykuły o AI, automatyzacji, DevOps i rozwoju technologicznym.
                    </p>
                </div>

                {/* -- THE COMMUNITY GRID -- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">

                    {/* -- LEFT FLANK (2 Columns) -- */}
                    <div className="hidden lg:block lg:col-span-2 xl:col-span-2">
                        <SidebarLeft />
                    </div>

                    {/* -- MAIN SECTOR (7 or 8 Columns) -- */}
                    <main className="col-span-1 lg:col-span-10 xl:col-span-7 flex flex-col gap-6">

                        {/* Search & Filter Bar */}
                        <Card className="p-4 bg-black/40 backdrop-blur-xl border border-white/5 sticky top-20 z-30 shadow-2xl shadow-black/50">
                            <div className="flex flex-col md:flex-row gap-4">
                                <Input
                                    classNames={{
                                        base: "w-full",
                                        mainWrapper: "h-full",
                                        input: "text-small",
                                        inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                                    }}
                                    placeholder="Szukaj artykułów..."
                                    size="sm"
                                    startContent={<i className="ri-search-line text-slate-400" />}
                                    value={searchTerm}
                                    onValueChange={setSearchTerm}
                                />
                                <div className="flex gap-2 min-w-[300px]">
                                    <Select
                                        size="sm"
                                        placeholder="Kategoria"
                                        defaultSelectedKeys={["all"]}
                                        className="w-full"
                                    >
                                        <SelectItem key="all" value="all">Wszystkie</SelectItem>
                                        <SelectItem key="ai" value="ai">AI Agents</SelectItem>
                                        <SelectItem key="dev" value="dev">Development</SelectItem>
                                    </Select>
                                    <Select
                                        size="sm"
                                        placeholder="Sortowanie"
                                        defaultSelectedKeys={["newest"]}
                                        className="w-full"
                                    >
                                        <SelectItem key="newest" value="newest">Najnowsze</SelectItem>
                                        <SelectItem key="popular" value="popular">Popularne</SelectItem>
                                    </Select>
                                </div>
                            </div>
                        </Card>

                        {/* Posts Grid with Mixed Layout */}
                        {currentPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {currentPosts.map((post, index) => {
                                    // Make every 3rd post span 2 columns to break monotony (like dev.to)
                                    // Only applying this on larger screens logically via CSS if we added a class, 
                                    // but BlogCard wrapper is standard. 
                                    // Let's force the wrapper div here to span.
                                    const isFeatured = (index % 5 === 0);

                                    return (
                                        <div key={index} className={`col-span-1 ${isFeatured ? 'md:col-span-2' : ''}`}>
                                            <BlogCard
                                                blog={{
                                                    image: post.image,
                                                    topic: post.title,
                                                    category: post.tags[0],
                                                    date: post.date,
                                                    description: post.excerpt,
                                                    tech: post.tags,
                                                    slug: post.slug,
                                                    subtitle: ""
                                                }}
                                                index={index}
                                                isFeatured={isFeatured} // Pass this so card can adapt its inner layout if needed
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-black/20 rounded-xl border border-white/5">
                                <i className="ri-ghost-line text-4xl text-slate-600 mb-4 block"></i>
                                <p className="text-slate-500">Nie znaleziono artykułów spełniających kryteria.</p>
                            </div>
                        )}

                        {/* Infinite Scroll Trigger / Load More */}
                        {hasMore && (
                            <div className="py-8 text-center">
                                <Button
                                    variant="flat"
                                    color="default"
                                    className="w-full h-12 bg-white/5 hover:bg-white/10 text-slate-400 tracking-widest border border-white/5"
                                    onClick={loadMore}
                                >
                                    LOAD MORE DATA...
                                </Button>
                            </div>
                        )}
                        {!hasMore && currentPosts.length > 0 && (
                            <div className="py-8 text-center text-xs text-slate-600 font-mono tracking-widest">
                                /// END OF STREAM ///
                            </div>
                        )}
                    </main>

                    {/* -- RIGHT FLANK (3 Columns) -- */}
                    <div className="hidden xl:block xl:col-span-3">
                        <SidebarRight />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Home;
