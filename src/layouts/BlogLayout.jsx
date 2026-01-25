import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const BlogLayout = ({ children }) => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="relative min-h-screen">
            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-20 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 origin-left z-40 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                style={{ scaleX }}
            />

            {/* Blog Content Wrapper */}
            <div className="relative pt-24 pb-20">
                {children}
            </div>
        </div>
    );
};

export default BlogLayout;
