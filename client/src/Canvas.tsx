import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import rough from "roughjs";
import { Socket } from "socket.io-client";

const generator = rough.generator();
interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>;
  color: string;
  elements: CanvasElement[];
  setElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
  tool: "pencil" | "line" | "rect";
  socket: Socket;
  roomId?: string;
}

interface CanvasElement {
  element: "pencil" | "line" | "rect";
  offsetX: number;
  offsetY: number;
  width?: number;
  height?: number;
  stroke: string;
  path?: [number, number][];
}

const Canvas: React.FC<CanvasProps> = ({
  canvasRef,
  ctx,
  color,
  elements,
  setElements,
  tool,
  socket,
  roomId
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const elementsRef = useRef(elements);
  elementsRef.current = elements;

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
    context.strokeStyle = color;
    context.lineWidth = 5;
    ctx.current = context;
  }, []);

  // Color update
  useEffect(() => {
    if (ctx.current) {
      ctx.current.strokeStyle = color;
    }
  }, [color]);

  // Socket listeners for real-time updates
  useEffect(() => {
    const handleIncomingDrawing = (data: string) => {
      const img = new Image();
      img.onload = () => {
        ctx.current?.drawImage(img, 0, 0);
      };
      img.src = data;
    };

    const handleHistory = (history: CanvasElement[]) => {
      setElements(history);
    };

    socket.on("canvasImage", handleIncomingDrawing);
    socket.on("drawing_history", handleHistory);

    return () => {
      socket.off("canvasImage", handleIncomingDrawing);
      socket.off("drawing_history", handleHistory);
    };
  }, [socket]);

  // Drawing handlers
  const createElement = (offsetX: number, offsetY: number): CanvasElement => {
    const baseElement = {
      element: tool,
      offsetX,
      offsetY,
      stroke: color,
    };

    if (tool === "pencil") {
      return { ...baseElement, path: [[offsetX, offsetY]] };
    }
    return baseElement;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setElements(prev => [...prev, createElement(offsetX, offsetY)]);
    setIsDrawing(true);
  };

  const updateElement = (offsetX: number, offsetY: number) => {
    setElements(prev => prev.map((ele, index) => 
      index === prev.length - 1 ? updateCurrentElement(ele, offsetX, offsetY) : ele
    ));
  };

  const updateCurrentElement = (ele: CanvasElement, x: number, y: number) => {
    switch (ele.element) {
      case "rect":
        return { ...ele, width: x - ele.offsetX, height: y - ele.offsetY };
      case "line":
        return { ...ele, width: x, height: y };
      case "pencil":
        return { ...ele, path: [...ele.path!, [x, y] as [number, number]] };
      default:
        return ele;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    updateElement(offsetX, offsetY);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    // Send final element to server
    const lastElement = elementsRef.current[elementsRef.current.length - 1];
    socket.emit("drawing", lastElement);
  };

  // Canvas rendering
  useLayoutEffect(() => {
    const redrawCanvas = () => {
      const roughCanvas = rough.canvas(canvasRef.current!);
      ctx.current?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      
      elements.forEach(ele => {
        if (!ele.element) return;
        
        switch (ele.element) {
          case "rect":
            roughCanvas.draw(generator.rectangle(
              ele.offsetX, ele.offsetY, ele.width??0, ele.height??0, 
              { stroke: ele.stroke, roughness: 0, strokeWidth: 5 }
            ));
            break;
          case "line":
            roughCanvas.draw(generator.line(
              ele.offsetX, ele.offsetY, ele.width ?? 0, ele.height ?? 0,
              { stroke: ele.stroke, roughness: 0, strokeWidth: 5 }
            ));
            break;
          case "pencil":
            roughCanvas.linearPath(ele.path!, {
              stroke: ele.stroke,
              roughness: 0,
              strokeWidth: 5,
            });
            break;
        }
      });
    };

    redrawCanvas();
  }, [elements]);

  return (
    <div
      className="col-md-8 overflow-hidden border border-dark px-0 mx-auto mt-3"
      style={{ height: "500px" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;
