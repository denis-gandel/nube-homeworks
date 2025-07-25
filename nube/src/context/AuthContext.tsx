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
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  auth,
  googleProvider,
  facebookProvider,
  db,
  messaging,
} from "../firebase/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { type User } from "../model/User";
import { toast } from "react-toastify";

interface Props {
  children: ReactNode;
}

interface Type {
  register: (
    fullName: string,
    email: string,
    password: string,
    birthDate: string,
    address: string,
    age: number
  ) => Promise<void>;
  registerWithProvider: (providerName: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  signInError: string;
  user: User | null;
  logOut: () => Promise<void>;
  linkProvider: (providerName: string) => Promise<boolean>;
  nameProviders: Array<string>;
  id: string;
  tokenMessaging: string;
}

const AuthContext = createContext<Type | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState("")
  const [user, setUser] = useState<User | null>(null);
  const [id, setId] = useState("");
  const [signInError, setSignInError] = useState("");
  const [nameProviders, setNameProviders] = useState<Array<string>>([]);
  const [tokenMessaging, setTokenMessaging] = useState("");

  const providers = new Map<string, authProviderType>([
    ["google", googleProvider],
    ["facebook", facebookProvider],
  ]);

  const register = async (
    fullName: string,
    email: string,
    password: string,
    birthDate: string,
    address: string,
    age: number
  ) => {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = credentials.user;

    if (user) {
      getProviders(user);
      await saveData(
        fullName,
        email,
        birthDate,
        address,
        age,
        user.photoURL ?? "",
        user,
        user.uid
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
      const user = credentials.user;
      if (user) {
        setId(user.uid);
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
          undefined,
          undefined,
          undefined,
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

  const getMessagingToken = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );

        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          const currentToken = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration,
          });

          if (currentToken) {
            setTokenMessaging(currentToken);
          }
        } else {
          console.warn("Permiso de notificación denegado.");
        }
      } catch (err) {
        console.error("Error al obtener token o registrar SW:", err);
      }
    } else {
      console.warn("Service Workers no soportados en este navegador.");
    }
  };

  const saveData = async (
    fullName: string,
    email: string,
    birtDate?: string,
    address?: string,
    age?: number,
    profileImg?: string,
    providerUser?: userProviderType,
    id?: string
  ) => {
    if (!id) return;

    if (!providerUser) {
      setSignInError("User not found");
      return;
    }

    const user = {
      fullName,
      email,
      birthDate: birtDate ?? "Never",
      address: address ?? "Av IDK",
      age: age ?? 0,
      profileImg: profileImg ?? "",
    };

    if (user) {
      setUser(user);
      await updateProfile(providerUser, {
        displayName: fullName,
      });

      await setDoc(doc(db, "users", id), {
        fullName: user.fullName,
        email: user.email,
        birthDate: user.birthDate,
        address: user.address,
        age: user.age,
        profileImg: user.profileImg,
      });

      setId(id);
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

  const getProviders = async (user: userProviderType) => {
    const currentProviders = user.providerData.map((provider) => {
      return provider.providerId;
    });
    setNameProviders(currentProviders);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    getMessagingToken();

    const unsubscribeOnMessage = onMessage(messaging, (payload) => {
      if (payload.notification) {
        if (payload.data && payload.data.type === "post_status_update") {
          if (payload.data.status === "success") {
            toast.success(
              `${payload.notification.title}: ${payload.notification.body}`
            );
          } else if (payload.data.status === "error") {
            toast.error(
              `${payload.notification.title}: ${payload.notification.body}`
            );
          } else {
            toast.info(
              `${payload.notification.title}: ${payload.notification.body}`
            );
          }
        } else {
          toast.info(
            `${payload.notification.title}: ${payload.notification.body}`
          );
        }
      }
    });

    return () => {
      unsubscribeOnMessage();
    };
  }, []);

  const objValue = useMemo(
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
      tokenMessaging,
    }),
    [signInError, user, nameProviders, id, tokenMessaging]
  );

  return (
    <AuthContext.Provider value={objValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
