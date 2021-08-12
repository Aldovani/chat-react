import { useState } from "react";
import { useEffect } from "react";
import { database } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
};

type MessagesType = {
  author: User;
  content: string;
};

function useRoom(params: string) {
  const [messages, setMessages] = useState([{} as MessagesType]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [listMembers, setListMembers] = useState([{} as User]);
  const [listOfBaned, setListOfBaned] = useState([{} as User]);
  const [admin, setAdmin] = useState({} as { id: string; name: string });

  useEffect(() => {
    const roomRef = database.ref(`rooms/${params}`);

    roomRef.on("value", (room) => {
      const databaseRoom = room.val();
      const firebaseAuthorId = databaseRoom.authorId ?? "";
      const firebaseTitle = databaseRoom.title ?? "";
      const firebaseAuthorName = databaseRoom.authorName ?? "";
      const firebaseListMembers = databaseRoom.listMembers ?? [];
      const firebaseListOfBaned = databaseRoom.listOfBaned ?? [];
      const firebaseMessage = databaseRoom.messages ?? {};
      const parsedQuestions = Object.entries(firebaseMessage).map(
        ([key, value]: any) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
          };
        }
      );
      setTitle(firebaseTitle);
      setAdmin({ id: firebaseAuthorId, name: firebaseAuthorName });
      setMessages(parsedQuestions);
      setListOfBaned(firebaseListOfBaned);
      setListMembers(firebaseListMembers);
      setLoading(false);
    });
    return () => {
      roomRef.off("value");
    };
  }, [params]);

  return { messages, loading, listMembers, admin, listOfBaned, title };
}

export { useRoom };
