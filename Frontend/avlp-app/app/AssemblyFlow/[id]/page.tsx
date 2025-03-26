"use client";
import Navbar from "@/components/Navbar";
import Flow_Block from "./_components/FlowPage";
import DraggableBlock from "./_components/DraggableBlock";
import { ReactFlowProvider, useNodesState, useEdgesState } from "reactflow";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";

export default function AssemblyflowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "start",
      type: "default",
      position: { x: 150, y: 50 },
      data: {
        label: "START",
        value: "",
        hasError: false,
        onChange: () => { },
      },
    },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [resultLog, setResultLog] = useState<string[]>([]);

  const handleRunClick = useCallback(() => {
    const variables: Record<string, number> = {};
    const log: string[] = [];
    const visited: Set<string> = new Set();
    const errorNodes = new Set<string>();
  
    const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  
    const inEdges: Record<string, string[]> = {};
    const outEdges: Record<string, string[]> = {};
  
    edges.forEach((edge) => {
      if (!inEdges[edge.target]) inEdges[edge.target] = [];
      if (!outEdges[edge.source]) outEdges[edge.source] = [];
      inEdges[edge.target].push(edge.source);
      outEdges[edge.source].push(edge.target);
    });
  
    const labelMap: Record<string, string> = {};
    nodes.forEach((node) => {
      const label = node.data?.label?.trim();
      const value = node.data?.value?.trim();
      if (label === "LABEL" && value) {
        const labelName = value.replace(":", "").trim();
        labelMap[labelName] = node.id;
      }
    });
  
    const queue: string[] = ["start"];
    let lastCompareResult: number | null = null;
    let runCount = 0;
    const MAX_RUN = 1000;
  
    while (queue.length > 0) {
      if (++runCount > MAX_RUN) {
        log.push("❌ Infinite loop detected. Execution stopped.");
        break;
      }
  
      const nodeId = queue.shift()!;
      const node = nodeMap[nodeId];
      if (!node) continue;
  
      const name = node.data?.label?.trim();
      const raw = node.data?.value?.trim();
      if (!name || (!raw && name !== "START")) continue;
  
      const inputReady = (inEdges[nodeId] || []).every((srcId) => visited.has(srcId));
      if ((inEdges[nodeId]?.length ?? 0) > 0 && !inputReady) {
        queue.push(nodeId);
        continue;
      }
  
      visited.add(nodeId);
  
      const fail = (msg: string) => {
        log.push(`❌ ${msg}`);
        errorNodes.add(nodeId);
      };
  
      const mark = (msg: string) => log.push(msg);
  
      const getVal = (token: string): number | undefined => {
        return isNaN(Number(token)) ? variables[token] : parseFloat(token);
      };
  
      if (name === "MOV") {
        const [varName, valueToken] = raw.split(",").map(s => s.trim());
        const value = getVal(valueToken);
        if (value === undefined || isNaN(value)) {
          fail(`MOV ${varName}, ${valueToken} (invalid number)`);
        } else {
          variables[varName] = value;
          mark(`✅ MOV ${varName} = ${value}`);
        }
      }
  
      if (name === "ADD" || name === "SUB" || name === "MUL" || name === "DIV") {
        const [varName, valueToken] = raw.split(",").map(s => s.trim());
  
        const a = variables[varName];
        const b = getVal(valueToken);
  
        if (a === undefined) {
          fail(`${name} ${varName}, ${valueToken} (undefined variable ${varName})`);
          continue;
        }
  
        if (b === undefined || isNaN(b)) {
          fail(`${name} ${varName}, ${valueToken} (invalid value)`);
          continue;
        }
  
        if (name === "DIV" && b === 0) {
          fail(`DIV ${varName}, ${valueToken} (division by zero)`);
          continue;
        }
  
        const result =
          name === "ADD" ? a + b :
          name === "SUB" ? a - b :
          name === "MUL" ? a * b :
          a / b;
  
        variables[varName] = result;
        mark(`✅ ${name} ${varName} = ${a} ${name === "ADD" ? "+" : name === "SUB" ? "-" : name === "MUL" ? "*" : "/"} ${b} = ${result}`);
      }
  
      if (name === "LABEL") {
        const labelName = raw.replace(":", "").trim();
        // mark(`LABEL ${labelName} defined here`);
      }
  
      if (name === "JMP") {
        const labelName = raw.trim();
        const target = labelMap[labelName];
        if (!target) {
          fail(`JMP ${labelName} (label not found)`);
        } else {
          mark(`JMP ${labelName} → ${target}`);
          queue.unshift(target);
        }
        continue;
      }
  
      if (name === "CMP") {
        const [left, right] = raw.split(",").map(s => s.trim());
        const a = getVal(left);
        const b = getVal(right);
        if (a === undefined || b === undefined || isNaN(a) || isNaN(b)) {
          fail(`CMP ${left}, ${right} (invalid compare)`);
          continue;
        }
        lastCompareResult = a - b;
        // mark(`CMP ${a} vs ${b} → result = ${lastCompareResult}`);
      }
  
      const jumpIf = (cond: boolean, jumpType: string, labelName: string) => {
        const target = labelMap[labelName];
        if (!target) {
          fail(`${jumpType} ${labelName} (label not found)`);
          return;
        }
        // mark(`${jumpType} ${labelName} → condition = ${cond}`);
        if (cond) queue.unshift(target);
      };
  
      if (["JE", "JNE", "JG", "JL", "JGE", "JLE"].includes(name)) {
        const labelName = raw.trim();
        if (lastCompareResult === null) {
          fail(`${name} ${labelName} (no CMP before jump)`);
          continue;
        }
        switch (name) {
          case "JE": jumpIf(lastCompareResult === 0, name, labelName); break;
          case "JNE": jumpIf(lastCompareResult !== 0, name, labelName); break;
          case "JG": jumpIf(lastCompareResult > 0, name, labelName); break;
          case "JL": jumpIf(lastCompareResult < 0, name, labelName); break;
          case "JGE": jumpIf(lastCompareResult >= 0, name, labelName); break;
          case "JLE": jumpIf(lastCompareResult <= 0, name, labelName); break;
        }
        continue;
      }
  
      (outEdges[nodeId] || []).forEach((targetId) => {
        queue.push(targetId);
      });
    }
  
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          hasError: errorNodes.has(node.id),
        },
      }))
    );
  
    setResultLog(log);
    console.log("Variables:", variables);
    console.log("nodes:", nodes);
    console.log("edges:", edges);
  }, [nodes, edges]);
  

  return (
    <div className="h-screen flex flex-col w-screen">
      <Navbar Topic={""} btnRun={true} />
      <div className="flex-1 p-10">
        <div className="flex h-full justify-start items-center rounded-xl">
          <div className="w-1/4 h-full border-4 border-primary text-white rounded-xl mr-5 p-5">
            {/* ["MOV", "ADD", "SUB", "MUL", "DIV", "CMP", "JE", "JNE", "JG", "JL", "JGE", "JLE", "LABEL", "JMP"] */}
            {["MOV", "ADD", "MUL", "CMP", "JG", "LABEL"].map((label) => (
              <DraggableBlock key={label} label={label} type="updater" />
            ))}

            <Button onClick={handleRunClick}>Run</Button>
            <Button>Submit</Button>t
          </div>
          <div className="flex flex-col w-full h-full text-white rounded-r-xl">
            <div className="w-full h-2/3 border-4 border-primary rounded-xl mb-5 overflow-hidden relative">
              <ReactFlowProvider>
                <Flow_Block
                  nodes={nodes}
                  setNodes={setNodes}
                  onNodesChange={onNodesChange}
                  edges={edges}
                  setEdges={setEdges}
                  onEdgesChange={onEdgesChange}
                />
              </ReactFlowProvider>
            </div>
            <div className="w-full h-1/3 bg-gray-800 rounded-xl p-4 text-white overflow-auto">
              <h2 className="font-bold mb-2">Result:</h2>
              {resultLog.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}