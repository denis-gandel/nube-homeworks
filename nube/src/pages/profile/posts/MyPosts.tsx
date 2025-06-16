import { useEffect, useState } from "react";
import { CreatePost } from "../../../components/posts-components/create-post/CreatePost";
import "./my-posts.css";
import type { Post } from "../../../model/Post";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { useAuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router";
import { PostView } from "../../../components/posts-components/post-view/PostView";

export function MyPosts() {
  const navigate = useNavigate();
  const { id } = useAuthContext();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!id) {
      navigate("/log-in")
      return
    }

    try {
      const postsQuery = query(
        collection(db, "posts"),
        where("userId", "==", id),
        orderBy("publicationDate", "desc")
      );

      const unsubscribe = onSnapshot(
        postsQuery,
        (snapshot) => {
          const userPosts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Post[];
          setPosts(userPosts);
        },
        (err) => {
          console.error("Error en snapshot:", err);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Error al configurar la consulta:", err);
    }
  }, [id]);

  return (
    <div className="my-posts-page page">
      <h1>My posts</h1>
      <div className="my-posts-sections fca">
        <CreatePost />

        {posts.length > 0 ? (
          posts.map((post) => <PostView key={post.id} post={post} />)
        ) : (
          <p className="post-not-found">You haven't posted anything yet.</p>
        )}
      </div>
    </div>
  );
}
