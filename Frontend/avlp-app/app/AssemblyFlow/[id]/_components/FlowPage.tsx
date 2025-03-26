"use client";

import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  Connection,
  Edge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import TextUpdaterNode from "./textUpdaterNode";

const nodeTypes = {
  updater: TextUpdaterNode,
};

type FlowBlockProps = {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  onNodesChange: any;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onEdgesChange: any;
};

const Flow_Block = ({
  nodes,
  setNodes,
  onNodesChange,
  edges,
  setEdges,
  onEdgesChange,
}: FlowBlockProps) => {
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget?.getBoundingClientRect();
      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) return;

      const { type, label } = JSON.parse(data);
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: Node = {
        id: crypto.randomUUID(),
        type,
        position,
        data: {
          label,
          value: "",
          onChange: (id: string, value: string) => {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === id
                  ? { ...node, data: { ...node.data, value } }
                  : node
              )
            );
          },
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete") {
        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => !edge.selected));
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setNodes, setEdges]);

  return (
    <div className="w-full h-full" onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Flow_Block;
