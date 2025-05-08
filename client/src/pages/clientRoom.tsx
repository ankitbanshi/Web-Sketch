import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";
import rough from "roughjs";

const generator = rough.generator();

interface ClientRoomProps {
  socket: Socket;
  drawingHistory: any[];
  userNo: number;
}

const ClientRoom: React.FC<ClientRoomProps> = ({ socket, drawingHistory, userNo }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<any[]>([]);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scale = window.devicePixelRatio;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.scale(scale, scale);
    context.lineCap = "round";
    context.lineWidth = 5;
    setCtx(context);
  }, []);

  // Handle drawing history updates
  useLayoutEffect(() => {
    if (drawingHistory.length > 0) {
      setElements(drawingHistory);
    }
  }, [drawingHistory]);

  // Redraw canvas when elements change
  useLayoutEffect(() => {
    const redrawCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const roughCanvas = rough.canvas(canvas);

      elements.forEach((ele) => {
        if (!ele.element) return;

        switch (ele.element) {
          case "rect":
            roughCanvas.draw(
              generator.rectangle(
                ele.offsetX,
                ele.offsetY,
                ele.width,
                ele.height,
                { stroke: ele.stroke, roughness: 0, strokeWidth: 5 }
              )
            );
            break;
          case "line":
            roughCanvas.draw(
              generator.line(
                ele.offsetX,
                ele.offsetY,
                ele.width,
                ele.height,
                { stroke: ele.stroke, roughness: 0, strokeWidth: 5 }
              )
            );
            break;
          case "pencil":
            roughCanvas.linearPath(ele.path, {
              stroke: ele.stroke,
              roughness: 0,
              strokeWidth: 5,
            });
            break;
        }
      });
    };

    redrawCanvas();
  }, [elements, ctx]);

  // Socket listeners
  useEffect(() => {
    const handleNewDrawing = (data: any) => {
      setElements(prev => [...prev, data]);
    };

    socket.on("canvasImage", handleNewDrawing);
    socket.on("drawing_history", (history: any[]) => {
      setElements(history);
    });

    return () => {
      socket.off("canvasImage", handleNewDrawing);
      socket.off("drawing_history");
    };
  }, [socket]);

  return (
    <div className="container mx-auto p-4">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold">
          Collaborative Whiteboard - Users Online: {userNo}
        </h1>
      </div>
      <div className="flex justify-center mt-5">
        <div className="w-full h-[500px] border border-gray-800 overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full bg-white" />
        </div>
      </div>
    </div>
  );
};

export default ClientRoom;
