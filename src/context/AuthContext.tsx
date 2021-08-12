import { useState, createContext, useEffect, ReactNode } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
  email:string|null
};

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
  SingOut: () => void;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid,email } = user;

        if (!displayName || !photoURL) {
          throw new Error("Missing information from Google Account");
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
          email:email
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid ,email} = result.user;

      if (!displayName || !photoURL) {
        throw new Error("Photo or Name not found");
      }

      setUser({
        name: displayName,
        avatar: photoURL,
        id: uid,
        email
      });
    }
  }

  function SingOut() {
    firebase
      .auth()
      .signOut()
      .then(() => setUser(undefined))
      .catch();
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, SingOut }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContextProvider };
