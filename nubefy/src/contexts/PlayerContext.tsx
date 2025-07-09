import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Artist, Genre, Music } from "../models/Music";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

interface Props {
  children: ReactNode;
}

interface Types {
  musics: Array<Music>;
  music: Music | undefined;
  artists: Array<Artist>;
  artist: Artist | undefined;
  genres: Array<Genre>;
  genre: Genre | undefined;
  createMusic: (
    title: string,
    artistsId: Array<string>,
    musicFile: File,
    genre: string,
    imageFile: File
  ) => Promise<void>;
  getMusics: (artistId?: string, genreId?: string) => Promise<void>;
  getMusicById: (id: string) => Promise<void>;
  createArtist: (
    name: string,
    genresId: Array<string>,
    imageFile: File
  ) => Promise<void>;
  getArtists: (genreId?: string) => Promise<void>;
  getArtist: (name?: string, id?: string) => Promise<void>;
  createGenre: (name: string, imageFile: File) => Promise<void>;
  getGenres: () => Promise<void>;
  getGenre: (name?: string, id?: string) => Promise<void>;
}

export const PlayerContext = createContext<Types | undefined>(undefined);

export const PlayerProvider = ({ children }: Props) => {
  const [musics, setMusics] = useState<Array<Music>>([]);
  const [music, setMusic] = useState<Music | undefined>(undefined);
  const [artists, setArtists] = useState<Array<Artist>>([]);
  const [artist, setArtist] = useState<Artist | undefined>(undefined);
  const [genres, setGenres] = useState<Array<Genre>>([]);
  const [genre, setGenre] = useState<Genre | undefined>(undefined);

  const createMusic = async (
    title: string,
    artistsId: Array<string>,
    musicFile: File,
    genre: string,
    imageFile: File
  ) => {
    const storage = getStorage();
    const db = getFirestore();

    try {
      const imageRef = ref(
        storage,
        `nubefy/musics/covers/${Date.now()}-${musicFile.name}`
      );
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      const musicRef = ref(
        storage,
        `nubefy/musics/files/${Date.now()}-${musicFile.name}`
      );
      await uploadBytes(musicRef, musicFile);
      const musicUrl = await getDownloadURL(musicRef);

      const newMusic: Music = {
        title,
        artistsId,
        music: musicUrl,
        genre,
        imageUrl,
      };

      const musicsCollection = collection(db, "musics");
      await addDoc(musicsCollection, newMusic);
    } catch (error) {
      console.error(error);
    }
  };

  const getMusics = async (artistId?: string, genreId?: string) => {
    const db = getFirestore();
    const musicsRef = collection(db, "musics");

    let q;

    if (artistId) {
      q = query(musicsRef, where("artistsId", "array-contains", artistId));
    } else if (genreId) {
      q = query(musicsRef, where("genre", "==", genreId));
    } else {
      q = musicsRef;
    }

    const querySnapshot = await getDocs(q);
    const musics: Music[] = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Music)
    );

    if (musics) setMusics(musics);
  };

  const getMusicById = async (id: string) => {
    const db = getFirestore();
    const musicRef = doc(db, "musics", id);
    const musicSnap = await getDoc(musicRef);

    if (!musicSnap.exists()) {
      setMusic(undefined);
      return;
    }

    setMusic({
      id: musicSnap.id,
      ...musicSnap.data(),
    } as Music);
  };

  const createArtist = async (
    name: string,
    genresId: Array<string>,
    imageFile: File
  ) => {
    const storage = getStorage();
    const db = getFirestore();

    try {
      const imageRef = ref(
        storage,
        `nubefy/artists/${Date.now()}-${imageFile.name}`
      );
      await uploadBytes(imageRef, imageFile);

      const imageUrl = await getDownloadURL(imageRef);

      const newArtist: Artist = {
        name,
        genresId,
        imageUrl,
      };

      const artistsCollection = collection(db, "artists");
      await addDoc(artistsCollection, newArtist);
    } catch (error) {
      console.error(error);
    }
  };

  const getArtists = async (genreId?: string) => {
    const db = getFirestore();
    const artistsRef = collection(db, "artists");

    let q;

    if (genreId) {
      q = query(artistsRef, where("genresId", "array-contains", genreId));
    } else {
      q = artistsRef;
    }

    const querySnapshot = await getDocs(q);

    const artists: Artist[] = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Artist)
    );

    setArtists(artists);
  };

  const getArtist = async (name?: string, id?: string) => {
    const db = getFirestore();
    let artistDoc: Artist | null = null;
    let artistId: string | undefined;

    if (id) {
      const docRef = doc(db, "artists", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return;

      artistDoc = {
        id: docSnap.id,
        ...docSnap.data(),
      } as Artist;
      artistId = docSnap.id;
    } else if (name) {
      const q = query(collection(db, "artists"), where("name", "==", name));
      const querySnap = await getDocs(q);
      if (querySnap.empty) return;

      const docSnap = querySnap.docs[0];
      artistDoc = {
        id: docSnap.id,
        ...docSnap.data(),
      } as Artist;
      artistId = docSnap.id;
    }

    if (!artistId || !artistDoc) return;

    const musicsSnap = await getDocs(
      query(
        collection(db, "musics"),
        where("artistsId", "array-contains", artistId)
      )
    );

    const musics: Music[] = musicsSnap.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Music)
    );

    setArtist(artistDoc);
    setMusics(musics);
  };

  const createGenre = async (name: string, imageFile: File) => {
    const db = getFirestore();
    const storage = getStorage();

    try {
      const imageRef = ref(
        storage,
        `nubefy/genres/${Date.now()}-${imageFile.name}`
      );
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      const newGenre: Genre = {
        name,
        imageUrl,
      };

      const genresRef = collection(db, "genres");
      await addDoc(genresRef, newGenre);
    } catch (error) {
      console.error("Error creating genre:", error);
      throw error;
    }
  };

  const getGenres = async () => {
    const db = getFirestore();
    const genresRef = collection(db, "genres");
    const querySnapshot = await getDocs(genresRef);

    const genres = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Genre)
    );

    setGenres(genres);
  };

  const getGenre = async (name?: string, id?: string) => {
    const db = getFirestore();
    let genreDoc: Genre | null = null;
    let genreId: string | undefined;

    if (id) {
      const docRef = doc(db, "genres", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return;

      genreDoc = {
        id: docSnap.id,
        ...docSnap.data(),
      } as Genre;
      genreId = docSnap.id;
    } else if (name) {
      const q = query(collection(db, "genres"), where("name", "==", name));
      const querySnap = await getDocs(q);
      if (querySnap.empty) return;

      const docSnap = querySnap.docs[0];
      genreDoc = {
        id: docSnap.id,
        ...docSnap.data(),
      } as Genre;
      genreId = docSnap.id;
    }

    if (!genreId || !genreDoc) return;

    const artistsSnap = await getDocs(
      query(
        collection(db, "artists"),
        where("genresId", "array-contains", genreId)
      )
    );

    const artists: Artist[] = artistsSnap.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Artist)
    );

    setGenre(genreDoc);
    setArtists(artists);
  };

  const values = useMemo(
    () => ({
      musics,
      music,
      artists,
      artist,
      genres,
      genre,
      createMusic,
      getMusics,
      getMusicById,
      createArtist,
      getArtists,
      getArtist,
      createGenre,
      getGenres,
      getGenre,
    }),
    [musics, music, artists, artist, genres, genre]
  );

  return (
    <PlayerContext.Provider value={values}>{children}</PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayerContext must be used within an PlayerProvider");
  }
  return context;
};
