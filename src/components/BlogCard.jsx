import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Chip, Button, Image } from "@heroui/react";

const BlogCard = ({ blog, index, isFeatured }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
        >
            <div
                className={`group relative rounded-2xl overflow-hidden flex flex-col h-full bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all ${isFeatured ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-900/20' : ''}`}
            >
                {/* Header Content (Move Above Image) */}
                <div className="p-6 pb-2 z-10">
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-3">
                        <Calendar size={14} />
                        <span>{blog.date}</span>
                        <span>•</span>
                        <span className="text-cyan-400">{blog.category}</span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {blog.title}
                    </h3>
                    
                    {blog.subtitle && (
                        <p className="text-slate-300 text-sm mb-3 font-medium line-clamp-2 italic">
                            {blog.subtitle}
                        </p>
                    )}
                </div>

                {/* Image Section (Now Under Title) */}
                <div className={`relative w-full overflow-hidden mx-auto px-4 ${isFeatured ? 'h-64 md:h-80' : 'h-48'}`}>
                    <Image
                        src={blog.image}
                        alt={blog.title}
                        radius="lg"
                        loading="eager"
                        as="img"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 border border-white/5 shadow-inner"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-40 z-10 pointer-events-none" />
                </div>

                {/* Footer Content */}
                <div className="p-6 pt-4 flex-1 flex flex-col z-10">
                    <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                        {blog.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                        {blog.tech.slice(0, 3).map((tech, i) => (
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
