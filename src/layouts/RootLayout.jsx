import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Background from '../components/Background';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const RootLayout = () => {
    return (
        <>
            {/* Background — fixed, z-0, osobna warstwa */}
            <Background />
            
            {/* Cała treść — relative, z-10, ponad tłem */}
            <div className="min-h-screen text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col relative z-10">
                <ScrollToTop />
                <Navbar />
                <main className="flex-grow relative">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </>
    );
};

export default RootLayout;
