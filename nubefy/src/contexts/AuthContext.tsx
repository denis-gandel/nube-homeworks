import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  type AuthProvider as authProviderType,
  signOut,
  linkWithPopup,
  type User as userProviderType,
} from "firebase/auth";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../models/User";
import {
  auth,
  db,
  facebookProvider,
  googleProvider,
} from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface Props {
  children: ReactNode;
}

interface Types {
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  registerWithProvider: (providerName: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  signInError: string;
  user: User | null;
  logOut: () => Promise<void>;
  linkProvider: (providerName: string) => Promise<boolean>;
  nameProviders: Array<string>;
  id: string;
}

export const AuthContext = createContext<Types | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [nameProviders, setNameProviders] = useState<Array<string>>([]);
  const [id, setId] = useState("");
  const [signInError, setSignInError] = useState("");

  const providers = new Map<string, authProviderType>([
    ["google", googleProvider],
    ["facebook", facebookProvider],
  ]);

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const createdUser = credentials.user;

    if (createdUser) {
      getProviders(createdUser);
      await saveData(
        username,
        email,
        createdUser.photoURL ?? "",
        createdUser,
        createdUser.uid
      );
    }
  };

  const logIn = async (email: string, password: string) => {
    try {
      const credentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const currentUser = credentials.user;

      if (currentUser) {
        setId(currentUser.uid);
      }
      setSignInError("");
    } catch (error: any) {
      switch (error.code) {
        case "auth/invalid-credential":
          setSignInError("Invalid credentials");
          break;
        case "auth/too-many-requests":
          setSignInError("Too many failed attempts. Try again later.");
          break;
        default:
          setSignInError("An unexpected error occurred. Please try again.");
          console.error(error);
          break;
      }
    }
  };

  const registerWithProvider = async (providerName: string) => {
    try {
      const provider = providers.get(providerName);
      if (!provider) throw new Error("Provider not found");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        getProviders(user);
        await saveData(
          user.displayName ?? "",
          user.email ?? "",
          user.photoURL ?? "",
          user,
          user.uid
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logOut = async (): Promise<void> => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem(
      "nubefy_gKcaXH97dvwR7hr9VUt6XydUqc4wUJ3NYkB9rka2KUHBW7HUR6grhEJDT5XCD11J"
    );
  };

  const linkProvider = async (providerName: string): Promise<boolean> => {
    const provider = providers.get(providerName);
    if (!provider) throw new Error("Provider not found");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user is currently logged in");
      if (user) {
        setId(user.uid);
      }

      await linkWithPopup(user, provider);
      return true;
    } catch (error: any) {
      console.error("Error linking provider:", error);
      return false;
    }
  };

  const getProviders = async (user: userProviderType) => {
    const currentProviders = user.providerData.map((provider) => {
      return provider.providerId;
    });
    setNameProviders(currentProviders);
  };

  const saveData = async (
    username: string,
    email: string,
    imageUrl?: string,
    providerUser?: userProviderType,
    id?: string
  ) => {
    if (!id) return;

    if (!providerUser) {
      setSignInError("User not found");
      return;
    }

    const userToCreate: User = {
      username,
      email,
      role: "user",
      imageUrl: imageUrl ?? "",
    };
    setUser(userToCreate);

    if (userToCreate) {
      setUser(userToCreate);
      await updateProfile(providerUser, {
        displayName: username,
      });

      await setDoc(doc(db, "users", id), {
        username: userToCreate.username,
        email: userToCreate.email,
        role: userToCreate.role,
        imageUrl: userToCreate.imageUrl,
      });

      setId(id);
      localStorage.setItem(
        "nubefy_gKcaXH97dvwR7hr9VUt6XydUqc4wUJ3NYkB9rka2KUHBW7HUR6grhEJDT5XCD11J",
        id
      );
    }
  };

  const fetchData = async () => {
    if (!id) return;

    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUser(docSnap.data() as User);
    } else {
      console.log("No such document!");
    }
  };

  const getId = () => {
    const currentId = localStorage.getItem(
      "nubefy_gKcaXH97dvwR7hr9VUt6XydUqc4wUJ3NYkB9rka2KUHBW7HUR6grhEJDT5XCD11J"
    );
    if (currentId) setId(currentId);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    getId();
  }, []);

  const values = useMemo(
    () => ({
      register,
      registerWithProvider,
      logIn,
      signInError,
      user,
      logOut,
      linkProvider,
      nameProviders,
      id,
    }),
    [signInError, user, nameProviders, id]
  );

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
