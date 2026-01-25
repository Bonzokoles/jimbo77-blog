import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import RootLayout from './layouts/RootLayout';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route element={<RootLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
