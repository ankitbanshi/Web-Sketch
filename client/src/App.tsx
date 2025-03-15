import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import CreartejoinRoom from "./components/Forms/createRoom";
import io from "socket.io-client";
import Whiteboard from "./components/whiteBoard"
const server = "http://localhost:5000";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: Infinity,
  timeout: 10000,
  transports: ["websocket"],
};  



const socket = io(server, connectionOptions);
const App = () => {
  const [userNo, setUserNo] = useState(0);
  const [roomJoined, setRoomJoined] = useState(false);
  const [user, setUser] = useState({});
  const [users, setUsers] = useState<any[]>([]);

  const uuid = () => {
    var S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    useEffect(() => {
      if (roomJoined) {
        socket.emit("user-joined", user);
      }
    }, [roomJoined]);
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() 
    );
  };

 
  return (
    
       
 <>
        <CreartejoinRoom
          uuid={uuid}
          setRoomJoined={setRoomJoined}
          setUser={setUser}
        /> 
        { <Whiteboard  
        userNo={userNo}
     
        socket={socket}
        setUsers={setUsers}
        setUserNo={setUserNo}/> }
      
      </>
  );
};
export default App;