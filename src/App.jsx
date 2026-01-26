import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import RootLayout from './layouts/RootLayout';

import Logs from './pages/Logs';
import Core from './pages/Core';
import Community from './pages/Community';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route element={<RootLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/logs" element={<Logs />} />
                    <Route path="/core" element={<Core />} />
                    <Route path="/community" element={<Community />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
