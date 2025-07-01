import { useEffect, useState } from "react";
import type { Post, Reactions } from "../../../model/Post";
import "./post-view.css";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { type User } from "../../../model/User";
import UserDefaultImg from "../../../assets/img/user-default.png";
import { DeleteButton } from "../../buttons/delete-button/DeleteButton";
import { ViewMedia } from "../view-media/ViewMedia";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useAuthContext } from "../../../context/AuthContext";
import axios from "axios";

interface Props {
  post: Post;
}

export const PostView = ({ post }: Props) => {
  const { id } = useAuthContext();
  const [user, setUser] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const handleLike = async () => {
    const response = await axios.post(
      "http://localhost:5000/mobile-dev-2025/us-central1/api/like",
      {
        postId: post.id,
        userId: id,
      }
    );
    if (response.status === 200) {
      setIsLiked(!isLiked);
      if (isDisliked) setIsDisliked(!isDisliked);
    }
  };

  const handleDislike = async () => {
    const response = await axios.post(
      "http://localhost:5000/mobile-dev-2025/us-central1/api/dislike",
      {
        postId: post.id,
        userId: id,
      }
    );
    if (response.status === 200) {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(!isLiked);
    }
  };

  const handleGetUserInfo = async () => {
    const docRef = doc(db, "users", post.userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentUser = docSnap.data() as User;
      currentUser.id = post.userId;
      setUser(currentUser);
    } else {
      console.log("No such document!");
    }
  };

  const handleDeletePost = async () => {
    try {
      if (post.id) {
        const postRef = doc(db, "posts", post.id);
        await deleteDoc(postRef);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getPostReactions = async () => {
    if (!post.id) return
    const response = await axios.get(
      `http://localhost:5000/mobile-dev-2025/us-central1/api/reactions/${post.id}`
    )

    const data = response.data as Reactions
    setLikes(data.likesCount)
    setDislikes(data.dislikesCount)
  }

  useEffect(() => {
    getPostReactions()
  }, [isLiked, isDisliked])

  useEffect(() => {
    handleGetUserInfo();
  }, [post]);

  return (
    <div className="post-view-component fca">
      <div className="post-header">
        {(user?.profileImg || UserDefaultImg) && (
          <img
            src={user?.profileImg ?? UserDefaultImg}
            alt="Post owner"
            className="profile-img-post"
            width={60}
            height={60}
          />
        )}
        <div className="post-info">
          <b className="post-user-name">{user?.fullName ?? "User unknow"}</b>
          <p className="post-publish-date">{post.publicationDate}</p>
        </div>
      </div>
      {post.text && <p className="text-post">{post.text}</p>}
      {post.medias && post.medias?.length > 0 && (
        <ViewMedia medias={post.medias} />
      )}
      <div className="post-view-component-actions frcb">
        <div className="post-view-component-reactions frcc">
          <button
            onClick={handleLike}
            className={`post-view-reaction frcc like ${
              isLiked ? "active" : ""
            }`}
          >
            <ThumbsUp /> <span>{likes}</span>
          </button>
          <button
            onClick={handleDislike}
            className={`post-view-reaction frcc dislike ${
              isDisliked ? "active" : ""
            }`}
          >
            <ThumbsDown /> {dislikes}
          </button>
        </div>
        {post.userId === user?.id && (
          <DeleteButton handleClick={handleDeletePost} />
        )}
      </div>
    </div>
  );
};
