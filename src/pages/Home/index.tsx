import {  useState } from "react";
import { useHistory } from "react-router-dom";

//chakara-UI
import {
  Button,
  Flex,
  Input,
  Heading,
  useToast,
  UseToastOptions,
} from "@chakra-ui/react";

//services
import { database } from "../../services/firebase";

//icons react-icons
import { FcGoogle } from "react-icons/fc";
import { IoChatbox } from "react-icons/io5";
import {  IoMdCreate } from "react-icons/io";

//hooks
import { useAuth } from "../../hooks/useAuth";


//components
import { UserInfo } from "../../components/UserInfo";
import {DrawerRooms} from "../../components/DrawerRooms";

//SCSS
import "./styles.scss";

function Home() {
  const { user, signInWithGoogle,loading } = useAuth();
  const history = useHistory();

  const [room, setRoom] = useState("");
  const toastState = {} as UseToastOptions;

  async function logInRoomOrCreate() {
    if (room.trim().length === 0) {
      toastState.description =
        "Digite algo no input para entra ou criar uma sala";
      toastState.status = "info";
      toastState.title = "Informação";

      return;
    }


      const roomRef = database.ref("rooms");

      const firebaseRoom = await roomRef.push({
        title: room,
        authorId: user?.id,
        authorName: user?.name,
        listMembers: [{ ...user }],
        listOfBaned: null,
        pauseChat:false
      });

      toastState.description = `Sala ${room} Criada`;
      toastState.status = "success";
      toastState.title = "Sucesso";

      history.push(`/rooms/${firebaseRoom.key}`);
    
  }
  const toast = useToast();

  return (

    <div id="home">
      {user && <UserInfo />}
      <Heading color="whiteAlpha.900" size="3xl">
        <Flex align="center" gridGap="1rem">
          Chat-React
          <IoChatbox />
        </Flex>
      </Heading>

      <div>
        {!user ? (
          <Button
            rightIcon={<FcGoogle color="#fff" size={"2rem"} />}
            onClick={signInWithGoogle}
            colorScheme="blue"
            size="lg"
            isLoading={!loading}
            spinnerPlacement="start"
            loadingText="Loading"


          >
            Fazer Login com o Google
          </Button>
         ) : ( 
          <Flex
            bgColor="#EDEEFF"
            padding="2rem"
            direction="column"
            borderRadius="8px"
            gridGap="1rem"
            color="#404045"
          >
        

            <Input
              type="text"
                color="blackAlpha.900"
                maxLength={30}
              background="gray.300"
              onChange={(e) => {
                setRoom(e.target.value);
              }}
              value={room}
              variant="filled"
              size="md"
              placeholder="Nome da Sala"
            />

            <Button
              rightIcon={<IoMdCreate />}
              colorScheme="green"
              onClick={async () => {
                await logInRoomOrCreate();
                toast({
                  title: toastState.title,
                  description: toastState.description,
                  status: toastState.status,
                  duration: 3000,
                  position: "top",
                  isClosable: true,
                });
              }}
            >
            Criar
            </Button>
            <DrawerRooms/>
          </Flex>
        )}
      </div>
    </div>
  );
}

export { Home };
