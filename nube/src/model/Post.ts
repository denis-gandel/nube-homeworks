import type { FieldValue } from "firebase/firestore";

export interface Post {
  id?: string
  text?: string;
  medias?: string[]
  userId: string;
  publicationDate: FieldValue;
}
