import React, { useRef } from "react";
import { Socket } from "socket.io-client";

interface User {
  id: string;
  username: string;
}

interface userBarProps {
  users: User[];
  user: User;
  socket: Socket;
}

const userBar: React.FC<userBarProps> = ({ users,  socket }) => {
  const userBarRef = useRef<HTMLDivElement | null>(null);

  const openUserBar = () => {
    if (userBarRef.current) {
      userBarRef.current.style.left = "0";
    }
  };

  const closeUserBar = () => {
    if (userBarRef.current) {
      userBarRef.current.style.left = "-100%";
    }
  };

  return (
    <>
      <button
        className="absolute top-5 left-5 bg-gray-800 text-white px-3 py-1 text-sm rounded"
        onClick={openUserBar}
      >
        Users
      </button>
      <div
        className="fixed top-0 left-[-100%] h-full w-40 bg-gray-900 text-white transition-all duration-300 z-50"
        ref={userBarRef}
      >
        <button
          className="w-full py-2 bg-gray-700 text-white hover:bg-gray-600"
          onClick={closeUserBar}
        >
          Close
        </button>
        <div className="w-full mt-5 text-center">
          {users.map((usr) => (
            <p key={usr.id} className="py-2 border-b border-gray-700">
              {usr.username}
              {usr.id === socket.id && " - (You)"}
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

export default userBar;