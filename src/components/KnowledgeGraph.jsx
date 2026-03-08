import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const WORKER_URL = "https://r2-public-mybonzo.stolarnia-ams.workers.dev";

// Custom styles for our nodes
const nodeStyle = {
  background: 'rgba(15, 23, 42, 0.8)',
  color: '#06b6d4',
  border: '1px solid rgba(6, 182, 212, 0.3)',
  borderRadius: '8px',
  padding: '10px',
  fontSize: '12px',
  fontFamily: 'monospace',
  boxShadow: '0 0 15px rgba(6, 182, 212, 0.1)',
  width: 180,
  textAlign: 'center',
};

const centerNodeStyle = {
  ...nodeStyle,
  background: '#06b6d4',
  color: '#000',
  fontWeight: 'bold',
  border: '2px solid #0891b2',
  width: 200,
  fontSize: '14px',
};

const initialNodes = [
  { 
    id: 'center', 
    position: { x: 500, y: 300 }, 
    data: { label: '🧠 JIMBO_CORE_HUB' }, 
    style: centerNodeStyle 
  },
];

const initialEdges = [];

export default function KnowledgeGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isLoading, setIsLoading] = useState(true);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${WORKER_URL}/api/posts`);
        if (!response.ok) throw new Error('Worker offline');
        const posts = await response.json();

        const newNodes = [
            { 
                id: 'center', 
                position: { x: 600, y: 400 }, 
                data: { label: '🧠 JIMBO_CORE_HUB' }, 
                style: centerNodeStyle 
            }
        ];
        const newEdges = [];

        // Define main system nodes
        const systems = [
            { id: 'agent-zero', label: '🤖 AGENT_ZERO', color: '#f472b6', x: 200, y: 200 },
            { id: 'graph-rag', label: '📊 GRAPH_RAG', color: '#a78bfa', x: 1000, y: 200 },
            { id: 'r2-storage', label: '🗄️ R2_STORAGE', color: '#4ade80', x: 600, y: 100 }
        ];

        systems.forEach(sys => {
            newNodes.push({
                id: sys.id,
                position: { x: sys.x, y: sys.y },
                data: { label: sys.label },
                style: { ...nodeStyle, borderColor: sys.color, color: sys.color }
            });
            newEdges.push({
                id: `e-center-${sys.id}`,
                source: 'center',
                target: sys.id,
                animated: true,
                style: { stroke: sys.color, strokeWidth: 2 }
            });
        });

        // Distribute blog posts around systems
        posts.forEach((post, index) => {
          const angle = (index / posts.length) * 2 * Math.PI;
          const radius = 350;
          const x = 600 + radius * Math.cos(angle);
          const y = 400 + radius * Math.sin(angle);

          newNodes.push({
            id: post.id,
            position: { x, y },
            data: { label: post.title },
            style: { 
                ...nodeStyle,
                fontSize: '10px',
                width: 160
            }
          });

          // Connect to R2 storage node
          newEdges.push({
            id: `e-r2-${post.id}`,
            source: 'r2-storage',
            target: post.id,
            animated: false,
            style: { stroke: 'rgba(255, 255, 255, 0.1)' }
          });
        });

        setNodes(newNodes);
        setEdges(newEdges);
      } catch (e) {
        console.error("Failed to load graph data:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="w-full h-[800px] bg-[#05070a] border border-white/5 rounded-3xl overflow-hidden relative shadow-2xl">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        colorMode="dark"
      >
        <Controls className="bg-slate-900 border-white/10" />
        <MiniMap 
            nodeStrokeColor={(n) => n.style?.borderColor || '#06b6d4'} 
            nodeColor={(n) => n.style?.background || '#141414'} 
            maskColor="rgba(0,0,0,0.7)"
            className="bg-slate-900 border-white/10"
        />
        <Background variant="dots" gap={20} size={1} color="rgba(6, 182, 212, 0.15)" />
        
        <Panel position="top-left" className="bg-black/40 backdrop-blur-md p-4 border border-white/5 rounded-xl text-cyan-500 font-mono">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-sm font-bold tracking-widest">JIMBO_NEURAL_MAP v1.5</span>
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-tight">
                Active Nodes: {nodes.length} | Status: Synchronized
            </div>
        </Panel>

        <Panel position="bottom-right" className="bg-black/40 backdrop-blur-md p-3 border border-white/5 rounded-xl text-[10px] text-slate-500 font-mono max-w-[200px]">
            [SYSTEM_LOG]: Knowledge graph successfully synthesized from R2 metadata stream...
        </Panel>
      </ReactFlow>
    </div>
  );
}
