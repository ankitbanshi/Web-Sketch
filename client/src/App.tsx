import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import CreateJoinRoom from "./components/Forms/createRoom";
import io from "socket.io-client";
import Whiteboard from "./components/whiteBoard";
import Userbar from "./components/userbar/userBar";
import ClientRoom from "./pages/clientRoom";

const server = "http://localhost:5000";

const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: Infinity,
  timeout: 10000,
  transports: ["websocket"],
};

interface User {
  id: string;
  username: string;
  presenter?: boolean;
  room?: string;
}

interface RoomUser {
  roomId: string;
  userName: string;
  host: boolean;
  presenter: boolean;
}

const App = () => {
  const [socket] = useState(() => io(server, connectionOptions));

  const uuid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return S4() + S4() + "-" + S4() + "-" + S4();
  };

  const [userNo, setUserNo] = useState(0);
  const [roomJoined, setRoomJoined] = useState(false);
  const [user, setUser] = useState<User>({
    id: uuid(),
    username: "",
    presenter: false,
    room: "",
  });

  const [users, setUsers] = useState<any[]>([]);
  const [drawingHistory, setDrawingHistory] = useState<any[]>([]);

  // Join Room
  useEffect(() => {
    if (roomJoined && user.room) {
      socket.emit("user-joined", {
        roomId: user.room,
        userName: user.username,
        host: false,
        presenter: user.presenter,
      });
      socket.emit("join_room", user.room);
    }
  }, [roomJoined, user, socket]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
      setUserNo((prev) => prev + 1);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
      setUserNo((prev) => Math.max(0, prev - 1));
    });

    socket.on("users", (users: any[]) => setUsers(users));
    socket.on("drawing_history", (history: any[]) => setDrawingHistory(history));
    socket.on("canvasImage", (data: any) =>
      setDrawingHistory((prev) => [...prev, data])
    );

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("users");
      socket.off("drawing_history");
      socket.off("canvasImage");
      socket.close();
    };
  }, [socket]);

  const handleSetUser = (roomUser: RoomUser) => {
    setUser({
      id: uuid(),
      username: roomUser.userName,
      presenter: roomUser.presenter,
      room: roomUser.roomId,
    });
  };

  return (
    <div className="home">
      <ToastContainer />
      {roomJoined ? (
        <>
          <Userbar users={users} user={user} socket={socket} userNo={userNo} />
          {user.presenter ? (
            <Whiteboard
              user={user}
              socket={socket}
              drawingHistory={drawingHistory}
              setDrawingHistory={setDrawingHistory}
            />
          ) : (
            <ClientRoom
              socket={socket}
              drawingHistory={drawingHistory}
              userNo={userNo}
            />
          )}
        </>
      ) : (
        <CreateJoinRoom
          uuid={uuid}
          setUser={handleSetUser}
          setRoomJoined={setRoomJoined}
        />
      )}
    </div>
  );
};

export default App;
