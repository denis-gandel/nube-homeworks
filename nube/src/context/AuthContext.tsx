import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  type AuthProvider as authProviderType,
  type User,
  signOut,
  linkWithPopup,
} from "firebase/auth";
import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { auth, googleProvider, facebookProvider } from "../firebase/firebase";

interface Props {
  children: ReactNode;
}

interface Type {
  register: (
    fullname: string,
    email: string,
    password: string
  ) => Promise<void>;
  registerWithProvider: (providerName: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  signInError: string;
  user: User | null;
  logOut: () => Promise<void>;
  linkProvider: (providerName: string) => Promise<boolean>;
}

const AuthContext = createContext<Type | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [signInError, setSignInError] = useState("");

  const providers = new Map<string, authProviderType>([
    ["google", googleProvider],
    ["facebook", facebookProvider],
  ]);

  const register = async (
    fullname: string,
    email: string,
    password: string
  ) => {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = credentials.user;

    if (user) {
      setUser(user);
      await updateProfile(user, {
        displayName: fullname,
      });
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
      setUser(user);
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
      setUser(result.user);
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

      await linkWithPopup(user, provider);
      return true;
    } catch (error: any) {
      console.error("Error linking provider:", error);
      return false;
    }
  };

  const objValue = useMemo(
    () => ({
      register,
      registerWithProvider,
      logIn,
      signInError,
      user,
      logOut,
      linkProvider,
    }),
    [signInError, user]
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
