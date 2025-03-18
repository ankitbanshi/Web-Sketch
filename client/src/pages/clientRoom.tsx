import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";

interface ClientRoomProps {
  userNo: number;
  socket: Socket;
  setUsers: (users: { id: string; username: string }[]) => void;
  setUserNo: (num: number) => void;
}

const ClientRoom: React.FC<ClientRoomProps> = ({ userNo, socket, setUsers, setUserNo }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    socket.on("message", (data: { message: string }) => {
      toast.info(data.message);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("users", (data: { id: string; username: string }[]) => {
      setUsers(data);
      setUserNo(data.length);
    });
  }, [socket, setUsers, setUserNo]);

  useEffect(() => {
    const updateCanvasImage = (data: string) => {
      if (imgRef.current) {
        imgRef.current.src = data;
      }
    };
  
    socket.on("canvasImage", updateCanvasImage);
  
    // Cleanup listener when component unmounts
    return () => {
      socket.off("canvasImage", updateCanvasImage);
    };
  }, [socket]);
  

  return (
    <div className="container mx-auto p-4">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold">
          React Drawing App - Users Online: {userNo}
        </h1>
      </div>
      <div className="flex justify-center mt-5">
        <div className="w-3/4 h-[500px] border border-gray-800 overflow-hidden">
          <img ref={imgRef} src="" alt="Canvas Image" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default ClientRoom;