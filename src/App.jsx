import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import Graph from './pages/Graph';
import RootLayout from './layouts/RootLayout';

import Logs from './pages/Logs';
import Core from './pages/Core';
import Community from './pages/Community';
import Tools from './pages/Tools';

const App = () => {
    return (
        <Router>
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
        </Router>
    );
};

export default App;
