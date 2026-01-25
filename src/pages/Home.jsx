import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { Input, Select, SelectItem, Button, Card, CardBody } from "@heroui/react";
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';
import { blogPosts } from '../data/blogPosts';

const blogs = blogPosts.map(blog => ({
    ...blog,
    topic: blog.title,
    description: blog.excerpt,
    subtitle: blog.title,
    tech: blog.tags || [],
    image: `https://picsum.photos/seed/${blog.slug}/800/600`
}));

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(new Set(['All']));
    const [selectedMonth, setSelectedMonth] = useState(new Set(['All']));
    const [selectedYear, setSelectedYear] = useState(new Set(['All']));
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const categories = ['All', 'Featured', ...new Set(blogs.map(blog => blog.category))];

    // Extract unique Months and Years from ISO date format (YYYY-MM-DD)
    const allMonths = blogs.map(blog => {
        const date = new Date(blog.date);
        return date.toLocaleString('pl-PL', { month: 'long' });
    });
    const allYears = blogs.map(blog => {
        const date = new Date(blog.date);
        return date.getFullYear().toString();
    });
    const months = ['All', ...new Set(allMonths)];
    const years = ['All', ...new Set(allYears)];

    const categoryValue = Array.from(selectedCategory)[0];
    const monthValue = Array.from(selectedMonth)[0];
    const yearValue = Array.from(selectedYear)[0];

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesCategory = true;
        if (categoryValue === 'Featured') {
            matchesCategory = blog.featured;
        } else if (categoryValue !== 'All') {
            matchesCategory = blog.category === categoryValue;
        }

        const blogDate = new Date(blog.date);
        const blogMonth = blogDate.toLocaleString('pl-PL', { month: 'long' });
        const blogYear = blogDate.getFullYear().toString();
        const matchesMonth = monthValue === 'All' || blogMonth === monthValue;
        const matchesYear = yearValue === 'All' || blogYear === yearValue;

        return matchesSearch && matchesCategory && matchesMonth && matchesYear;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
    const paginatedBlogs = filteredBlogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 relative">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-end justify-start gap-4 mb-6"
                    >
                        <img
                            src="/apple-touch-icon.png"
                            alt="JIMBO77"
                            className="w-32 h-32 md:w-40 md:h-40"
                            style={{
                                filter: 'drop-shadow(0 8px 24px rgba(6, 182, 212, 0.5))'
                            }}
                        />
                        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-logo leading-none pb-0 -mb-2 translate-y-[5px] translate-x-[30px]">
                            JIMBO77_AI_social_club
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 text-lg max-w-2xl"
                    >
                        Najnowsze artykuły o AI, automatyzacji, DevOps i rozwoju technologicznym.
                    </motion.p>
                </div>

                {/* Filters & Search - Sticky */}
                <div className="sticky top-20 z-30 py-4 mb-12 -mx-6 px-6 md:mx-0 md:px-0">
                    <Card className="bg-slate-900/40 backdrop-blur-xl border-slate-800/50 shadow-2xl">
                        <CardBody className="p-4">
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                {/* Search */}
                                <Input
                                    isClearable
                                    className="flex-1"
                                    placeholder="Szukaj artykułów..."
                                    startContent={<Search size={18} className="text-slate-500" />}
                                    value={searchTerm}
                                    onValueChange={(value) => {
                                        setSearchTerm(value);
                                        setCurrentPage(1);
                                    }}
                                    variant="bordered"
                                    classNames={{
                                        input: "text-white",
                                        inputWrapper: "border-slate-800 hover:border-cyan-500/50 focus-within:!border-cyan-500 transition-colors bg-slate-900/50",
                                    }}
                                />

                                <div className="flex flex-row items-center gap-2 w-full md:w-auto overflow-x-auto scrollbar-none">
                                    {/* Categories Select */}
                                    <Select
                                        className="min-w-[150px]"
                                        selectedKeys={selectedCategory}
                                        onSelectionChange={(keys) => {
                                            setSelectedCategory(keys);
                                            setCurrentPage(1);
                                        }}
                                        variant="bordered"
                                        aria-label="Kategoria"
                                        classNames={{
                                            trigger: "border-slate-800 hover:border-cyan-500/50 transition-colors bg-slate-900/50",
                                            value: "text-slate-300",
                                            popoverContent: "bg-slate-900 border-slate-800 text-slate-300"
                                        }}
                                    >
                                        {categories.map(category => (
                                            <SelectItem key={category} value={category}>{category}</SelectItem>
                                        ))}
                                    </Select>

                                    {/* Month Select */}
                                    <Select
                                        className="min-w-[130px]"
                                        selectedKeys={selectedMonth}
                                        onSelectionChange={(keys) => {
                                            setSelectedMonth(keys);
                                            setCurrentPage(1);
                                        }}
                                        variant="bordered"
                                        aria-label="Miesiąc"
                                        classNames={{
                                            trigger: "border-slate-800 hover:border-cyan-500/50 transition-colors bg-slate-900/50",
                                            value: "text-slate-300",
                                            popoverContent: "bg-slate-900 border-slate-800 text-slate-300"
                                        }}
                                    >
                                        <SelectItem key="All" value="All">Miesiąc</SelectItem>
                                        {months.filter(m => m !== 'All').map(month => (
                                            <SelectItem key={month} value={month}>{month}</SelectItem>
                                        ))}
                                    </Select>

                                    {/* Year Select */}
                                    <Select
                                        className="min-w-[110px]"
                                        selectedKeys={selectedYear}
                                        onSelectionChange={(keys) => {
                                            setSelectedYear(keys);
                                            setCurrentPage(1);
                                        }}
                                        variant="bordered"
                                        aria-label="Rok"
                                        classNames={{
                                            trigger: "border-slate-800 hover:border-cyan-500/50 transition-colors bg-slate-900/50",
                                            value: "text-slate-300",
                                            popoverContent: "bg-slate-900 border-slate-800 text-slate-300"
                                        }}
                                    >
                                        <SelectItem key="All" value="All">Rok</SelectItem>
                                        {years.filter(y => y !== 'All').map(year => (
                                            <SelectItem key={year} value={year}>{year}</SelectItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Content Layout with Sidebar */}
                <div className="flex gap-8 relative items-start">
                    {/* Main Grid */}
                    <div className="flex-1">
                        {paginatedBlogs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {paginatedBlogs.map((blog, index) => (
                                    <div key={blog.id} className="relative group h-full">
                                        <div className={`relative h-full rounded-2xl overflow-hidden border transition-all duration-300 ${blog.featured
                                            ? 'border-transparent shadow-lg shadow-purple-500/20'
                                            : 'border-slate-800 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10'
                                            }`}>
                                            {/* Featured Gradient Background */}
                                            {blog.featured && (
                                                <>
                                                    <div className="absolute inset-0 bg-slate-950 z-0" />
                                                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-purple-900/40 z-0" />
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 z-0" />
                                                    {/* Border Gradient */}
                                                    <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-slate-800 via-slate-800 to-purple-500/50 -z-10" />
                                                </>
                                            )}

                                            {/* Featured Tag */}
                                            {blog.featured && (
                                                <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-cyan-400 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg tracking-wider">
                                                    <Sparkles size={10} className="text-yellow-400 fill-yellow-400" />
                                                    Wyróżnione
                                                </div>
                                            )}

                                            <div className="relative z-10 h-full">
                                                <BlogCard blog={blog} index={index} isFeatured={blog.featured} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-slate-500">
                                Nie znaleziono artykułów spełniających kryteria.
                            </div>
                        )}
                    </div>

                    {/* Sticky Pagination Sidebar */}
                    <div className="hidden xl:block sticky top-96 h-fit">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
