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
import { IoMdLogIn, IoMdCreate } from "react-icons/io";

//hooks
import { useAuth } from "../../hooks/useAuth";


//components
import { UserInfo } from "../../components/UserInfo";

//SCSS
import "./styles.scss";

function Home() {
  const { user, signInWithGoogle,loading } = useAuth();
  const history = useHistory();

  const [room, setRoom] = useState("");
  const toastState = {} as UseToastOptions;
  const [buttonState, setButtonState] = useState(false);

  async function logInRoomOrCreate() {
    if (room.trim().length === 0) {
      toastState.description =
        "Digite algo no input para entra ou criar uma sala";
      toastState.status = "info";
      toastState.title = "Informação";

      return;
    }

    if (buttonState) {
      const roomExists = await database.ref(`rooms/${room}`).get();

      if (!roomExists.exists()) {
        toastState.description = `Sala não ${room}  encontrada `;
        toastState.status = "error";
        toastState.title = "Error";
        return;
      }
      const ArrayListMember = roomExists.val().listMembers;
      if (
        !ArrayListMember.some((e: any) => {
          return e.id === user?.id;
        })
      ) {
        await database.ref(`rooms/${room}`).update({
          listMembers: [...ArrayListMember, { ...user }],
        });
      }
      toastState.description = `Sala ${room} encontrada`;
      toastState.status = "success";
      toastState.title = "Sucesso";

      history.push(`/rooms/${room}`);
    } else {
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
            <Flex h="100%" gridGap="1rem">
              <Button
                flex="1"
                colorScheme="twitter"
                onClick={() => {
                  setButtonState(true);
                }}
                isActive={buttonState}
                _active={{ opacity: 0.5 }}
              >
                Entra em sala
              </Button>
              <Button
                flex="1"
                onClick={() => {
                  setButtonState(false);
                }}
                colorScheme="twitter"
                isActive={!buttonState}
                _active={{ opacity: 0.5 }}
              >
                Criar Sala
              </Button>
            </Flex>

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
              placeholder={buttonState ? "Entra na sala" : "Criar Sala"}
            />

            <Button
              rightIcon={buttonState ? <IoMdLogIn /> : <IoMdCreate />}
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
              {buttonState ? `Entrar ` : "Criar"}
            </Button>
          </Flex>
        )}
      </div>
    </div>
  );
}

export { Home };
