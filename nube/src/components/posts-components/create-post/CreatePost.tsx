import { useState } from "react";
import { Button } from "../../buttons/button/Button";
import "./create-post.css";
import { useAuthContext } from "../../../context/AuthContext";
import type { Post } from "../../../model/Post";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

export const CreatePost = () => {
  const { id } = useAuthContext();
  const [text, setText] = useState("");

  const handlePublish = async () => {
    if (!text.trim()) return;

    try {
      const post: Post = {
        text: text,
        userId: id,
        publicationDate: serverTimestamp(),
      };

      await addDoc(collection(db, "posts"), post);
      setText("");
    } catch (error) {
      console.error("Error al publicar:", error);
    }
  };

  return (
    <div className="create-post-component">
      <textarea
        name="input-text-post"
        id="input-text-post"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="input-text-post"
        placeholder="Write down your feelings..."
      ></textarea>
      <div className="create-post-buttons frcl">
        <Button label="Publish" handleClick={handlePublish} />
      </div>
    </div>
  );
};
