import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { HeroUIProvider } from "@heroui/react";
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import Graph from './pages/Graph';
import RootLayout from './layouts/RootLayout';

import Logs from './pages/Logs';
import Core from './pages/Core';
import Community from './pages/Community';
import Tools from './pages/Tools';

const AppContent = () => {
    const navigate = useNavigate();
    return (
        <HeroUIProvider navigate={navigate}>
            <Routes>
                <Route element={<RootLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/graph" element={<Graph />} />
                    <Route path="/logs" element={<Logs />} />
                    <Route path="/core" element={<Core />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/tools" element={<Tools />} />
                </Route>
            </Routes>
        </HeroUIProvider>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
