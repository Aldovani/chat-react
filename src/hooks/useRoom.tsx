import { useState } from "react";
import { useEffect } from "react";
import { database } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
};

type MessagesType = {
  id: string;
  author: User;
  content: string;
};

function useRoom(params: string) {

  const [messages, setMessages] = useState([{} as MessagesType]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [roomState, setRoomState] = useState<boolean>();
  const [listMembers, setListMembers] = useState([{} as User]);
  const [listOfBaned, setListOfBaned] = useState([{} as User]);
  const [admin, setAdmin] = useState({} as { id: string; name: string });
  useEffect(() => {
    const roomRef = database.ref(`rooms/${params}`);

    roomRef.on("value", (room) => {
      const databaseRoom = room.val();

      const firebaseListMembers = databaseRoom.listMembers ?? [];
      const firebaseListOfBaned = databaseRoom.listOfBaned ?? [];
      const firebaseMessage = databaseRoom.messages ?? {};
      const parsedMessage = Object.entries(firebaseMessage).map(
        ([key, value]: any) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
          };
        }
      );

     
      setTitle(databaseRoom?.title);
      setAdmin({ id: databaseRoom?.authorId, name: databaseRoom?.authorName });
      setMessages(parsedMessage);
      setListOfBaned(firebaseListOfBaned);
      setListMembers(firebaseListMembers);
      setRoomState(databaseRoom?.pauseChat);
      setLoading(false);
    });

  }, [params]);

  return {
    messages,
    roomState,
    loading,
    listMembers,
    admin,
    listOfBaned,
    title,
  };
}

export { useRoom };
