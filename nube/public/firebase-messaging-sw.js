/// <reference lib="WebWorker">

importScripts(
  "https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyDOZaZOblcCB1qAX0leo45NtGvMkHhpeWc",
  authDomain: "mobile-dev-2025.firebaseapp.com",
  projectId: "mobile-dev-2025",
  storageBucket: "mobile-dev-2025.appspot.com",
  messagingSenderId: "55756156714",
  appId: "1:55756156714:web:b62074477d8917dc0c7853",
  measurementId: "G-N89HKJ2RZY",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? "Title";
  const options = {
    body: payload.notification?.body ?? "Body",
    icon: "/assets/logo/android-chrome-192x192.png",
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(self.location.origin);
      }
    })
  );
});
