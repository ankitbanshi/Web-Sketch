import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";

// Define the expected User type from App.tsx
interface User {
  roomId: string;
  userName: string;
  host: boolean;
  presenter: boolean;
}

interface CreateJoinRoomProps {
  uuid: () => string;
  setUser: (user: User) => void;
  setRoomJoined: (joined: boolean) => void;
}



const CreateJoinRoom: React.FC<CreateJoinRoomProps> = ({ uuid, setUser, setRoomJoined }) => {
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState<string>(uuid());
  const [joinName, setJoinName] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setUser({
      roomId,
      userName: userName.trim(),
      host: true,
      presenter: true,
    });
    setRoomJoined(true);
  };

  const handleJoinSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!joinName.trim()) {
      toast.error("Please enter your name");
      return;
    }
   
    setUser({
      roomId: joinRoomId,
      userName: joinName.trim(),
      host: false,
      presenter: false,
    });
    setRoomJoined(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-5 text-gray-800">
      <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full text-gray-900 transform transition duration-300 hover:scale-105">
          <h2 className="text-2xl font-semibold text-blue-600 text-center mb-4">Create Room</h2>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              maxLength={20}
            />
            <div className="flex items-center border border-gray-300 rounded overflow-hidden">
              <input
                type="text"
                className="w-full p-2 outline-none bg-gray-100 text-sm font-mono"
                value={roomId}
                readOnly
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
                type="button"
                onClick={() => setRoomId(uuid())}
              >
                Generate
              </button>
              <CopyToClipboard
                text={roomId}
                onCopy={() => {
                  setCopied(true);
                  toast.success("Room ID copied to clipboard!");
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                <button
                  className={`px-4 py-2 rounded-full transition ${
                    copied ? "bg-green-500" : "bg-gray-700 hover:bg-gray-800"
                  } text-white`}
                  type="button"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </CopyToClipboard>
            </div>
            <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition">
              Create Room
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg w-full text-gray-900 transform transition duration-300 hover:scale-105">
          <h2 className="text-2xl font-semibold text-blue-600 text-center mb-4">Join Room</h2>
          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              maxLength={20}
            />
            <input
              type="text"
              placeholder="Room ID"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value.trim())}
            />
            <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition">
              Join Room
            </button>
          </form>
        </div>
      </div>
      <h1 className="text-4xl p-5 font-bold text-center drop-shadow-lg">
        Create and Collaborate in Real-Time with WebSketch
      </h1>
    </div>
  );
};

export default CreateJoinRoom;