import  { useEffect, useState} from "react";
import {  ToastContainer } from "react-toastify";
import CreartejoinRoom from "./components/Forms/createRoom";
import io from "socket.io-client";
import Whiteboard from "./components/whiteBoard"
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
}

const socket = io(server, connectionOptions);
const App = () => {
  const uuid = () => {
    var S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() 
    );
  };
  const [userNo, setUserNo] = useState<number>(0);
  const [roomJoined, setRoomJoined] = useState(false);
  const [user, setUser] = useState<User>({ id: uuid(), username: "", presenter: false });
  const [users, setUsers] = useState<any[]>([]);
  const [massage,setmessage]=useState<string>("");
  const [messages,setMessages]=useState<string[]>([]);


  



  useEffect(() => {
    if(roomJoined){
      socket.emit("userJoined",user);
    }},[roomJoined]);

    
    useEffect(() => {
      // Listen for messages from server
      socket.on("message", (data: string) => {
        setMessages(prevMessages => [...prevMessages, data]);
      });
    
      socket.on("connect", () => {
        console.log("Connected to server");
        setUserNo(prev => prev + 1);
      });
    
      socket.on("disconnect", () => {
        console.log("Disconnected from server");
        setUserNo(prev => prev - 1);
      });
    
      return () => {
        socket.disconnect();
      };
    }, []);
    
  

 
  return (
  

<div className="home">
  <ToastContainer/>
  {roomJoined?(
    <>
      <Userbar users={users} user={user} socket={socket} userNo={userNo} />{
        user.presenter ? (
        <Whiteboard user={user} userNo={userNo}  socket={socket} setUsers={setUsers} setUserNo={setUserNo}/>
      ):(
          <ClientRoom userNo={userNo} socket={socket} setUsers={setUsers} setUserNo={setUserNo}/>)}
          </> ):(
            <CreartejoinRoom uuid={uuid} setUser={setUser} setRoomJoined={setRoomJoined}/>
          )}

</div>
  );
};
export default App;