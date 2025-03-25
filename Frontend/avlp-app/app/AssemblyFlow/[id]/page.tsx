// ✅ FINAL VERSION with Assembly Simulation Logic - AssemblyflowPage

"use client";
import Navbar from "@/components/Navbar";
import Flow_Block from "./_components/FlowPage";
import DraggableBlock from "./_components/DraggableBlock";
import { ReactFlowProvider, useNodesState, useEdgesState } from "reactflow";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { useParams } from "next/navigation";

export default function AssemblyflowPage() {
  const { problemId } = useParams();

  console.log("Problem ID:", problemId);
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "start",
      type: "default",
      position: { x: 150, y: 50 },
      data: {
        label: "START",
        value: "",
        hasError: false,
        onChange: () => {},
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

    const queue: string[] = ["start"];

    const getInputVal = (token: string, nodeId: string): number | null => {
      const isNumber = !isNaN(Number(token));
      if (isNumber) return Number(token);
      if ((inEdges[nodeId]?.length ?? 0) > 0 && variables[token] !== undefined) {
        return variables[token];
      }
      return null;
    };

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (visited.has(nodeId)) continue;

      const node = nodeMap[nodeId];
      if (!node) continue;
      visited.add(nodeId);

      const name = node.data?.label?.trim();
      const raw = node.data?.value?.trim();
      if (!name || (!raw && name !== "START")) continue;

      const inputReady = (inEdges[nodeId] || []).every((srcId) => visited.has(srcId));
      if ((inEdges[nodeId]?.length ?? 0) > 0 && !inputReady) {
        queue.push(nodeId);
        continue;
      }

      const fail = (msg: string) => {
        log.push(msg);
        errorNodes.add(nodeId);
      };

      const mark = (msg: string) => log.push(msg);

      if (name === "MOV") {
        const [varName, value] = raw.split("=");
        const v = parseFloat(value);
        if (isNaN(v)) {
          fail(`MOV ${varName} = ${value} ❌ (invalid number)`);
        } else {
          variables[varName.trim()] = v;
          mark(`MOV ${varName.trim()} = ${v}`);
        }
      }

      if (["ADD", "SUB", "MUL", "DIV"].includes(name)) {
        const [leftPart, rightExpr] = raw.split("=");
        let outputVar = rightExpr ? leftPart.trim() : `res_${nodeId.slice(0, 4)}`;
        const expression = rightExpr ? rightExpr.trim() : leftPart.trim();
        const [left, right] = expression.split(/[-+*/]/).map((s) => s.trim());

        const leftVal = getInputVal(left, nodeId);
        const rightVal = getInputVal(right, nodeId);

        if (leftVal === null || rightVal === null) {
          fail(`${name} ${outputVar} = ${left} ${name} ${right} ❌ (input not ready)`);
          continue;
        }

        let result: number = 0;
        if (name === "ADD") result = leftVal + rightVal;
        if (name === "SUB") result = leftVal - rightVal;
        if (name === "MUL") result = leftVal * rightVal;
        if (name === "DIV") {
          if (rightVal === 0) {
            fail(`DIV ${outputVar} = ${left} / ${right} ❌ (division by zero)`);
            continue;
          }
          result = leftVal / rightVal;
        }

        variables[outputVar] = result;
        mark(`${name} ${outputVar} = ${left} ${name === "ADD" ? "+" : name === "SUB" ? "-" : name === "MUL" ? "*" : "/"} ${right} = ${result}`);
      }

      if (name === "IF") {
        const parts = raw.split(/(==|!=|>=|<=|>|<)/);
        if (parts.length !== 3) {
          fail(`IF ${raw} ❌ (invalid condition)`);
          continue;
        }
        const [left, op, right] = parts.map((s) => s.trim());
        const leftVal = getInputVal(left, nodeId);
        const rightVal = getInputVal(right, nodeId);

        if (leftVal === null || rightVal === null) {
          fail(`IF ${left} ${op} ${right} ❌ (input not ready)`);
          continue;
        }

        let condition = false;
        switch (op) {
          case "==": condition = leftVal === rightVal; break;
          case "!=": condition = leftVal !== rightVal; break;
          case ">": condition = leftVal > rightVal; break;
          case "<": condition = leftVal < rightVal; break;
          case ">=": condition = leftVal >= rightVal; break;
          case "<=": condition = leftVal <= rightVal; break;
          default:
            fail(`IF ${raw} ❌ (invalid operator)`);
            continue;
        }

        mark(`IF ${left} ${op} ${right} = ${condition}`);
        if (!condition) continue;
      }

      (outEdges[nodeId] || []).forEach((targetId) => {
        if (!visited.has(targetId)) queue.push(targetId);
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
      <Navbar Topic={true} btnRun={true} />
      <div className="flex-1 p-10">
        <div className="flex h-full justify-start items-center rounded-xl">
          <div className="w-1/3 h-full bg-red-500 text-white rounded-xl mr-5 p-5">
            {["MOV", "ADD", "SUB", "MUL", "DIV", "IF"].map((label) => (
              <DraggableBlock key={label} label={label} type="updater" />
            ))}
            <Button onClick={handleRunClick}>Run</Button>
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
            <div className="w-full h-1/3 bg-yellow-500 rounded-xl p-4 text-black overflow-auto">
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
