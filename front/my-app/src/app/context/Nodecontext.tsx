'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Node {
  id: string;
  name: string;
  status: 'Online' | 'Offline';
  connectedDate: string;
}

interface NodeContextType {
  nodes: Node[];
  addNode: (node: Node) => void;
  deleteNode: (id: string) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
}

const NodeContext = createContext<NodeContextType | undefined>(undefined);

export function NodeProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', name: 'Node 1', status: 'Online', connectedDate: 'Mon March 03 2025' },
    { id: '2', name: 'Node 2', status: 'Online', connectedDate: 'Mon March 03 2025' },
    { id: '3', name: 'Node 3', status: 'Offline', connectedDate: 'Mon March 03 2025' },
  ]);

  const addNode = (node: Node) => {
    setNodes(prevNodes => [...prevNodes, node]);
  };

  const deleteNode = (id: string) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== id));
  };

  const updateNode = (id: string, updates: Partial<Node>) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === id ? { ...node, ...updates } : node
      )
    );
  };

  return (
    <NodeContext.Provider value={{ nodes, addNode, deleteNode, updateNode }}>
      {children}
    </NodeContext.Provider>
  );
}

export function useNodes() {
  const context = useContext(NodeContext);
  if (context === undefined) {
    throw new Error('useNodes must be used within a NodeProvider');
  }
  return context;
}
