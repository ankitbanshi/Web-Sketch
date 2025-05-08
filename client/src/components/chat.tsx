import React, { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

interface ChatBoxProps {
  socket: Socket;
  userNo: number;
  roomId: string;
  username: string;
}

interface Message {
  id: string;
  name: string;
  text: string;
  socketID: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ socket, userNo, roomId, username }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMessageResponse = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("messageResponse", handleMessageResponse);
    
    // Load chat history when joining
    socket.emit("join_room", roomId);

    return () => {
      socket.off("messageResponse", handleMessageResponse);
    };
  }, [socket, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: `${socket.id}${Date.now()}`,
        name: username,
        text: message,
        socketID: socket.id || ""
      };
      
      socket.emit("message", {
        ...newMessage,
        room: roomId
      });
      
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-96 w-full bg-gray-800 text-white rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-semibold">Chat ({userNo} users online)</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg ${
              msg.socketID === socket.id ? "bg-blue-500 ml-auto" : "bg-gray-700"
            }`}
          >
            <div className="text-sm font-bold">
              {msg.socketID === socket.id ? "You" : msg.name}
            </div>
            <div>{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
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
