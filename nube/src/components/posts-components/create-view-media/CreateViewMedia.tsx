import "./create-view-media.css";
import { useEffect, useState } from "react";

interface Props {
  medias: File[];
}

export const CreateViewMedia = ({ medias }: Props) => {
  const [mediaURLs, setMediaURLs] = useState<{ url: string; name: string }[]>(
    []
  );

  useEffect(() => {
    const urls = medias.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setMediaURLs(urls);

    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u.url));
    };
  }, [medias]);

  const isImage = (name: string) =>
    /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(name);

  const isVideo = (name: string) => /\.(mp4|webm|ogg|mov|mkv)$/i.test(name);

  return (
    <div className="create-view-media-component">
      {mediaURLs.map((media, index) => {
        if (isImage(media.name)) {
          return (
            <img
              key={index}
              src={media.url}
              alt={`media-${index}`}
              className="media-preview"
            />
          );
        }

        if (isVideo(media.name)) {
          return (
            <video
              key={index}
              src={media.url}
              controls
              className="media-preview"
            >
              <track kind="captions" />
              Your browser does not support the video tag.
            </video>
          );
        }

        return <p key={index}>Unsupported media type</p>;
      })}
    </div>
  );
};
