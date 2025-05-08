import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Canvas from "../Canvas";

interface WhiteboardProps {
  user: any;
  socket: any;
  drawingHistory: any[];
  setDrawingHistory: React.Dispatch<React.SetStateAction<any[]>>;
}

interface ElementType {
  element: "pencil" | "line" | "rect";
  offsetX: number;
  offsetY: number;
  width?: number;
  height?: number;
  stroke: string;
  path?: [number, number][];
}


const Whiteboard: React.FC<WhiteboardProps> = ({ 
  user, 
  socket, 
  drawingHistory,
  setDrawingHistory
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const [color, setColor] = useState<string>("#000000");
  const [elements, setElements] = useState<ElementType[]>([]);
  const [tool, setTool] = useState<"pencil" | "line" | "rect">("pencil");

  // Handle initial drawing history
  useEffect(() => {
    if (drawingHistory.length > 0) {
      setElements(drawingHistory);
    }
  }, [drawingHistory]);

  // Socket listeners for real-time updates
  useEffect(() => {
    const handleNewDrawing = (element: ElementType) => {
      setElements(prev => [...prev, element]);
    };

    const handleFullHistory = (history: ElementType[]) => {
      setElements(history);
    };

    socket.on("canvasImage", handleNewDrawing);
    socket.on("drawing_history", handleFullHistory);

    return () => {
      socket.off("canvasImage", handleNewDrawing);
      socket.off("drawing_history", handleFullHistory);
    };
  }, [socket]);

  const clearCanvas = () => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    setElements([]);
    setDrawingHistory([]);
    socket.emit("clear_canvas", user.room);
  };

  const undo = () => {
    setElements(prev => {
      if (prev.length === 0) return prev;
      const newElements = prev.slice(0, -1);
      socket.emit("drawing_update", { room: user.room, elements: newElements });
      return newElements;
    });
  };

  const redo = () => {
    setElements(prev => {
      if (drawingHistory.length <= prev.length) return prev;
      const newElement = drawingHistory[prev.length];
      return [...prev, newElement];
    });
  };

  return (
    <div className="flex flex-col items-center w-full p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Collaborative Whiteboard - Room: {user.room}
      </h1>

      {user?.presenter && (
        <div className="flex flex-wrap items-center justify-center gap-4 bg-white shadow-lg p-4 rounded-lg w-full max-w-4xl">
          {/* Toolbar components remain the same */}
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Color:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 p-1 border rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-3">
            {["pencil", "line", "rect"].map((t) => (
              <label
                key={t}
                className={`px-4 py-2 text-sm font-medium border rounded-lg cursor-pointer ${
                  tool === t ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="tools"
                  value={t}
                  checked={tool === t}
                  onChange={(e) => setTool(e.target.value as typeof tool)}
                  className="hidden"
                />
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg disabled:opacity-50"
              disabled={elements.length === 0}
              onClick={undo}
            >
              Undo
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg disabled:opacity-50"
              disabled={drawingHistory.length === elements.length}
              onClick={redo}
            >
              Redo
            </button>
          </div>

          <button
            className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg"
            onClick={clearCanvas}
          >
            Clear Canvas
          </button>
        </div>
      )}

      <div className="mt-6 w-full max-w-4xl bg-white p-4 shadow-md rounded-lg">
      <Canvas
  canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
  ctx={ctx}
  color={color}
  elements={elements}
  setElements={setElements}
  tool={tool}
  socket={socket}
  roomId={user.room}
/>

      </div>
    </div>
  );
};

export default Whiteboard;
