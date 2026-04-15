import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
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

// ================= CAROUSEL =================
document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".carousel-container");
  const track = document.querySelector(".carousel-track");
  if (!track) return;

  const slides = Array.from(track.children);
  const prevBtn = document.querySelector(".crsl-btn");
  const nextBtn = document.querySelector(".crsl-btn2");
  const indicators = document.querySelectorAll(".indicator");

  let currentIndex = 0;
  const slideWidth = 205;

  function updateCarousel() {
    const containerWidth = container.offsetWidth;
    const slideWidth = slides[currentIndex].offsetWidth;

    // Calculate where the active slide starts (sum of all previous slides + gaps)
    let slideStart = 0;
    for (let i = 0; i < currentIndex; i++) {
      slideStart += slides[i].offsetWidth + 25; // 25 = gap
    }

    // Center it: shift so slide center aligns with container center
    const offset = slideStart - containerWidth / 2 + slideWidth / 2;

    track.style.transform = `translateX(${-offset}px)`;

    slides.forEach((s, i) => s.classList.toggle("active", i === currentIndex));
    indicators.forEach((d, i) =>
      d.classList.toggle("active", i === currentIndex),
    );
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  nextBtn?.addEventListener("click", nextSlide);
  prevBtn?.addEventListener("click", prevSlide);

  indicators.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      currentIndex = i;
      updateCarousel();
    });
  });

  updateCarousel();
});

// ================= LOST & FOUND =================
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addItemBtn");
  const modal = document.getElementById("itemModal");
  const saveBtn = document.getElementById("saveItem");
  const containerItems = document.getElementById("itemsContainer");

  if (!addBtn || !modal || !saveBtn) return;

  // ================= DATE INPUT ENHANCEMENT =================
  const dateInput = document.getElementById("date");
  if (dateInput) {
    dateInput.addEventListener("focus", function () {
      this.showPicker(); // Opens date picker on focus (modern browsers)
    });

    dateInput.addEventListener("change", function () {
      const wrapper = this.closest(".date-wrapper");
      const placeholder = wrapper.querySelector(".date-placeholder");
    });
  }

  // OPEN
  addBtn.addEventListener("click", () => {
    modal.classList.add("show");
  });

  // CLOSE
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
    }
  });

  // SAVE TO FIREBASE
  saveBtn.addEventListener("click", async () => {
    const name = document.getElementById("itemName").value.trim();
    const location = document.getElementById("itemLocation").value.trim();
    const status = document.getElementById("itemType").value;
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const file = document.getElementById("itemImage").files[0];

    console.log("FORM DATA:", { name, location, status, date, category });

    if (!name || !location || !date) {
      showAlert("Please fill all required fields!");
      return;
    }

    try {
      console.log("Saving to Firebase...");

      const saveData = async (imageData) => {
        await addDoc(collection(db, "reports"), {
          itemName: name,
          itemLocation: location,
          itemType: status,
          date: date,
          category: category,
          image: imageData, // 🔥 image saved here
          status: "pending",
          createdAt: new Date(),
        });

        console.log("Saved to Firebase!");
        showAlert("Saved successfully! Thank you for reporting.");

        // clear form
        document.getElementById("itemName").value = "";
        document.getElementById("itemLocation").value = "";
        document.getElementById("date").value = "";
        document.getElementById("itemImage").value = "";
      };

      if (file) {
        const reader = new FileReader();

        reader.onload = async function () {
          const imageData = reader.result; // base64 image
          await saveData(imageData);
        };

        reader.readAsDataURL(file);
      } else {
        // no image uploaded
        await saveData("");
      }
    } catch (error) {
      console.error("Firebase error:", error);
      alert("Failed to save");
    }
  });
});

// ================= FILE INPUT =================
document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("itemImage");
  const fileName = document.getElementById("fileName");

  if (!fileInput || !fileName) return;

  fileInput.addEventListener("change", () => {
    fileName.textContent =
      fileInput.files.length > 0 ? fileInput.files[0].name : "No file chosen";
  });
});
// ================= SECTION NAVIGATION =================
function showSection(sectionId) {
  const sections = document.querySelectorAll(".content-section");

  sections.forEach((sec) => {
    sec.classList.remove("active");
  });

  const target = document.getElementById(sectionId);
  if (target) target.classList.add("active");

  
  const links = document.querySelectorAll(".menu a");
  links.forEach((link) => link.classList.remove("active"));

  
  if (event && event.target) {
    event.target.classList.add("active");
  }
}

function showAlert(message, type = "success") {
  const alertBox = document.getElementById("customAlert");

  alertBox.textContent = message;
  alertBox.className = "custom-alert show"; // reset

  if (type === "error") alertBox.classList.add("error");
  if (type === "warning") alertBox.classList.add("warning");

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 3000);
}
