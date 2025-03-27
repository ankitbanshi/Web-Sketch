import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";

interface ChatBoxProps {
  socket: Socket;
  userNo: number;
}

interface Message {
  id: string;
  username: string;
  text: string;
 
}

const ChatBox: React.FC<ChatBoxProps> = ({ socket, userNo }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("chat message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: socket.id || "unknown id",
        username: `User${userNo}`, 
        text: message,
      
      };
      socket.emit("chat message", newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-96 w-full bg-gray-800 text-white rounded-lg shadow-lg ">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              msg.id === socket.id ? "bg-blue-500 ml-auto" : "bg-gray-700"
            }`}
          >
            <div className="text-sm font-bold">
              {msg.username}
            </div>
            <div>{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center border-t border-gray-700 p-3">
        <input
          type="text"
          className="flex-1 bg-gray-700 text-white p-2 rounded-l-lg outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
