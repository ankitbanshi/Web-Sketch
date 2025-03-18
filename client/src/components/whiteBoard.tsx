import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Canvas from "../Canvas";

interface WhiteboardProps {
  user: any;
  userNo: number;
  socket: any; // Consider using a proper type for the socket if available
  setUsers: React.Dispatch<React.SetStateAction<any[]>>;
  setUserNo: React.Dispatch<React.SetStateAction<number>>;
}

interface ElementType {
  element: "pencil" | "line" | "rect";
  offsetX?: number;
  offsetY?: number;
  width?: number;
  height?: number;
  stroke: string;
  d?: string; // Path data for future shapes
}

const Whiteboard: React.FC<WhiteboardProps> = ({ user, userNo, socket, setUsers, setUserNo }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const [color, setColor] = useState<string>("#000000");
  const [elements, setElements] = useState<ElementType[]>([]);
  const [history, setHistory] = useState<ElementType[]>([]);
  const [tool, setTool] = useState<"pencil" | "line" | "rect">("pencil");
  const[Image,setImage]=useState<null>(null)

  useEffect(() => {
    socket.on("message", (data: { message: string }) => {
      toast.info(data.message);
    });
    return () => {
      socket.off("message");
    };
  }, [socket]);
useEffect(() => {
    socket.on("WhiteBoardDataResponse", (data: any) => {
      setImage(data);
    });
    return () => {
      socket.on("WhiteBoardDataResponse");
    };
}, [socket]);


  useEffect(() => {
    socket.on("users", (data: any[]) => {
      setUsers(data);
      setUserNo(data.length);
    });

    return () => {
      socket.off("users");
    };
  }, [socket, setUsers, setUserNo]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setElements([]);
  };

 const undo = () => {
  setElements((prevElements) => {
    if (prevElements.length === 0) return prevElements;
    
    setHistory((prevHistory) => [...prevHistory, prevElements[prevElements.length - 1]]);
    return prevElements.slice(0, -1);
  });
};

  const redo = () => {
    if (history.length === 0) return;
    setElements((prevElements) => [...prevElements, history[history.length - 1]]);
    setHistory((prevHistory) => prevHistory.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center w-full p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        React Drawing App - Users Online: <span className="text-blue-500">{userNo}</span>
      </h1>

      {user?.presenter && (
  <div className="flex flex-wrap items-center justify-center gap-4 bg-white shadow-lg p-4 rounded-lg w-full max-w-4xl">
    {/* Color Picker */}
    <div className="flex items-center gap-2">
      <label className="text-gray-700 font-medium">Color:</label>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-10 h-10 p-1 border rounded-lg cursor-pointer"
      />
    </div>

    {/* Tool Selection */}
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
            id={t}
            value={t}
            checked={tool === t}
            onChange={(e) => setTool(e.target.value as "pencil" | "line" | "rect")}
            className="hidden"
          />
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </label>
      ))}
    </div>

    {/* Undo / Redo Buttons */}
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
        disabled={history.length < 1}
        onClick={redo}
      >
        Redo
      </button>
    </div>

    {/* Clear Canvas */}
    <button
      className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg"
      onClick={clearCanvas}
    >
      Clear Canvas
    </button>
  </div>
)}

      {/* Canvas */}
      <div className="mt-6 w-full max-w-4xl bg-white p-4 shadow-md rounded-lg">
        <Canvas
          canvasRef={canvasRef}
          ctx={ctx}
          color={color}
          setElements={setElements}
          elements={elements}
          tool={tool}
          socket={socket}
        />
      </div>
    </div>
  );
};

export default Whiteboard;
