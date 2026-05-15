import { initializeApp } from "firebase/app";

import {
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAtQNQcoOx6mnmm6v7Q6uzTAo82TIqd3I",
  authDomain: "todo-app-c-539ce.firebaseapp.com",
  projectId: "todo-app-c-539ce",
  storageBucket: "todo-app-c-539ce.firebasestorage.app",
  messagingSenderId: "799421079025",
  appId: "1:799421079025:web:a73fdf2edcb2b6c3ef3850",
  measurementId: "G-MDHC9D9RWS",
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager(),
  }),
});
