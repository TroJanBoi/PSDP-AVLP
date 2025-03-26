"use client";

import { useState } from "react";

type DraggableBlockProps = {
  type?: string;
  label?: string;
};

// Assembly instruction explanation
const tooltipMap: Record<string, string> = {
  MOV: "ย้ายค่าจาก source ไปยัง destination เช่น MOV AX, 10",
  ADD: "บวกค่าจาก source ไปยัง destination เช่น ADD AX, BX (AX = AX + BX)",
  SUB: "ลบค่าจาก destination เช่น SUB AX, BX (AX = AX - BX)",
  MUL: "คูณค่ากับ AX เช่น MUL BX (AX = AX * BX)",
  DIV: "หารค่ากับ AX เช่น DIV BX (AX = AX / BX)",
  CMP: "เปรียบเทียบสองค่าก่อน jump เช่น CMP AX, BX",
  JMP: "กระโดดไปยัง label โดยไม่มีเงื่อนไข เช่น JMP loop_start",
  JG: "Jump ถ้า AX > BX (หลังจาก CMP) เช่น JG greater",
  JL: "Jump ถ้า AX < BX เช่น JL smaller",
  JE: "Jump ถ้าเท่ากัน เช่น JE equal",
  LABEL: "จุดหมายของ jump เช่น LABEL loop_start:",
};

export default function DraggableBlock({ type = "default", label = "block" }: DraggableBlockProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const upperLabel = label?.trim().toUpperCase() || "";

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify({ type, label }));
    event.dataTransfer.effectAllowed = "move";
  };

  const handleMouseEnter = () => {
    if (tooltipMap[upperLabel]) setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div
      className="relative mb-3"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-full w-[250px] -translate-x-1/2 mb-2 px-3 py-2 text-wrap bg-gray-900 text-white text-xs rounded shadow-xl z-50 whitespace-nowrap max-w-xs text-center">
          <div className="font-semibold text-yellow-300 mb-1">{upperLabel}</div>
          <div>{tooltipMap[upperLabel]}</div>
        </div>
      )}

      {/* Block */}
      <div
        draggable
        onDragStart={onDragStart}
        className="flex justify-center items-center text-2xl bg-purple-300 hover:bg-primary hover:text-white text-black h-20 p-2 rounded shadow-lg cursor-pointer transition duration-150"
      >
        {label}
      </div>
    </div>
  );
}
