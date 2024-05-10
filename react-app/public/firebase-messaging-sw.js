importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyBfb1NgeQStT4RGMqK0c_xoxKux9H_Y-BY",
    authDomain: "dncc-ecosync.firebaseapp.com",
    projectId: "dncc-ecosync",
    storageBucket: "dncc-ecosync.appspot.com",
    messagingSenderId: "553141191660",
    appId: "1:553141191660:web:b6a06691b0ce1c35eef6c9",
    measurementId: "G-F164HBEVYK"
  };

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});