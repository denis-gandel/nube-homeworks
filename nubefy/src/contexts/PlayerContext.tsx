import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Artist, Genre, Music } from "../models/Music";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase/firebase";

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
  ) => Promise<string | undefined>;
  getMusics: (artistId?: string, genreId?: string) => Promise<void>;
  getMusicById: (id: string) => Promise<void>;
  createArtist: (
    name: string,
    genresId: Array<string>,
    imageFile: File
  ) => Promise<string | undefined>;
  getArtists: (genreId?: string) => Promise<void>;
  getArtist: (id: string) => Promise<void>;
  createGenre: (name: string, imageFile: File) => Promise<string | undefined>;
  getGenres: () => Promise<void>;
  getGenre: (id: string) => Promise<void>;
  setSelectedMusic: (value: number) => void;
  handleNextMusic: () => void;
  handlePreviousMusic: () => void;
}

export const PlayerContext = createContext<Types | undefined>(undefined);

export const PlayerProvider = ({ children }: Props) => {
  const [musics, setMusics] = useState<Array<Music>>([]);
  const [music, setMusic] = useState<Music | undefined>(undefined);
  const [artists, setArtists] = useState<Array<Artist>>([]);
  const [artist, setArtist] = useState<Artist | undefined>(undefined);
  const [genres, setGenres] = useState<Array<Genre>>([]);
  const [genre, setGenre] = useState<Genre | undefined>(undefined);
  const [selectedMusic, setSelectedMusic] = useState(-1);

  const createMusic = async (
    title: string,
    artistsId: Array<string>,
    musicFile: File,
    genre: string,
    imageFile: File
  ) => {
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
      const result = await addDoc(musicsCollection, newMusic);
      return result.id;
    } catch (error) {
      console.error(error);
    }
  };

  const getMusics = async (artistId?: string, genreId?: string) => {
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
      const result = await addDoc(artistsCollection, newArtist);
      return result.id;
    } catch (error) {
      console.error(error);
    }
  };

  const getArtists = async (genreId?: string) => {
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

  const getArtist = async (id: string) => {
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
      const result = await addDoc(genresRef, newGenre);
      return result.id;
    } catch (error) {
      console.error(error);
    }
  };

  const getGenres = async () => {
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

  const getGenre = async (id: string) => {
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

  const handleNextMusic = () => {
    if (musics.length === 0) {
      setSelectedMusic(-1);
      return;
    }

    setSelectedMusic((prev) => {
      const nextIndex = prev + 1;
      return nextIndex < musics.length ? nextIndex : 0;
    });
  };

  const handlePreviousMusic = () => {
    if (musics.length === 0) {
      setSelectedMusic(-1);
      return;
    }

    setSelectedMusic((prev) => {
      const prevIndex = prev - 1;
      return prevIndex >= 0 ? prevIndex : musics.length - 1;
    });
  };

  useEffect(() => {
    if (selectedMusic > -1 && musics.length > 0) {
      setMusic(musics[selectedMusic]);
    } else {
      setMusic(undefined);
    }
  }, [selectedMusic, musics]);

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
      setSelectedMusic,
      handleNextMusic,
      handlePreviousMusic,
    }),
    [musics, music, artists, artist, genres, genre, selectedMusic]
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
