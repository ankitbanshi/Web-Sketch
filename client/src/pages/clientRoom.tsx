import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";

interface ClientRoomProps {
  userNo: number;
  socket: Socket;
  setUsers: (users: { id: string; username: string }[]) => void;
  setUserNo: (num: number) => void;
}

const ClientRoom: React.FC<ClientRoomProps> = ({
  userNo,
  socket,
  setUsers,
  setUserNo,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [canvasImage, setCanvasImage] = useState<string | null>(null);

  // Show incoming messages as toast notifications
  useEffect(() => {
    socket.on("message", (data: { message: string }) => {
      toast.info(data.message);
    });

    return () => {
      socket.off("message");
    };
  }, [socket]);

  // Update user list and count
  useEffect(() => {
    socket.on("users", (data: { id: string; username: string }[]) => {
      setUsers(data);
      setUserNo(data.length);
    });

    return () => {
      socket.off("users");
    };
  }, [socket, setUsers, setUserNo]);

  // Update canvas image
  useEffect(() => {
    const updateCanvasImage = (data: string) => {
      setCanvasImage(data);
    };

    socket.on("canvasImage", updateCanvasImage);

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
        <div className="w-3/4 h-[500px] border border-gray-800 overflow-hidden bg-white">
          {canvasImage && (
            <img
              ref={imgRef}
              src={canvasImage}
              alt="Canvas Image"
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientRoom;
