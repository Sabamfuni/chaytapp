// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ✅ Replace this with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAt3BcLvD6SpiQpviNljRqIHsYlY6hPl_4",
  authDomain: "chaytapp.firebaseapp.com",
  projectId: "chaytapp",
  storageBucket: "chaytapp.appspot.com",
  messagingSenderId: "800464782855",
  appId: "1:800464782855:web:7616d1bf4d4c1b31264ca2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const authSection = document.getElementById('auth');
const chatSection = document.getElementById('chatApp');
const chatBox = document.getElementById('chat');
const msgInput = document.getElementById('message');

// Sign Up
window.signUp = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("✅ Account created!"))
    .catch(err => alert("Error: " + err.message));
};

// Log In
window.logIn = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => console.log("✅ Logged in"))
    .catch(err => alert("Login failed: " + err.message));
};

// Log Out
window.logOut = function () {
  signOut(auth)
    .then(() => alert("Logged out"))
    .catch(err => alert(err.message));
};

// Send Message
window.sendMessage = function () {
  const text = msgInput.value.trim();
  if (text && auth.currentUser) {
    addDoc(collection(db, "messages"), {
      text: text,
      created: serverTimestamp(),
      user: auth.currentUser.email
    });
    msgInput.value = "";
  }
};

// Show messages in real-time
const q = query(collection(db, "messages"), orderBy("created"));
onSnapshot(q, (snapshot) => {
  chatBox.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "msg";
    if (data.user === auth.currentUser?.email) {
      div.classList.add("user-msg");
    }
    div.textContent = `${data.user}: ${data.text}`;
    chatBox.appendChild(div);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Auth listener
onAuthStateChanged(auth, user => {
  if (user) {
    authSection.style.display = "none";
    chatSection.style.display = "block";
  } else {
    authSection.style.display = "block";
    chatSection.style.display = "none";
  }
});