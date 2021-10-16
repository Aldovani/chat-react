import { database } from "../../services/firebase";
import {
  Avatar,
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { useRoom } from "../../hooks/useRoom";
import "./styles.scss";
import { useState,memo } from "react";

type User = {
  id: string | undefined;
  name: string;
  avatar: string;
};

type MessageType = {
  id: string;
  author: User;
  content: string;
};

type MessagesType = {
  message: MessageType;
  user: User | undefined;
};

function MessageItem({ message, user }: MessagesType) {
  const [currentMessage, setCurrentMessage] = useState<MessageType>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id }: { id: string } = useParams();
  const { admin } = useRoom(id);

  const isPossibleDeleteMessage =
    admin.id === user?.id || message.author.id === user?.id;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function handleDeleteMessage(key: string | undefined) {
    await database.ref(`rooms/${id}/messages/${key}`).update({});
  }

  return (
    <div
      className={`container-message ${user?.id === message.author.id && "my"}
      ${ admin.id=== message.author.id && "admin"}  
      `}
    >
      <div className="content-message">{message.content}</div>
      <footer>
        <div>
          <Avatar
            src={message.author.avatar}
            title={message.author.name}
            alt={message.author.name}
            size="sm"
            mr="3"
          />
          <span className="message-author">{message.author.name}</span>
        </div>
        {isPossibleDeleteMessage && (
          <IconButton
            background="transparent"
            onClick={() => {
              onOpen();

              setCurrentMessage(message);
            }}
            aria-label="Delete message"
            icon={<AiOutlineDelete />}
          />
        )}
      </footer>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Message</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" align="center" gridGap="1.5rem">
              <Text maxW="100%" noOfLines={4}>
                <strong>Mensagem: </strong>
                {currentMessage?.content}
              </Text>
              <Text>
                <strong>Autor: </strong>
                {currentMessage?.author.name}
              </Text>
            </Flex>
          </ModalBody>

          <ModalFooter marginTop="2rem">
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Fechar
            </Button>

            <Tooltip hasArrow label="Função desabilitada " bg="red.600">
              <Button
                colorScheme="red"
                variant="outline"
                // onClick={() => handleDeleteMessage(currentMessage?.id)}
              >
                Deletar
              </Button>
            </Tooltip>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

  export const Message= memo(MessageItem);
