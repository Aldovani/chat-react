import { useState } from "react";

import { useParams } from "react-router-dom";
import { IoBan } from "react-icons/io5";
import { database } from "../../services/firebase";
import { CgUnblock } from "react-icons/cg";
import "./styles.scss";
import { useRoom } from "../../hooks/useRoom";
import { useAuth } from "../../hooks/useAuth";
import { Avatar, Box, Button, Flex } from "@chakra-ui/react";
import { Alert } from "../Alert";

type User = {
  id: string;
  name: string;
  avatar: string;
};

type ParamsTypes = {
  id: string;
};

function ListMembers() {
  const params: ParamsTypes = useParams();
  const { listMembers, listOfBaned, admin } = useRoom(params.id);
  const { user } = useAuth();

  async function handleUnblock(user: User) {
    database.ref(`rooms/${params.id}/`).update({
      listOfBaned: [...listOfBaned.filter((e) => e.id !== user.id)],
      listMembers: [...listMembers, user],
    });
  }

  async function handleBlock(user: User) {
    const refDataBase = await database.ref(`rooms/${params.id}/`).get();
    const arrayATT = listMembers.filter((e) => e.id !== user.id);

    if (!refDataBase.val()?.listOfBaned) {
      database.ref(`rooms/${params.id}/`).update({
        listOfBaned: [user],
        listMembers: [...arrayATT],
      });
    } else {
      const listOfBanedNew = refDataBase.val().listOfBaned;
      database.ref(`rooms/${params.id}/`).update({
        listOfBaned: [...listOfBanedNew, user],
        listMembers: [...arrayATT],
      });
    }
  }

  const isAdmin = admin.id === user?.id;
  const [listState, setListState] = useState(true);

  return (
    <Box
      bgColor="#EDEEFF"
      borderLeft="2px solid"
      padding="0.5rem"
      className="list"
      height="100%"
    >
      <Flex justify="space-evenly" gridGap="0.3rem" m="0 0 1rem 0">
        <Button
          flex="1"
          colorScheme="telegram"
          onClick={() => setListState(true)}
        >
          Membros
        </Button>

        <Button
          flex="1"
          colorScheme="telegram"
          onClick={() => setListState(false)}
        >
          Bloqueados
        </Button>
      </Flex>

      {listState ? (
        <ul>
          {listMembers.map((userInfo, i) => (
            <li key={i}>
              <Avatar src={userInfo.avatar} alt={userInfo.name} />
              <p title={userInfo.name}>{userInfo.name}</p>

              {isAdmin && userInfo.id !== user?.id ? (
                <Alert
                  icon={<IoBan size="1.5rem" />}
                  func={() => handleBlock(userInfo)}
                  text="Bloquear"
                  user={userInfo}
                />
              ) : (
                `${i === 0 ? "Admin" : "User"}`
              )}
            </li>
          ))}
        </ul>
      ) : (
        <ul>
          {listOfBaned.length === 0 ? (
            <p className="empty">Vazio </p>
          ) : (
            <>
              {listOfBaned.map((userInfo, index) => (
                <li key={index}>
                  <Avatar src={userInfo.avatar} alt={userInfo.name} />
                  <p title={userInfo.name}>{userInfo.name}</p>
                  {isAdmin && (
                    <Alert
                      func={() => handleUnblock(userInfo)}
                      icon={<CgUnblock size="1.5rem" />}
                      text="Desbloquear"
                      user={userInfo}
                    />
                  )}
                </li>
              ))}
            </>
          )}
        </ul>
      )}
    </Box>
  );
}

export { ListMembers };
