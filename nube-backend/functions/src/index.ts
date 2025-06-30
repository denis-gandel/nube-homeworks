import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";

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
}

interface PostRequestBody {
  data: PostData;
  fcmToken: string;
}

app.post("/post", async (req, res) => {
  const { data, fcmToken } = req.body as PostRequestBody;

  if (!data || !fcmToken) {
    return res.status(400).json({
      error:
        "Cuerpo de la solicitud incompleto. Se requiere 'data' y 'fcmToken'.",
    });
  }

  try {
    const docRef = await db.collection("posts").add(data);

    const successMessage: admin.messaging.Message = {
      notification: {
        title: "Post Exitoso 🎉",
        body: "¡Hecho! Tu publicación ya está en línea.",
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

export const api = functions.https.onRequest(app);
