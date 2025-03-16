"use client";

import React, { useCallback, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// คำสั่งที่ใช้ใน Node-RED
const availableInstructions: string[] = [
  "MOV A, 5",
  "ADD A, 10",
  "SUB A, 3",
  "MOV B, 7",
  "ADD B, 5"
];

const initialNodes: Node[] = [
  { id: "1", type: "input", data: { label: "Start" }, position: { x: 250, y: 50 }, connectable: true },
  { id: "2", type: "MOV A, 5", data: { label: "MOV A, 5" }, position: { x: 250, y: 100 }, connectable: true },
  { id: "3", type: "ADD A, 10", data: { label: "ADD A, 10" }, position: { x: 250, y: 200 }, connectable: true },
];

const initialEdges: Edge[] = [];

const CustomNode = ({ data }: { data: { label: string } }) => {
  return (
    <div style={{
      padding: "10px", 
      border: "1px solid black", 
      borderRadius: "5px", 
      background: "lightgray",
      textAlign: "center"
    }}>
      {data.label}
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

function AssemblyFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // ฟังก์ชันสำหรับเพิ่ม Node ใหม่
  const addInstructionNode = (instruction: string) => {
    const newNode: Node = {
      id: uuidv4(),
      type: "custom",
      data: { label: instruction },
      position: { x: 150, y: nodes.length * 80 + 100 },
      connectable: true,
    };
    setNodes((nds) => [...nds, newNode]); // เพิ่ม Node ใหม่
  };

  // ฟังก์ชันในการเชื่อมโยง Nodes
  // ฟังก์ชันในการเพิ่ม Edge
const onConnect = useCallback(
  (params: Connection | Edge) => {
    // เพิ่ม Edge และอัปเดตเส้นเชื่อม
    setEdges((eds) => addEdge(params, eds));
  },
  [setEdges]
);


  // ฟังก์ชันเมื่อคลิกที่ Node
  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const runSimulation = async () => {
    const instructions = nodes
      .filter((node) => node.data.label)
      .map((node) => node.data.label);

    if (instructions.length === 0) {
      alert("No instructions to execute");
      return;
    }

    try {
      const response = await axios.post("http://localhost:9898/asm/execute", { instructions });
      alert(`Result: ${response.data.result}`);
      console.log(response.data.result);
      console.log(instructions);

    } catch (error) {
      alert("Error executing assembly instructions");
      console.error(error);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "200px", padding: "10px", borderRight: "1px solid #ccc" }}>
        <h3>Available Instructions</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {availableInstructions.map((instr, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <button onClick={() => addInstructionNode(instr)} style={{ width: "100%", padding: "8px" }}>
                {instr}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}  // เชื่อมโยงระหว่าง Node
          nodeTypes={nodeTypes}
          style={{ width: "100%", height: "100%" }}
          connectionLineStyle={{ stroke: 'black', strokeWidth: 2 }}
          onNodeClick={onNodeClick}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>

        {selectedNode && (
          <div style={{ padding: "10px", borderLeft: "1px solid #ccc", width: "300px" }}>
            <h3>Node Details</h3>
            <p><strong>Label:</strong> {selectedNode.data.label}</p>
            <p><strong>ID:</strong> {selectedNode.id}</p>
            <p><strong>Position:</strong> X: {selectedNode.position.x}, Y: {selectedNode.position.y}</p>
            <p><strong>Description:</strong> {selectedNode.data.label} is a sample assembly instruction.</p>
          </div>
        )}
        <button onClick={runSimulation} style={{ margin: "10px" }}>
          Run Assembly Code
        </button>
      </div>
    </div>
  );
}

export default AssemblyFlow;
