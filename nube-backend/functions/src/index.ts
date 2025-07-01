import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import { moderateText } from "./utils";

admin.initializeApp();
const db = admin.firestore();
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

interface PostData {
  id?: string;
  text?: string;
  medias?: string[];
  userId: string;
  publicationDate: string;
  notificationToken?: string;
}

interface PostRequestBody {
  data: PostData;
  fcmToken: string;
}

interface ReactionsData {
  postId: string;
  likes: string[];
  dislikes: string[];
}

interface LikeBody {
  postId: string;
  userId: string;
}

app.post("/post", async (req, res) => {
  const { data, fcmToken } = req.body as PostRequestBody;

  if (!data || !fcmToken) {
    return res.status(400).json({
      error: "Data and fcmToken are required.",
    });
  }

  if (data.text) {
    const correctedText = moderateText(data.text);
    data.text = correctedText;
  }

  data.notificationToken = fcmToken;

  try {
    const docRef = await db.collection("posts").add(data);

    const successMessage: admin.messaging.Message = {
      notification: {
        title: "Posted 🎉",
        body: "",
      },
      data: {
        status: "success",
        postId: docRef.id,
        type: "post_status_update",
      },
      token: fcmToken,
    };

    await admin.messaging().send(successMessage);

    return res.status(200).json({
      message: "Post guardado exitosamente y notificación de estado enviada.",
      postId: docRef.id,
    });
  } catch (error: any) {
    console.error("Error al guardar el post en Firestore:", error);

    const errorMessage: admin.messaging.Message = {
      notification: {
        title: "Error al Postear ❌",
        body: "Hubo un problema al guardar tu publicación. Inténtalo de nuevo.",
      },
      data: {
        status: "error",
        errorMessage: error.message ?? "Error desconocido al guardar el post.",
        type: "post_status_update",
      },
      token: fcmToken,
    };

    try {
      await admin.messaging().send(errorMessage);
      console.error(
        "Notificación de error enviada para post. Error:",
        error.message
      );
    } catch (fcmError: any) {
      console.error("Error al enviar notificación de error:", fcmError);
    }

    return res.status(500).json({
      error: "Error interno del servidor al procesar el post.",
      details: error.message,
    });
  }
});

app.post("/like", async (req, res) => {
  const { postId, userId } = req.body as LikeBody;

  if (!postId || !userId) {
    return res.status(400).json({ error: "postId and userId are required" });
  }

  const reactionsRef = db.collection("reactions").doc(postId);
  const postRef = db.collection("posts").doc(postId);

  try {
    await db.runTransaction(async (transaction) => {
      const [reactionSnap, postSnap] = await Promise.all([
        transaction.get(reactionsRef),
        transaction.get(postRef),
      ]);

      let likes: string[] = [];
      let dislikes: string[] = [];

      if (reactionSnap.exists) {
        const data = reactionSnap.data()!;
        likes = data.likes ?? [];
        dislikes = data.dislikes ?? [];
      }

      const alreadyLiked = likes.includes(userId);

      if (alreadyLiked) {
        likes = likes.filter((id) => id !== userId);
      } else {
        likes.push(userId);
        dislikes = dislikes.filter((id) => id !== userId);
      }

      transaction.set(reactionsRef, { postId, likes, dislikes });

      if (!alreadyLiked && postSnap.exists) {
        const postData = postSnap.data() as PostData;
        if (postData.notificationToken) {
          await admin.messaging().send({
            token: postData.notificationToken,
            notification: {
              title: "Like!",
              body: "Someone liked your post.",
            },
            data: {
              postId,
              type: "like",
            },
          });
        }
      }
    });

    return res
      .status(200)
      .json({ message: "Like processed and notification sent" });
  } catch (err) {
    console.error("Error in /like:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/dislike", async (req, res) => {
  const { postId, userId } = req.body as LikeBody;

  if (!postId || !userId) {
    return res.status(400).json({ error: "postId and userId are required" });
  }

  const reactionsRef = db.collection("reactions").doc(postId);
  const postRef = db.collection("posts").doc(postId);

  try {
    await db.runTransaction(async (transaction) => {
      const [reactionSnap, postSnap] = await Promise.all([
        transaction.get(reactionsRef),
        transaction.get(postRef),
      ]);

      let likes: string[] = [];
      let dislikes: string[] = [];

      if (reactionSnap.exists) {
        const data = reactionSnap.data()!;
        likes = data.likes ?? [];
        dislikes = data.dislikes ?? [];
      }

      const alreadyDisliked = dislikes.includes(userId);

      if (alreadyDisliked) {
        dislikes = dislikes.filter((id) => id !== userId);
      } else {
        dislikes.push(userId);
        likes = likes.filter((id) => id !== userId);
      }

      transaction.set(reactionsRef, { postId, likes, dislikes });

      if (!alreadyDisliked && postSnap.exists) {
        const postData = postSnap.data() as PostData;
        if (postData.notificationToken) {
          await admin.messaging().send({
            token: postData.notificationToken,
            notification: {
              title: "Dislike",
              body: "Someone disagreed with your post.",
            },
            data: {
              postId,
              type: "dislike",
            },
          });
        }
      }
    });

    return res
      .status(200)
      .json({ message: "Dislike processed and notification sent" });
  } catch (err) {
    console.error("Error in /dislike:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/reactions/:postId", async (req, res) => {
  const postId = req.params.postId;

  if (!postId) {
    return res.status(400).json({ error: "postId is required" });
  }

  const docRef = db.collection("reactions").doc(postId);

  try {
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Post not found" });
    }

    const data = doc.data() as ReactionsData;

    return res.status(200).json({
      postId: data.postId,
      likes: data.likes || [],
      dislikes: data.dislikes || [],
      likesCount: (data.likes || []).length,
      dislikesCount: (data.dislikes || []).length,
    });
  } catch (err) {
    console.error("Error getting reactions:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export const api = functions.https.onRequest(app);
