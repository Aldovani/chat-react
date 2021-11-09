import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import "./styles.scss";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Flex,
} from "@chakra-ui/react";
import { database } from "../../services/firebase";

const DrawerRooms: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rooms, setRooms] = React.useState<any[]>([]);
  const history = useHistory();

  useEffect(() => {
    const roomRef = database.ref("rooms");
    roomRef.on("value", (room: any) => {
      const databaseRoom = room.val();
      if (databaseRoom) {
        setRooms(
          Object.entries(databaseRoom)?.map(([key, value]: any) => {
            const { title } = value;
            return {
              title,
              id: key,
            };
          })
        );
      } else {
        setRooms([]);
      }
    });

    return () => {
      roomRef.off("value");
    };
  }, []);
  return (
    <>
      <p onClick={onOpen}>Entrar em uma sala existente</p>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Salas</DrawerHeader>

          <DrawerBody>
            <Flex direction="column" gridGap="1rem">
              {rooms?.map((room: any) => (
                <Button
                  key={room.id}
                  onClick={() => {
                    history.push(`/rooms/${room.id}`);
                  }}
                >
                  <Flex width="100%" align={"center"} justify={"space-evenly"}>
                    <p>{room.title}</p>
                  </Flex>
                </Button>
              ))}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export { DrawerRooms };
