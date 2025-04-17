import { FaBox } from "react-icons/fa6";
import ChatLists from './ChatLists';
import InputText from './InputText';
import { useEffect, useState } from 'react';
import UserLogin from './UserLogin';
import socket from '../socket'; // 👈 Import socket from separate file

const ChatContainer = () => {
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [chats, setChats] = useState([]);

  useEffect(() => {
    socket.on("chat", (chats) => {
      setChats(chats);
    });

    socket.on("message", (msg) => {
         console.log("New Message Received:", msg);
      setChats((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat");
      socket.off("message");
    };
  }, []);

  const addMessage = (chat) => {
    const newChat = {
      username: localStorage.getItem("user"),
      message: chat,
      avatar: localStorage.getItem("avatar"),
    };
    socket.emit("newMessage", newChat); // 👈 Use the shared socket
  };

  const Logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("avatar");
    setUser('');
  };

  return (
    <div>
      {user ? (
        <div>
          <div className="chats_header">
            <h4>Username: {user}</h4>
            <p>
              <FaBox className="chats_icon" /> ChatApp
            </p>
            <p className="chats_logout" onClick={Logout}>
              <strong>Logout</strong>
            </p>
          </div>

          <ChatLists chats={chats} />
          <InputText addMessage={addMessage} />
        </div>
      ) : (
        <UserLogin setUser={setUser} />
      )}
    </div>
  );
};

export default ChatContainer;
