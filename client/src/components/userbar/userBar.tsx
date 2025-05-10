import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import ChatBox from "../chat";

interface User {
  id: string;
  username: string;
  room?: string;
}

interface UserBarProps {
  user: User;
  socket: Socket;
}

const UserBar: React.FC<UserBarProps> = ({ socket, user }) => {
  const userBarRef = useRef<HTMLDivElement>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleUsersUpdate = (updatedUsers: User[]) => {
      setUsers(updatedUsers.filter(u => u.room === user.room));
    };

    socket.on("newUserResponse", handleUsersUpdate);
    
    // Request initial user list
    socket.emit("getUsers");

    return () => {
      socket.off("newUserResponse", handleUsersUpdate);
    };
  }, [socket, user.room]);

  const toggleUserBar = () => {
    setIsOpen(!isOpen);
    if (userBarRef.current) {
      userBarRef.current.style.transform = `translateX(${isOpen ? "-100%" : "0"})`;
    }
  };

  return (
    <>
      <button
        className="absolute top-5 left-5 bg-gray-800 text-white px-3 py-1 text-sm rounded z-50"
        onClick={toggleUserBar}
      >
        {isOpen ? "Close" : "Users"} ({users.length})
      </button>
      
      <div
        className="fixed top-0 left-0 h-full w-72 bg-gray-900 text-white transition-transform duration-300 z-40 flex flex-col"
        ref={userBarRef}
        style={{ transform: "translateX(-100%)" }}
      >
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Participants</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {users.map((usr) => (
            <div 
              key={usr.id}
              className="py-2 px-4 mb-2 rounded hover:bg-gray-800 transition-colors"
            >
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {usr.username}
                {usr.id === socket.id && (
                  <span className="ml-2 text-gray-400 text-sm">(You)</span>
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 p-4">
          <ChatBox 
            socket={socket}
            userNo={users.length}
            roomId={user.room || ""}
            username={user.username}
          />
        </div>
      </div>
    </>
  );
};

export default UserBar;
