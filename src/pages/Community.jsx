import React, { useEffect, useState } from 'react';
import { Card, Avatar, Chip, Button, Spinner } from "@heroui/react";

const MOCK_MEMBERS = [
    { name: "Neo_Anderson", role: "Architect", status: "online", bio: "Constructing the matrix, one commit at a time.", stack: ["React", "Node", "AI"] },
    { name: "Trinity_X", role: "DevOps", status: "busy", bio: "CI/CD pipelines are my nervous system.", stack: ["K8s", "Docker", "AWS"] },
];

const BACKEND_URL = 'https://social-app-backend.stolarnia-ams.workers.dev';

const Community = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/users?limit=20`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();

                if (data.success && data.data) {
                    // Start formatting backend data to match UI
                    const formattedDetails = data.data.map(user => ({
                        name: user.display_name || user.email.split('@')[0],
                        role: "Member", // Backend doesn't seem to store role yet
                        status: user.is_online ? "online" : "offline",
                        bio: user.bio || "No bio available yet.",
                        stack: ["Agent", "MCP"], // Placeholder stack
                        avatar: user.avatar_url
                    }));
                    setMembers(formattedDetails);
                } else {
                    setMembers(MOCK_MEMBERS); // Fallback
                }
            } catch (err) {
                console.error("Failed to fetch community members:", err);
                setMembers(MOCK_MEMBERS); // Fallback on error
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    return (
        <div className="min-h-screen pt-8 pb-12 w-full">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="font-display text-5xl md:text-6xl text-white mb-4 tracking-widest">
                        NET<span className="text-cyan-500">RUNNERS</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto font-light">
                        Elitarna społeczność inżynierów, architektów i twórców AI.
                        Dołącz do sieci i wymieniaj wiedzę w czasie rzeczywistym.
                        <span className="block text-xs text-green-500/50 mt-2 font-mono">
                            {loading ? "INITIALIZING_CONNECTION..." : `CONNECTED_TO: ${BACKEND_URL.replace('https://', '')}`}
                        </span>
                    </p>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spinner size="lg" color="success" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {members.map((member, idx) => (
                            <Card key={idx} className="bg-black/40 backdrop-blur-xl border border-white/5 p-6 hover:border-cyan-500/30 transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="relative">
                                        <Avatar
                                            name={member.name}
                                            src={member.avatar}
                                            className="w-16 h-16 text-xl bg-slate-900 border-2 border-slate-800 text-slate-400"
                                        />
                                        <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-black ${member.status === 'online' ? 'bg-green-500 shadow-[0_0_10px_lime]' :
                                                member.status === 'busy' ? 'bg-red-500' :
                                                    member.status === 'away' ? 'bg-yellow-500' : 'bg-slate-600'
                                            }`}></span>
                                    </div>
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        className="bg-cyan-900/10 text-cyan-500 border border-cyan-500/20 font-mono tracking-wider"
                                    >
                                        {member.role.toUpperCase()}
                                    </Chip>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors truncate">
                                    {member.name}
                                </h3>
                                <p className="text-slate-500 text-sm mb-4 h-10 line-clamp-2">
                                    {member.bio}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {member.stack.map(tech => (
                                        <span key={tech} className="text-[10px] px-2 py-1 rounded bg-white/5 text-slate-400 border border-white/5">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <Button className="w-full bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-500 border border-cyan-500/20 font-mono text-xs tracking-widest">
                                    CONNECT_PROTOCOL
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Community;
