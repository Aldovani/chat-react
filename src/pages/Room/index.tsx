import { FormEvent, useState, useEffect, useRef } from "react";
import { Textarea, FormControl, Button, Container, Box, Flex } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import { database } from "../../services/firebase";

import { useRoom } from "../../hooks/useRoom";

import { Message } from "../../components/Message";

import "./styles.scss";
import { ListMembers } from "../../components/ListMembers";
import { useAuth } from "../../hooks/useAuth";

type ParamsType = {
  id: string;
};

function Room() {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const params: ParamsType = useParams();
  const { messages, loading,title } = useRoom(params.id);
  
  async function handleSendMessage(event: FormEvent) {
    event.preventDefault();
    if (newMessage.trim() === "") return;

    if (!user) {
      throw new Error("You must be logged in");
    }

    const message = {
      content: newMessage,
      author: {
        name: user.name,
        avatar: user.avatar,
        id: user.id,
      },
    };

    database.ref(`rooms/${params.id}/messages`).push(message);
    setNewMessage("");
  }
  function scrollToBottom(behaviorType: string) {
    if (messagesEndRef !== null) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight + 100,
        behavior: behaviorType,
      });
    }
  }
  // useEffect(() => {
  //   if (loading) return;

  //   if (messages[messages.length - 1]?.author.id === user?.id) {
  //     scrollToBottom("smooth");
  //   }
  // }, [messages, loading, user?.id]);

  // useEffect(() => {
  //   scrollToBottom("auto");
  // }, []);

  const messagesEndRef: any = useRef(null);

  return (
    <Container maxW="container.md" maxH="container.md">
      
        <Box border="1px" className="chat">
          <Flex direction="column">

          <Box borderBottom="2px">{title}
          </Box>
        

          {!loading &&
              messages.map((e, i) => (
                <Message key={i} user={user?.id} messages={e} />
              ))}
        
          <form onSubmit={handleSendMessage}>
            <Textarea
              isRequired
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
              resize="none"
              ></Textarea>
            <Button size="lg" type="submit">
              Enviar
            </Button>
          </form>
              </Flex>
          </Box>
    </Container>
  );
}
    
          {/* <div ref={messagesEndRef} className="chat">
            {!loading &&
              messages.map((e, i) => (
                <Message key={i} user={user?.id} messages={e} />
              ))}
            <div /> */}
          {/* </div> */} 
        {/* <ListMembers /> */}

export { Room };
