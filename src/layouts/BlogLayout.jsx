import { Progress } from "@heroui/react";

const BlogLayout = ({ children }) => {
    const [scrollProgress, setScrollProgress] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.scrollY;
            setScrollProgress((currentScroll / totalScroll) * 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative min-h-screen">
            {/* Reading Progress Bar */}
            <Progress
                aria-label="Reading progress"
                size="sm"
                value={scrollProgress}
                color="primary"
                className="fixed top-0 left-0 right-0 z-50 rounded-none pointer-events-none"
                classNames={{
                    indicator: "bg-gradient-to-r from-cyan-400 to-blue-600 shadow-[0_0_10px_rgba(34,211,238,0.5)]",
                    track: "bg-transparent"
                }}
            />

            {/* Blog Content Wrapper */}
            <main className="relative z-10 pt-24 pb-20">
                <div className="absolute inset-x-0 top-0 h-[50vh] bg-gradient-to-b from-slate-950/50 to-transparent pointer-events-none" />
                <div className="relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default BlogLayout;
