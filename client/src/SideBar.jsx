import React, { useRef, useState, useEffect } from "react";

const Sidebar = ({ users, user, socket }) => {
  const sideBarRef = useRef(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Open/close sidebar
  const openSideBar = () => {
    if (sideBarRef.current) {
      sideBarRef.current.style.left = "0";
    }
  };
  const closeSideBar = () => {
    if (sideBarRef.current) {
      sideBarRef.current.style.left = "-100%";
    }
  };

  // Listen for incoming chat messages
useEffect(() => {
  if (!socket) return;
  const handleChatMessage = (msg) => {
    console.log("Received chatMessage:", msg); // <--- THIS LOG
    setChatMessages((prev) => [...prev, msg]);
  };
  socket.on("chatMessage", handleChatMessage);
  return () => socket.off("chatMessage", handleChatMessage);
}, [socket]);
  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Send chat message
const handleSendMessage = (e) => {
  e.preventDefault();
  if (!messageInput.trim()) return;
  console.log("Sending message:", messageInput); // Add this
  socket.emit("sendMessage", messageInput);
  setMessageInput("");
};

  return (
    <>
      {/* Sidebar Open Button */}
      <button
        className="fixed top-6 left-6 z-50 bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-800 transition-colors duration-200"
        onClick={openSideBar}
      >
        Users
      </button>

      {/* Sidebar */}
      <div
        ref={sideBarRef}
        className="fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-blue-900 to-blue-700 bg-opacity-95 shadow-2xl z-40 transition-all duration-300"
        style={{ left: "-100%" }}
      >
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <button
            className="w-full py-2 bg-blue-600 text-white font-bold rounded-b-lg hover:bg-blue-500 transition-colors"
            onClick={closeSideBar}
          >
            Close
          </button>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto mt-6 px-2">
            <h2 className="text-center text-white font-semibold mb-4 text-lg tracking-wide">
              Online Users
            </h2>
            {users.map((usr, index) => (
              <p
                key={index}
                className={`py-2 rounded text-center mb-2 ${
                  usr.id === socket.id
                    ? "bg-blue-500 text-yellow-200 font-bold"
                    : "text-white bg-blue-800"
                }`}
              >
                {usr.username}
                {usr.id === socket.id && " (You)"}
              </p>
            ))}

            {/* Chat Board */}
            <div className="mt-8 border-t border-blue-600 pt-4">
              <h2 className="text-center text-white font-semibold mb-2 text-lg tracking-wide">
                Chat Board
              </h2>
              <div className="h-40 overflow-y-auto bg-blue-800 rounded-lg p-2 mb-2">
                {chatMessages.length === 0 ? (
                  <p className="text-gray-300 text-sm text-center">
                    No messages yet.
                  </p>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`mb-1 text-sm ${
                        msg.user === user?.username
                          ? "text-yellow-200 text-right"
                          : "text-white text-left"
                      }`}
                    >
                      <div
                        className={`inline-block p-2 rounded-lg ${
                          msg.user === user?.username
                            ? "bg-blue-600"
                            : "bg-blue-700"
                        }`}
                      >
                        <span className="font-bold">{msg.user}:</span>{" "}
                        <span>{msg.text}</span>
                        {msg.time && (
                          <div className="text-xs mt-1 opacity-70 text-right">
                            {new Date(msg.time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type message..."
                  className="flex-1 rounded px-2 py-1 text-sm bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 text-sm"
                >
                  Send
                </button>
              </form>
            </div>
            {/* End Chat Board */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
