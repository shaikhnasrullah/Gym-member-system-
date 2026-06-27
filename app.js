import { auth, db, storage } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

// Check Login
onAuthStateChanged(auth, (user) => {
  if (!user && location.pathname.includes("dashboard")) {
    window.location.href = "index.html";
  }
});

// Logout
window.logout = async () => {
  await signOut(auth);
  window.location.href = "index.html";
};

// 12-digit unique gym code generator
function generateGymCode() {
  let code = "";
  for (let i = 0; i < 12; i++) {
    code += Math.floor(Math.random() * 10); // 0-9
  }
  return code;
}

// Customer Form
const form = document.getElementById("customerForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("custEmail").value; // for daily motivational email
    const photoFile = document.getElementById("photo").files[0];

    const gymCode = generateGymCode();
    const userId = gymCode; // using the 12-digit code as the unique userId too

    let photoURL = "";

    try {
      if (photoFile) {
        const storageRef = ref(storage, `customer-photos/${userId}.jpg`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "customers"), {
        userId,
        gymCode,
        name,
        phone,
        address,
        email,
        photoURL,
        createdAt: new Date().toISOString()
      });

      alert(`Customer Saved ✅\nGym Code: ${gymCode}`);

      form.reset();
      loadData();
    } catch (error) {
      alert("Error saving customer: " + error.message);
    }
  });
}

// Load Data
async function loadData() {
  const list = document.getElementById("list");

  if (!list) return;

  list.innerHTML = "";

  const snapshot = await getDocs(collection(db, "customers"));

  snapshot.forEach((doc) => {
    const data = doc.data();

    const li = document.createElement("li");
    li.innerHTML = `
      ${data.photoURL ? `<img src="${data.photoURL}" alt="${data.name}" class="thumb">` : ""}
      <b>${data.name}</b><br>
      ${data.phone}<br>
      ${data.address}<br>
      <span class="code">Code: ${data.gymCode || data.userId || "-"}</span>
      <hr>
    `;

    list.appendChild(li);
  });
}

loadData();
