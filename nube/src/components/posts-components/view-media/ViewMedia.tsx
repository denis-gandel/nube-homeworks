import { ChevronLeft, ChevronRight } from "lucide-react";
import "./view-media.css";
import { useState, useEffect } from "react";

interface Props {
  medias?: string[];
}

export const ViewMedia = ({ medias = [] }: Props) => {
  const [position, setPosition] = useState(0);
  const [media, setMedia] = useState(medias[0]);

  useEffect(() => {
    setMedia(medias[position]);
  }, [position, medias]);

  const handleLeft = () => {
    if (medias.length === 0) return;
    setPosition((prev) => (prev === 0 ? medias.length - 1 : prev - 1));
  };

  const handleRight = () => {
    if (medias.length === 0) return;
    setPosition((prev) => (prev === medias.length - 1 ? 0 : prev + 1));
  };

  const isImage = (url: string) =>
    /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);

  const isVideo = (url: string) => /\.(mp4|webm|ogg|mov|mkv)$/i.test(url);

  return (
    <div className="view-media-component">
      {medias.length > 1 && position !== 0 && (
        <button
          className="view-media-control fca view-media-control-left"
          onClick={handleLeft}
          disabled={position === 0}
        >
          <ChevronLeft />
        </button>
      )}
      <div className="view-media-content">
        {media && isImage(media) && <img src={media} alt="Media" />}
        {media && isVideo(media) && (
          <video src={media} controls>
            Your browser does not support the video tag.
          </video>
        )}
        {media && !isImage(media) && !isVideo(media) && (
          <p>Unsupported media type</p>
        )}
      </div>
      {medias.length > 1 && position !== medias.length - 1 && (
        <button
          className="view-media-control fca view-media-control-right"
          onClick={handleRight}
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
};
