import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Bug } from 'lucide-react';
import { Chip, Button, Image } from "@heroui/react";

/**
 * 🕵️‍♂️ JIMBO IMAGE BATTLE-TEST (2026-01-28)
 * Próbujemy 5 metod renderowania, żeby ominąć "czarną dziurę" Cloudflare/R2.
 */
const BlogCard = ({ blog, index, isFeatured }) => {
    // Określamy metodę testową na podstawie ID (numerycznego)
    const numericId = parseInt(blog.id) || (index + 1);
    const testMethod = numericId % 5;

    const renderTestedImage = () => {
        switch (testMethod) {
            case 1: // METODA 1: RAW IMG TAG (BRUTAL FORCE)
                return (
                    <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-full h-full object-cover relative z-[60]" 
                        loading="eager"
                    />
                );
            case 2: // METODA 2: HEROUI IMAGE (DISABLE ALL OVERLAYS)
                return (
                    <Image
                        src={blog.image}
                        alt={blog.title}
                        radius="none"
                        disableSkeleton
                        removeWrapper
                        as="img"
                        className="w-full h-full object-cover relative z-[60]"
                    />
                );
            case 3: // METODA 3: BACKGROUND IMAGE (CORS BYPASS)
                return (
                    <div 
                        className="w-full h-full bg-cover bg-center relative z-[60]"
                        style={{ backgroundImage: `url("${blog.image}")` }}
                    />
                );
            case 4: // METODA 4: IMG WITH CROSSORIGIN
                return (
                    <img 
                        src={blog.image} 
                        alt={blog.title} 
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover relative z-[60]"
                    />
                );
            case 0: // METODA 5: PICTURE TAG WITH FALLBACK
            default:
                return (
                    <picture className="w-full h-full relative z-[60]">
                        <source srcSet={blog.image} type="image/jpeg" />
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                    </picture>
                );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
        >
            <div
                className={`group relative rounded-2xl overflow-hidden flex flex-col h-full bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 hover:shadow-2xl transition-all`}
            >
                {/* Header Content */}
                <div className="p-6 pb-2 z-10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <Calendar size={14} />
                            <span>{blog.date}</span>
                        </div>
                        <Chip size="sm" variant="dot" color="warning" startContent={<Bug size={12}/>}>
                            TEST #{testMethod || 5}
                        </Chip>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {blog.title}
                    </h3>
                </div>

                {/* IMAGE BATTLE-TEST ZONE */}
                <div className={`relative w-full overflow-hidden mx-auto px-4 bg-slate-800 ${isFeatured ? 'h-64 md:h-80' : 'h-48'}`}>
                    {renderTestedImage()}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-40 z-[70] pointer-events-none" />
                </div>

                {/* Footer Content */}
                <div className="p-6 pt-4 flex-1 flex flex-col z-10">
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2 italic">
                        {blog.subtitle || blog.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                        {(blog.tech || []).slice(0, 3).map((tech, i) => (
                            <Chip key={i} size="sm" variant="flat" className="bg-slate-800/50 text-slate-300 border-slate-700">
                                {tech}
                            </Chip>
                        ))}
                    </div>

                    <Button
                        as={Link}
                        to={`/blog/${blog.slug}`}
                        variant="ghost"
                        color="primary"
                        endContent={<ArrowRight size={16} />}
                        className="w-full font-bold uppercase tracking-widest text-xs border-cyan-500/30 text-cyan-400 hover:!bg-cyan-500 hover:!text-white transition-all shadow-lg hover:shadow-cyan-500/20"
                    >
                        Read Article
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default BlogCard;
