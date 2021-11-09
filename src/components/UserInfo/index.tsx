import {
  Avatar,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";


import { useAuth } from "../../hooks/useAuth";
import "./styles.scss";

function UserInfo() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, SingOut } = useAuth();
  return (
    <>
      {user && (
        <div className="container-user-info">
          <Avatar title={user.name} src={user.avatar}  onClick={() => onOpen()} />

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />  
            <ModalContent>
              <ModalHeader>User</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Flex direction="column" align="center" gridGap="1.5rem">
                  <Avatar size="lg" src={user.avatar} alt={user.name} />
                  <Heading size="lg">{user.name}</Heading>
                  <Heading size="sm">{user.email}</Heading>
                </Flex>
              </ModalBody>

              <ModalFooter marginTop="2rem">
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Fechar
                </Button>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    SingOut();
                    onClose();
                  }}
                >
                  Deslogar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      )}
    </>
  );
}

export { UserInfo };
