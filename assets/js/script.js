// ============================================
//  NEXUSPLAY — script.js
//  Enhancements: Modal, Form Validation,
//  Toast Notifications, Scroll Reveal,
//  Responsive Navbar, Scroll Effects
// ============================================

// --- Load Components ---
document.addEventListener("DOMContentLoaded", () => {
  const basePath = window.location.pathname.includes("/pages/") ? "../" : "";

loadComponent("navbar", basePath + "components/navbar.html", initNavbar);
loadComponent("footer", basePath + "components/footer.html");
  initScrollReveal();
  setActivePage();
});

function loadComponent(id, file, callback) {
  fetch(file)
    .then(res => {
      if (!res.ok) throw new Error("Component not found: " + file);
      return res.text();
    })
    .then(data => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = data;
        if (callback) callback();
      }
    })
    .catch(err => console.warn(err.message));
}

// --- Navbar: Scroll Effect + Hamburger ---
function initNavbar() {
  const nav = document.querySelector(".navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  // Scroll effect
  window.addEventListener("scroll", () => {
    if (nav) {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    }
  });

  setActivePage();
}

// --- Set Active Nav Link based on current page ---
function setActivePage() {
  const links = document.querySelectorAll(".nav-link");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  links.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

// --- Hamburger Toggle ---
function toggleMenu() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  if (hamburger && navLinks) {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  }
}

// Close menu on nav link click (mobile)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("nav-link")) {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    if (hamburger) hamburger.classList.remove("open");
    if (navLinks) navLinks.classList.remove("open");
  }
});

// ============================================
//  MODAL
// ============================================
function openModal() {
  const overlay = document.getElementById("modal-overlay");
  if (overlay) {
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  if (overlay) {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ============================================
//  FORM VALIDATION — Registration Modal
// ============================================
function validateForm() {
  const gamertag = document.getElementById("gamertag");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const submitBtn = document.getElementById("submit-btn");

  if (!gamertag || !email || !password) return;

  let valid = true;

  // Gamertag
  if (gamertag.value.trim().length < 3) {
    setError("gamertag", "Gamertag must be at least 3 characters.");
    valid = false;
  } else {
    clearError("gamertag");
  }

  // Email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    setError("email", "Enter a valid email address.");
    valid = false;
  } else {
    clearError("email");
  }

  // Password
  const pw = password.value;
  if (pw.length < 8) {
    setError("password", "Password must be at least 8 characters.");
    valid = false;
  } else {
    clearError("password");
  }

  updatePasswordStrength(pw);

  if (submitBtn) submitBtn.disabled = !valid;
  return valid;
}

function setError(id, message) {
  const input = document.getElementById(id);
  const error = document.getElementById(id + "-error");
  if (input) input.classList.add("error");
  if (error) error.textContent = message;
}

function clearError(id) {
  const input = document.getElementById(id);
  const error = document.getElementById(id + "-error");
  if (input) input.classList.remove("error");
  if (error) error.textContent = "";
}

function updatePasswordStrength(pw) {
  const fill = document.getElementById("strength-fill");
  const label = document.getElementById("strength-label");
  if (!fill || !label) return;

  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;

  const levels = [
    { width: "0%", color: "transparent", text: "" },
    { width: "25%", color: "#ff4444", text: "Weak" },
    { width: "50%", color: "#ff8800", text: "Fair" },
    { width: "75%", color: "#ffd700", text: "Good" },
    { width: "100%", color: "#00e5ff", text: "Strong" },
  ];

  const level = levels[score];
  fill.style.width = level.width;
  fill.style.background = level.color;
  label.textContent = level.text;
  label.style.color = level.color;
}

function submitForm() {
  if (!validateForm()) return;

  const gamertag = document.getElementById("gamertag").value.trim();
  closeModal();
  showToast(`&#9670; Welcome, ${gamertag}! Account created.`, "success");

  // Reset form
  ["gamertag", "email", "password"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
    clearError(id);
  });

  const fill = document.getElementById("strength-fill");
  const label = document.getElementById("strength-label");
  if (fill) fill.style.width = "0%";
  if (label) label.textContent = "";

  const btn = document.getElementById("submit-btn");
  if (btn) btn.disabled = true;
}

// ============================================
//  FORM VALIDATION — Contact Form
// ============================================
function validateContact() {
  const name = document.getElementById("c-name");
  const email = document.getElementById("c-email");
  const subject = document.getElementById("c-subject");
  const message = document.getElementById("c-message");
  const submitBtn = document.getElementById("contact-submit");

  if (!name || !email || !subject || !message) return;

  let valid = true;

  if (name.value.trim().length < 2) {
    setContactError("c-name", "Please enter your name.");
    valid = false;
  } else { clearContactError("c-name"); }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    setContactError("c-email", "Enter a valid email.");
    valid = false;
  } else { clearContactError("c-email"); }

  if (!subject.value) {
    setContactError("c-subject", "Please select a topic.");
    valid = false;
  } else { clearContactError("c-subject"); }

  if (message.value.trim().length < 10) {
    setContactError("c-message", "Message must be at least 10 characters.");
    valid = false;
  } else { clearContactError("c-message"); }

  if (submitBtn) submitBtn.disabled = !valid;
}

function setContactError(id, msg) {
  const el = document.getElementById(id);
  const err = document.getElementById(id + "-error");
  if (el) el.classList.add("error");
  if (err) err.textContent = msg;
}

function clearContactError(id) {
  const el = document.getElementById(id);
  const err = document.getElementById(id + "-error");
  if (el) el.classList.remove("error");
  if (err) err.textContent = "";
}

function submitContact() {
  if (document.getElementById("contact-submit")?.disabled) return;

  ["c-name", "c-email", "c-subject", "c-message"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = el.tagName === "SELECT" ? "" : "";
    clearContactError(id);
  });

  const btn = document.getElementById("contact-submit");
  if (btn) btn.disabled = true;

  showToast("&#9993; Message sent! We'll get back to you soon.", "success");
}

// ============================================
//  TOAST NOTIFICATION
// ============================================
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.innerHTML = message;
  toast.className = `toast ${type} show`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

// Legacy support for the original showAlert function
function showAlert() {
  showToast("&#9654; Button clicked!", "success");
}

// ============================================
//  SCROLL REVEAL
// ============================================
function initScrollReveal() {
  const targets = document.querySelectorAll(
    ".game-card, .lb-row:not(.lb-header), .team-card, .contact-card, .stat, .hex, .astat"
  );

  targets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  targets.forEach(el => observer.observe(el));
}