import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Canvas from "./Canvas";

const Room = ({ userNo, socket, setUsers, setUserNo }) => {
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const [color, setColor] = useState("#2563eb"); // Tailwind blue-600 default color
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [tool, setTool] = useState("pencil");

  useEffect(() => {
    socket.on("message", (data) => {
      toast.info(data.message);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("users", (data) => {
      setUsers(data);
      setUserNo(data.length);
    });
  }, [socket, setUsers, setUserNo]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setElements([]);
    setHistory([]);
  };

  const undo = () => {
    if (elements.length === 0) return;
    setHistory((prevHistory) => [...prevHistory, elements[elements.length - 1]]);
    setElements((prevElements) => prevElements.slice(0, -1));
  };

  const redo = () => {
    if (history.length === 0) return;
    setElements((prevElements) => [...prevElements, history[history.length - 1]]);
    setHistory((prevHistory) => prevHistory.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-4xl font-extrabold text-center text-blue-700">
            React Drawing App
          </h1>
          <p className="text-center text-blue-500 mt-2 text-lg">
            Users online: <span className="font-semibold">{userNo}</span>
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
          {/* Color Picker */}
          <div className="flex items-center space-x-2">
            <label htmlFor="colorPicker" className="text-blue-700 font-semibold">
              Color Picker:
            </label>
            <input
              id="colorPicker"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 rounded border border-blue-300 cursor-pointer"
            />
          </div>

          {/* Tool Selector */}
          <div className="flex space-x-4">
            {["pencil", "line", "rect"].map((t) => (
              <label
                key={t}
                className="flex items-center space-x-1 text-blue-700 font-semibold cursor-pointer"
              >
                <input
                  type="radio"
                  name="tools"
                  value={t}
                  checked={tool === t}
                  onChange={(e) => setTool(e.target.value)}
                  className="cursor-pointer"
                />
                <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
              </label>
            ))}
          </div>

          {/* Undo, Redo, Clear Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={undo}
              disabled={elements.length === 0}
              className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 
                ${
                  elements.length === 0
                    ? "bg-blue-200 text-blue-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              Undo
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={history.length === 0}
              className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 
                ${
                  history.length === 0
                    ? "bg-blue-200 text-blue-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              Redo
            </button>
            <button
              type="button"
              onClick={clearCanvas}
              className="px-4 py-2 rounded-md font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            >
              Clear Canvas
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-xl shadow-lg p-4">
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
    </div>
  );
};

export default Room;
