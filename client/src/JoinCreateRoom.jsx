import React, { useState } from "react";
import { toast } from "react-toastify";

const JoinCreateRoom = ({ uuid, setUser, setRoomJoined }) => {
  const [roomId, setRoomId] = useState(uuid());
  const [name, setName] = useState("");
  const [joinName, setJoinName] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!name) return toast.dark("Please enter your name!");
    
    setUser({
      roomId,
      userId: uuid(),
      userName: name,
      host: true,
      presenter: true,
    });
    setRoomJoined(true);
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!joinName) return toast.dark("Please enter your name!");

    setUser({
      roomId: joinRoomId,
      userId: uuid(),
      userName: joinName,
      host: false,
      presenter: false,
    });
    setRoomJoined(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Collaborative Whiteboard Studio
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Real-time collaboration for creative teams
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center gap-12">
          {/* Create Room Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transition-all hover:shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-blue-600 mb-2">
                Create Session
              </h2>
              <p className="text-gray-600">Start a new collaboration space</p>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="space-y-6">
              <div>
                <label htmlFor="create-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  id="create-name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
                    value={roomId}
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => setRoomId(uuid())}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Session
              </button>
            </form>
          </div>

          {/* Join Room Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transition-all hover:shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-purple-600 mb-2">
                Join Session
              </h2>
              <p className="text-gray-600">Enter an existing collaboration space</p>
            </div>

            <form onSubmit={handleJoinSubmit} className="space-y-6">
              <div>
                <label htmlFor="join-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  id="join-name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="room-id" className="block text-sm font-medium text-gray-700 mb-2">
                  Session ID
                </label>
                <input
                  id="room-id"
                  type="text"
                  placeholder="Enter session ID"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Join Session
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateRoom;
