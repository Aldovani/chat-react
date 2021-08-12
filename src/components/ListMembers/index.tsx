import { useState } from "react";

import { useParams } from "react-router-dom";
import { IoBan } from "react-icons/io5";
import { database } from "../../services/firebase";
import { RiAdminLine } from "react-icons/ri";
import { CgUnblock } from "react-icons/cg";
import "./styles.scss";
import { useRoom } from "../../hooks/useRoom";
import { useAuth } from "../../hooks/useAuth";
import { Avatar } from "@chakra-ui/react";

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
  const { loading, listMembers, listOfBaned, admin } = useRoom(params.id);
  const { user } = useAuth();

  async function handleUnblock(user: User) {
    alert(user.name);
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

  if (loading) {
    return <div>carregando</div>;
  }

  return (
    <div className="list">
      <div>
        <button onClick={() => setListState(true)}>Membros</button>

        <button onClick={() => setListState(false)}>Bloqueados</button>
      </div>

      {listState ? (
        <ul>
          {listMembers.map((listUser, i) => (
            <li key={i}>
              <Avatar src={listUser.avatar} alt={listUser.name} />
              <p title={listUser.name}>{listUser.name}</p>
              {isAdmin && listUser.id !== user?.id && (
                <button onClick={() => handleBlock(listUser)}>
                  <IoBan size="1.5rem" />
                </button>
              )}
              {admin.id === listUser.id && (
                <span title="Admin" className="admin">
                  <RiAdminLine />
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <ul>
          {listOfBaned.map((user, index) => (
            <li key={index}>
              <img src={user.avatar} alt="" />
              <p title={user.name}>{user.name}</p>
              <button onClick={() => handleUnblock(user)}>
                <CgUnblock size="1.5rem" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { ListMembers };
