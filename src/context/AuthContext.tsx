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
  loading:boolean

};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

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
        setLoading(false)
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
      
      setLoading(false)
    }
  }

  function SingOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(undefined)
        setLoading(true)

      })
      .catch();
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, SingOut ,loading}}>
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContextProvider };
