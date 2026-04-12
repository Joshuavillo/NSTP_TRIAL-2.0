import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===== FIREBASE INIT (UNCHANGED) =====
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

// ===== TABLES (UNCHANGED) =====
const pendingTable = document.querySelector("#pendingTable tbody");
const approvedTable = document.querySelector("#approvedTable tbody");
const archivedTable = document.querySelector("#archivedTable tbody");

// ======================================================
// 🔴 CHANGE #1: LOAD PENDING FROM FIRESTORE (instead of localStorage)
// ======================================================
async function loadAdmin() {
  const snapshot = await getDocs(collection(db, "reports"));

  pendingTable.innerHTML = "";

  let hasData = false;

  snapshot.forEach((docSnap) => {
    const item = docSnap.data();

    // ONLY pending
    if (item.status !== "pending") return;

    hasData = true;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td><img src="${item.image || ""}" width="60"></td>
      <td>${item.itemName}</td>
      <td>${item.itemLocation}</td>
      <td>Pending</td>
      <td>
        <button class="approveBtn" data-id="${docSnap.id}">Approve</button>
        <button class="deleteBtn" data-id="${docSnap.id}">Delete</button>
      </td>
    `;

    pendingTable.appendChild(row);
  });

  if (!hasData) {
    pendingTable.innerHTML = "<tr><td colspan='5'>No pending items</td></tr>";
  }

  attachPendingEvents();
}

// ======================================================
// 🔴 CHANGE #2: APPROVE / DELETE USING FIRESTORE
// ======================================================
function attachPendingEvents() {
  document.querySelectorAll(".approveBtn").forEach((btn) => {
    btn.onclick = async () => {
      await updateDoc(doc(db, "reports", btn.dataset.id), {
        status: "approved",
      });

      loadAdmin();
      loadApprovedItems();
    };
  });

  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.onclick = async () => {
      await deleteDoc(doc(db, "reports", btn.dataset.id));

      loadAdmin();
    };
  });
}

// ======================================================
// 🔴 CHANGE #3: APPROVED FROM FIRESTORE
// ======================================================
async function loadApprovedItems() {
  const snapshot = await getDocs(collection(db, "reports"));

  approvedTable.innerHTML = "";

  let hasData = false;

  snapshot.forEach((docSnap) => {
    const item = docSnap.data();

    if (item.status !== "approved") return;

    hasData = true;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td><img src="${item.image || ""}" width="60"></td>
      <td>${item.itemName}</td>
      <td>${item.itemLocation}</td>
      <td>${item.category}</td>
      <td>Approved</td>
      <td>
        <button class="foundBtn" data-id="${docSnap.id}">Found</button>
        <button class="deleteApprovedBtn" data-id="${docSnap.id}">Remove</button>
      </td>
    `;

    approvedTable.appendChild(row);
  });

  attachApprovedEvents();
}

// ======================================================
// 🔴 CHANGE #4: APPROVED ACTIONS
// ======================================================
function attachApprovedEvents() {
  document.querySelectorAll(".foundBtn").forEach((btn) => {
    btn.onclick = async () => {
      await updateDoc(doc(db, "reports", btn.dataset.id), {
        status: "found",
      });

      loadApprovedItems();
      loadArchivedItems();
    };
  });

  document.querySelectorAll(".deleteApprovedBtn").forEach((btn) => {
    btn.onclick = async () => {
      await deleteDoc(doc(db, "reports", btn.dataset.id));

      loadApprovedItems();
    };
  });
}

// ======================================================
// 🔴 CHANGE #5: ARCHIVED FROM FIRESTORE
// ======================================================
async function loadArchivedItems() {
  const snapshot = await getDocs(collection(db, "reports"));

  archivedTable.innerHTML = "";

  let hasData = false;

  snapshot.forEach((docSnap) => {
    const item = docSnap.data();

    if (item.status !== "found") return;

    hasData = true;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td><img src="${item.image || ""}" width="60"></td>
      <td>${item.itemName}</td>
      <td>${item.itemLocation}</td>
      <td>Found</td>
    `;

    archivedTable.appendChild(row);
  });

  if (!hasData) {
    archivedTable.innerHTML = "<tr><td colspan='4'>No archived items</td></tr>";
  }
}

// ======================================================
// 🔵 INIT (UNCHANGED)
// ======================================================
loadAdmin();
loadApprovedItems();
loadArchivedItems();
