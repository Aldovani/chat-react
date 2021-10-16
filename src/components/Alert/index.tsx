import {
  Flex,
  Avatar,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

type User = {
  name: string;
  id: string;
  avatar: string;
};

type AlertProps = {
  text: string;
  func: () => void;
  icon: JSX.Element;
  user: User;
};
function Alert({ user, text, icon, func }: AlertProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>{icon}</Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              User
            </AlertDialogHeader>

            <AlertDialogBody>
              <Flex direction="column" align="center">
                <Avatar src={user.avatar} />
                <p>
                  Deseja <strong>{text}</strong> {user.name}
                </p>
              </Flex>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Fechar
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  func();
                  onClose();
                }}
                ml={3}
              >
                {text}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export { Alert };
