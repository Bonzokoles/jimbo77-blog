import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Chip, Button } from "@heroui/react";
import JimboArticleFrame from './JimboArticleFrame';

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
                className={`group relative rounded-2xl overflow-hidden flex flex-col h-full bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 hover:shadow-2xl transition-all shadow-lg`}
            >
                {/* Header Content */}
                <div className="p-6 pb-4 z-10">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase tracking-widest mb-3 font-mono">
                        <Calendar size={12} className="text-cyan-500/50" />
                        <span>{blog.date}</span>
                        {blog.isDynamic && <span className="text-green-500">[R2_LIVE]</span>}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight">
                        {blog.title}
                    </h3>

                    {/* THE FRAME ZONE */}
                    <div className="relative z-50">
                        <JimboArticleFrame
                            src={blog.image}
                            alt={blog.title}
                            className={`${isFeatured ? 'h-64 md:h-80' : 'h-48'}`}
                        />
                    </div>
                </div>

                {/* Footer Content */}
                <div className="p-6 pt-0 flex-1 flex flex-col z-10">
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 italic font-sans border-l border-cyan-500/20 pl-3">
                        {blog.subtitle || blog.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                        {(blog.tech || []).slice(0, 3).map((t, i) => (
                            <Chip key={i} size="sm" variant="flat" className="bg-cyan-950/20 text-cyan-600 text-[10px] border border-cyan-900/30">
                                {t}
                            </Chip>
                        ))}
                    </div>

                    <Button
                        as={Link}
                        to={`/blog/${blog.slug}`}
                        variant="ghost"
                        color="primary"
                        endContent={<ArrowRight size={16} />}
                        className="w-full font-mono text-xs uppercase tracking-widest border-cyan-500/30 text-cyan-400 hover:!bg-cyan-500 hover:!text-white transition-all shadow-lg hover:shadow-cyan-500/20"
                    >
                        Access Protocol
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default BlogCard;
