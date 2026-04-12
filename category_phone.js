import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
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

const container = document.getElementById("phoneContainer");

async function loadPhoneItems() {
  const snapshot = await getDocs(collection(db, "reports"));

  container.innerHTML = "";

  let count = 0;

  snapshot.forEach((docSnap) => {
    const item = docSnap.data();

    const category = (item.category || "").trim().toLowerCase();
    const status = (item.status || "").trim().toLowerCase();

    if (status !== "approved") return;
    if (category !== "phone") return;

    count++;

    const card = document.createElement("div");
    card.className = "item-card";

    card.innerHTML = `
      <div class="slide-avatar" style="background-image:url('${item.image || ""}')"></div>
      <h4>${item.itemName || ""}</h4>
      <p>Status: ${item.itemType || ""}</p>
      <p>Location: ${item.itemLocation || ""}</p>
      <p>Date: ${item.date || ""}</p>
    `;

    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      console.log("Card clicked");
      showModal(card);
    });

    container.appendChild(card);
  });

  if (count === 0) {
    container.innerHTML = "<p>No items found</p>";
  }
}
function showModal(card) {
  console.log("Modal triggered");

  const avatar = card.querySelector(".slide-avatar");
  const style = avatar.getAttribute("style");
  const urlMatch = style.match(/url\(['"]?(.*?)['"]?\)/);
  const imgSrc = urlMatch ? urlMatch[1] : "";

  const paragraphs = card.querySelectorAll("p");
  const title = card.querySelector("h4").textContent;
  const status = paragraphs[0]?.textContent || "";
  const location = paragraphs[1]?.textContent || "";
  const date = paragraphs[2]?.textContent || "";

  document.getElementById("modal-img").src = imgSrc;
  document.getElementById("modal-location").textContent = title;
  document.getElementById("modal-comments").textContent =
    `${status}\n${location}\n${date}`;

  document.getElementById("itemModal").classList.add("active");
}

function closeModal() {
  document.getElementById("itemModal").classList.remove("active");
}

// click outside modal to close
document.addEventListener("click", (e) => {
  const modal = document.getElementById("itemModal");

  if (e.target === modal) {
    closeModal();
  }
});

loadPhoneItems();
