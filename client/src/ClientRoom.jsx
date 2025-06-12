import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const ClientRoom = ({ userNo, socket, setUsers, setUserNo }) => {
  const imgRef = useRef(null);
  
  useEffect(() => {
    socket.on("message", (data) => {
      toast.info(data.message);
    });
  }, []);

  useEffect(() => {
    socket.on("users", (data) => {
      setUsers(data);
      setUserNo(data.length);
    });
  }, []);

  useEffect(() => {
    socket.on("canvasImage", (data) => {
      imgRef.current.src = data;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow-lg rounded-2xl p-8 mb-10 border-t-8 border-blue-500">
          <h1 className="text-4xl font-extrabold text-center text-blue-700 ">
          WebSketch : A Collaborative Whiteboard
          </h1>
          <div className="text-center mt-4">
            <span className="inline-block bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-full text-lg shadow">
              Online Users: {userNo}
            </span>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex justify-center">
          <div className="w-full md:w-3/4 lg:w-2/3 bg-white rounded-2xl shadow-2xl border-2 border-blue-200 overflow-hidden h-[500px] transition-all duration-300 hover:shadow-blue-300">
            <img 
              className="w-full h-full object-contain bg-gradient-to-br from-blue-100 via-white to-purple-100"
              ref={imgRef} 
              src="" 
              alt="Collaborative canvas" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRoom;
