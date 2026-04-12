import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDb0jhgbtfNnG-yu74BXyJGuOEFM_pUoqU",
  authDomain: "nstp-73407.firebaseapp.com",
  projectId: "nstp-73407",
  storageBucket: "nstp-73407.firebasestorage.app",
  messagingSenderId: "268433673379",
  appId: "1:268433673379:web:6f8fe43a0dfd34d7574316",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const container = document.getElementById("walletContainer");

function loadWalletItems() {
  onSnapshot(collection(db, "reports"), (snapshot) => {
    container.innerHTML = "";
    let count = 0;

    snapshot.forEach((docSnap) => {
      const item = docSnap.data();

      const category = (item.category || "").trim().toLowerCase();
      const status = (item.status || "").trim().toLowerCase();

      if (status !== "approved") return;
      if (category !== "wallet") return;

      count++;

      const card = document.createElement("div");
      card.className = "item-card";
      card.style.cursor = "pointer";

      // ✅ Store data here so showModal doesn't need to parse the DOM
      card.dataset.image = item.image || "";
      card.dataset.name = item.itemName || "";
      card.dataset.type = item.itemType || "";
      card.dataset.location = item.itemLocation || "";
      card.dataset.date = item.date || "";

      card.innerHTML = `
        <div class="slide-avatar" style="background-image:url('${item.image || ""}')"></div>
        <h4>${item.itemName || ""}</h4>
        <p>Status: ${item.itemType || ""}</p>
        <p>Location: ${item.itemLocation || ""}</p>
        <p>Date: ${item.date || ""}</p>
      `;

      card.addEventListener("click", () => showModal(card));
      container.appendChild(card);
    });

    if (count === 0) {
      container.innerHTML = "<p>No wallet items found</p>";
    }
  });
}

function showModal(card) {
  document.getElementById("modal-img").src = card.dataset.image;
  document.getElementById("modal-location").textContent = card.dataset.name;
  document.getElementById("modal-comments").textContent =
    `Status: ${card.dataset.type}\nLocation: ${card.dataset.location}\nDate: ${card.dataset.date}`;

  document.getElementById("itemModal").classList.add("active");
}

document.addEventListener("click", (e) => {
  const modal = document.getElementById("itemModal");
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});

loadWalletItems();
