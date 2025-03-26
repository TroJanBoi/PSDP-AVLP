"use client";

import { useCallback } from "react";
import { Handle, Position, NodeProps } from "reactflow";

const handleStyle = { left: 10 };

function TextUpdaterNode({ id, data, isConnectable }: NodeProps) {
  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      data?.onChange?.(id, evt.target.value);
    },
    [data, id]
  );

  return (
    <div className="bg-white text-black p-3 rounded shadow-lg text-xs">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="mb-2">
        <label htmlFor="text">{data?.label || "Value"}:</label>
        <input
          id="text"
          name="text"
          onChange={onChange}
          defaultValue={data?.value}
          className="nodrag border px-2 py-1 w-full rounded"
        />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" style={handleStyle} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
}

export default TextUpdaterNode;
