import { FormEvent, useState, useEffect, useRef } from "react";
import {
  Textarea,
  Button,
  Flex,
  Spinner,
  Center,
  Grid,
} from "@chakra-ui/react";
import { useHistory, useParams } from "react-router-dom";

import { database } from "../../services/firebase";

import { useRoom } from "../../hooks/useRoom";

import { Message } from "../../components/Message";

import "./styles.scss";
import { ListMembers } from "../../components/ListMembers";
import { useAuth } from "../../hooks/useAuth";
import MenuChat from "../../components/MenuChat";
type ParamsType = {
  id: string;
};

function Room() {
  const history = useHistory();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const params: ParamsType = useParams();
  const { messages, loading, admin, roomState } = useRoom(params.id);

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

    async function handleListRoom() {
      const roomExists = await database.ref(`rooms/${params.id}`).get();
      const ArrayListMemberBaned = roomExists.val().listOfBaned;
      const ArrayListMember = roomExists.val().listMembers;
      const isBanned = ArrayListMemberBaned?.some((e: any) => e.id === user?.id);
      const notIncludeList = !ArrayListMember?.some((e: any) => e.id === user?.id);

      if (isBanned) {
        history.push("/");
        return;
      }

      if (notIncludeList) {
        await database.ref(`rooms/${params.id}`).update({
          listMembers: [...ArrayListMember, { ...user }],
        });
      }
    }

    handleListRoom();
  }, [messages, loading, user, params.id, history]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }
  const isAdmin = user?.id === admin.id;

  function handleClearChat() {
    database
      .ref(`rooms/${params.id}/messages`)
      .remove()
      .then(() => {
        alert("Chat limpo com sucesso");
      })
      .catch((err) => {
        alert("Erro ao limpar o chat");
      });
  }
  return (
    <Grid templateColumns="3.5fr 1fr" align="start">
      <Grid
        // border="2px"
        bgColor="#EDEEFF"
        templateRows=" 3fr .5fr"
        className="container"
      >
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
        <form onSubmit={handleSendMessage}>
          <Textarea
            spellCheck
            display="block"
            m=" auto"
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
              // <Button
              //   Button
              //   onClick={}

              //   colorScheme={!roomState ? "yellow" : "orange"}
              //   size="md"
              // >

              // </Button>
              <MenuChat
                actions={{
                  pauseChat: pauseChat,
                  clearChat: handleClearChat,
                }}
              />
            )}
          </Flex>
        </form>
      </Grid>

      <ListMembers />
    </Grid>
  );
}

export { Room };
