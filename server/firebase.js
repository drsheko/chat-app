const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD0Har6oWS_3cr-bk4L64J2D9jwWkhOtRc",
    authDomain: "chat-app-2cb6f.firebaseapp.com",
    projectId: "chat-app-2cb6f",
    storageBucket: "chat-app-2cb6f.appspot.com",
    messagingSenderId: "563614941131",
    appId: "1:563614941131:web:534812e9ebdf6813cd404e"
  };

const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
module.exports = getStorage(firebaseApp);