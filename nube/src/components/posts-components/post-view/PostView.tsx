import { useEffect, useState } from "react";
import type { Post } from "../../../model/Post";
import "./post-view.css";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { type User } from "../../../model/User";
import UserDefaultImg from "../../../assets/img/user-default.png";
import { DeleteButton } from "../../buttons/delete-button/DeleteButton";
import { ViewMedia } from "../view-media/ViewMedia";

interface Props {
  post: Post;
}

export const PostView = ({ post }: Props) => {
  const [user, setUser] = useState<User | null>(null);

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
          <p className="post-publish-date">
            {post.publicationDate
              ? post.publicationDate.toDate().toLocaleString()
              : "Fecha no disponible"}
          </p>
        </div>
      </div>
      {post.text && <p className="text-post">{post.text}</p>}
      {post.medias && post.medias?.length > 0 && (
        <ViewMedia medias={post.medias} />
      )}
      {post.userId === user?.id && (
        <DeleteButton handleClick={handleDeletePost} />
      )}
    </div>
  );
};
