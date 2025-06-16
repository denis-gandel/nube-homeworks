import type { FieldValue } from "firebase/firestore";

export interface Post {
  id?: string
  text: string;
  userId: string;
  publicationDate: FieldValue;
}
