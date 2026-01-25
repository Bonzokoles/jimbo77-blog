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
            <div className="relative pt-24 pb-20">
                {children}
            </div>
        </div>
    );
};

export default BlogLayout;
