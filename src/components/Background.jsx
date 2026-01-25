import React from 'react';

const Background = () => {
    return (
        <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none bg-[#000000]">
            {/* Global Faint Grid (Consistent with Footer) */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Spotlight Grid Pattern (High contrast areas) */}
            <div
                className="absolute inset-0 opacity-[0.12]"
                style={{
                    backgroundImage: `linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: `radial-gradient(circle at 20% 30%, black 0%, transparent 40%), 
                               radial-gradient(circle at 80% 70%, black 0%, transparent 35%),
                               radial-gradient(circle at 50% 50%, black 0%, transparent 25%)`
                }}
            />

            {/* Deep Cyber Gradients */}
            <div className="absolute inset-0">
                <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-cyan-500/10 rounded-full blur-[150px] mix-blend-screen" />
                <div className="absolute bottom-[10%] right-[-5%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute top-[40%] right-[15%] w-[35%] h-[35%] bg-[#ff00ff]/05 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            {/* Noise/Grain Texture */}
            <div
                className="absolute inset-0 opacity-[0.04] mix-blend-soft-light"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />
        </div>
    );
};

export default Background;
