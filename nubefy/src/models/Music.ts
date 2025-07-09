export interface Music {
  id?: string;
  title: string;
  artistsId: Array<string>;
  music: string;
  genre: string;
  imageUrl: string;
}

export interface Artist {
  id?: string;
  name: string;
  genresId: Array<string>;
  imageUrl: string;
}

export interface Genre {
  id?: string;
  name: string;
  imageUrl: string;
}
