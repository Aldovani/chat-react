import { FormEvent, useState, useEffect, useRef } from "react";
import {
  Textarea,
  Button,
  Container,
  Box,
  Flex,
  Spinner,
  Center,
  Heading,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import { database } from "../../services/firebase";

import { useRoom } from "../../hooks/useRoom";

import { Message } from "../../components/Message";

import "./styles.scss";
import { ListMembers } from "../../components/ListMembers";
import { useAuth } from "../../hooks/useAuth";
import ClipBoard from "../../components/ClipButton";

type ParamsType = {
  id: string;
};

function Room() {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const params: ParamsType = useParams();
  const { messages, loading, title, admin, roomState } = useRoom(params.id);

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
  function scrollToBottom(behaviorType: ScrollBehavior | undefined) {
    messagesEndRef.current?.scrollTo({
      top: messagesEndRef.current.scrollHeight + 100,
      behavior: behaviorType,
    });
  }

  async function pauseChat() {
    await database.ref(`rooms/${params.id}/`).update({ pauseChat: !roomState });
  }
  useEffect(() => {
    if (loading) return;

    if (messages[messages.length - 1]?.author.id === user?.id) {
      scrollToBottom("smooth");
    }
  }, [messages, loading, user?.id]);

  useEffect(() => {
    scrollToBottom("auto");
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }
  const isAdmin = user?.id === admin.id;

  return (
    <Container as="main" maxW="container.lg">
      <Flex gridGap="2" align="start">
        <Box
          borderRadius="8"
          border="2px"
          flex="5"
          bgColor="#EDEEFF"
          marginTop="1rem"
        >
          <Flex direction="column" height="75vh">
            <Flex
              borderBottom="2px"
              align="center"
              justifyContent="space-around"
            >
              <Heading>{title}</Heading>
           
              <ClipBoard id={ params.id}/>
            </Flex>

            <Flex
              ref={messagesEndRef}
              direction="column"
              align="flex-start"
              overflowY="scroll"
            className="scroll"
            >
              {messages.map((message) => (
                <Message key={message.id} user={user} message={message} />
              ))}
            </Flex>
          </Flex>
          <form onSubmit={handleSendMessage}>
            <Textarea
              spellCheck
              display="block"
              m="0 auto"
              width="98%"
              disabled={roomState && !isAdmin}
              isRequired
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
              resize="none"
              placeholder="Digite sua mensagem"
              maxLength={300}
            ></Textarea>
            <Flex
              padding="0.5rem"
              gridGap="1rem"
              justifyContent="space-evenly"
              alignItems="stretch"
            >
              <Button
                flex="1"
                colorScheme="telegram"
                size="md"
                type="submit"
                disabled={roomState && !isAdmin}
              >
                {roomState && !isAdmin ? `Chat Pausado pelo ADM` : "Enviar"}
              </Button>
              {user?.id === admin.id && (
                <Button
                  Button
                  onClick={pauseChat}
                  flex="1"
                  colorScheme={!roomState ? "yellow" : "orange"}
                  size="md"
                >
                  {!roomState ? "Pausar" : "Despausar"}
                </Button>
              )}
            </Flex>
          </form>
        </Box>
        <ListMembers />
      </Flex>
    </Container>
  );
}

export { Room };
