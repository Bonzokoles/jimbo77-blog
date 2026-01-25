import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const RootLayout = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col">
            <ScrollToTop />
            <Navbar />
            <main className="flex-grow relative">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default RootLayout;
