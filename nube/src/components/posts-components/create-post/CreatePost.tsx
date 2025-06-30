import { useState } from "react";
import { Button } from "../../buttons/button/Button";
import "./create-post.css";
import { useAuthContext } from "../../../context/AuthContext";
import type { Post } from "../../../model/Post";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { ImagePlus } from "lucide-react";
import { usePopUpContext } from "../../../context/PopUpContext";
import { UploadMediasPopUp } from "../../pop-ups/upload-medias-pop-up/UploadMediasPopUp";
import { CreateViewMedia } from "../create-view-media/CreateViewMedia";
import axios from "axios";

export const CreatePost = () => {
  const { id, tokenMessaging } = useAuthContext();
  const { setPopUp } = usePopUpContext();
  const [text, setText] = useState("");
  const [medias, setMedias] = useState<File[]>([]);

  const handlePublish = async () => {
    if (!tokenMessaging) return;
    if (!text.trim() && medias.length === 0) return;

    try {
      const links = await handleUploadMediaToCloudinary();
      const currentDate = new Date();
      const post: Post = {
        text: text,
        userId: id,
        publicationDate: currentDate.toISOString(),
        medias: links,
      };

      const response = await axios.post(
        "http://localhost:5000/mobile-dev-2025/us-central1/api/post",
        {
          data: post,
          fcmToken: tokenMessaging,
        }
      );
      if (response.status === 200) {
        setText("");
        setMedias([]);
      }
    } catch (error) {
      console.error("Error al publicar:", error);
    }
  };

  const handleUploadMediaToCloudinary = async (): Promise<string[]> => {
    const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

    const uploadPromises = medias.map(async (media) => {
      const formData = new FormData();
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("file", media);

      try {
        const res = await fetch(UPLOAD_URL, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          console.error("Error al subir:", media.name);
          return null;
        }

        const data = await res.json();
        return data.secure_url;
      } catch (error) {
        console.error("Error en Cloudinary:", error);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    return results.filter((url): url is string => url !== null);
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
      <CreateViewMedia medias={medias} />
      <div className="create-post-buttons frcc">
        <div className="create-post-more-actions">
          <button
            className="create-post-more-action-button fccc"
            onClick={() =>
              setPopUp(<UploadMediasPopUp setMedias={setMedias} />)
            }
          >
            <ImagePlus />
          </button>
        </div>
        <Button label="Publish" handleClick={handlePublish} />
      </div>
    </div>
  );
};
