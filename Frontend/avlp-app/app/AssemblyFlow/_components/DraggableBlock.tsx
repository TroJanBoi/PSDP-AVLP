export default function DraggableBlock({type = "default", label="block"}) {
    const onDragStart = (event: React.DragEvent) => {
        event.dataTransfer.setData("application/reactflow", JSON.stringify({ type, label }));
        event.dataTransfer.effectAllowed = "move";
    }
    
    return (
        <div
            draggable
            onDragStart={onDragStart}
            className="flex justify-center items-center text-4xl hover:bg-primary hover:text-white bg-secondary h-20 text-black p-2 rounded mb-2 shadow-lg focus:ring-4 focus:ring-secondary cursor-pointer"
        >
            {label}
        </div>
    )
}