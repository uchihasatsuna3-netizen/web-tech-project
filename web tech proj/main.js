// --- FAVORITES LOGIC ---
// 1. Fetch existing favorites from local storage (or start an empty list)
let favorites = JSON.parse(localStorage.getItem("acreo_favorites")) || [];

document.querySelectorAll(".favBtn").forEach(button => {
    // 2. Identify the specific plot by finding its title within the same card
    const cardContainer = button.closest('.card') || button.closest('.cardDtl');
    if (!cardContainer) return; 

    const titleElement = cardContainer.querySelector('.cTitle');
    if (!titleElement) return;

    const plotTitle = titleElement.textContent.trim();

    // 3. On page load, check if this plot is in our saved favorites and update the star
    if (favorites.includes(plotTitle)) {
        button.textContent = "★";
        button.setAttribute("aria-pressed", "true");
    } else {
        button.textContent = "☆";
        button.setAttribute("aria-pressed", "false");
    }

    // 4. Handle clicks to toggle the star AND update local storage
    button.addEventListener("click", () => {
        const isCurrentlyFavorited = button.textContent === "★";

        if (isCurrentlyFavorited) {
            // Remove from favorites
            button.textContent = "☆";
            button.setAttribute("aria-pressed", "false");
            favorites = favorites.filter(title => title !== plotTitle);
        } else {
            // Add to favorites
            button.textContent = "★";
            button.setAttribute("aria-pressed", "true");
            if (!favorites.includes(plotTitle)) {
                favorites.push(plotTitle);
            }
        }

        // Save the updated list back to the browser
        localStorage.setItem("acreo_favorites", JSON.stringify(favorites));
    });
});

// Get elements
var modal = document.getElementById("simpleModal");
var btn = document.getElementById("myAccBtn");
var span = document.getElementsByClassName("closeBtn")[0];

// 1. When you click the button, show the modal
if (btn) {
    btn.onclick = function() {
      modal.style.display = "block";
    }
}

// 2. When you click the (x), hide the modal
if (span) {
    span.onclick = function() {
      modal.style.display = "none";
    }
}

// 3. (Optional) When you click anywhere outside the box, hide it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

const searchInput = document.querySelector('.search-container input');
const phrases = [
    "Search for luxury plots...",
    "Find cherry blossom neighborhoods...",
    "Meet trusted Acreo sellers...",
    "Discover your next digital home..."
];

let phraseIndex = 0;
let characterIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
    if (!searchInput) return; // Prevents crashing on pages without a search bar

    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        // Remove characters
        searchInput.setAttribute('placeholder', currentPhrase.substring(0, characterIndex - 1));
        characterIndex--;
        typeSpeed = 50; // Faster when deleting
    } else {
        // Add characters
        searchInput.setAttribute('placeholder', currentPhrase.substring(0, characterIndex + 1));
        characterIndex++;
        typeSpeed = 100;
    }

    // Logic for switching between typing and deleting
    if (!isDeleting && characterIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at the end of the phrase
    } else if (isDeleting && characterIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500; // Pause before starting new phrase
    }

    setTimeout(type, typeSpeed);
}

// Start the animation
document.addEventListener('DOMContentLoaded', type);

const header = document.querySelector(".main-header");

window.addEventListener("scroll", () => {
    // We check both scrollY and documentElement.scrollTop for browser compatibility
    const scrollPos = window.scrollY || document.documentElement.scrollTop;

    if (scrollPos > 100) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

// --- CAROUSEL LOGIC WITH 3D EFFECT & AUTOPLAY ---
const teamSlides = document.querySelectorAll('.team-carousel .carousel-slide');
const dots = document.querySelectorAll('.team-carousel .dot');
let teamSlideIndex = 0;
let autoPlayTimer;

function updateTeamCarousel() {
    teamSlides.forEach((slide, index) => {
        // Clear existing classes
        slide.classList.remove('active', 'prev', 'next');
        
        // Assign classes based on current index
        if (index === teamSlideIndex) {
            slide.classList.add('active');
        } else if (index === (teamSlideIndex - 1 + teamSlides.length) % teamSlides.length) {
            slide.classList.add('prev');
        } else if (index === (teamSlideIndex + 1) % teamSlides.length) {
            slide.classList.add('next');
        }
    });
    
    // Update active dot
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === teamSlideIndex);
        });
    }
}

function nextTeamSlide() {
    teamSlideIndex = (teamSlideIndex + 1) % teamSlides.length;
    updateTeamCarousel();
    resetAutoPlay();
}

function prevTeamSlide() {
    teamSlideIndex = (teamSlideIndex - 1 + teamSlides.length) % teamSlides.length;
    updateTeamCarousel();
    resetAutoPlay();
}

// Function triggered by clicking the dots
function currentSlide(n) {
    teamSlideIndex = n - 1; // Array is 0-indexed, UI is 1-indexed
    updateTeamCarousel();
    resetAutoPlay();
}

function startAutoPlay() {
    // Automatically swipe to the next slide every 7 seconds (7000ms)
    autoPlayTimer = setInterval(nextTeamSlide, 7000);
}

function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
}

// Event Listeners for the side arrows
const prevBtn = document.querySelector('.team-carousel .prev-btn');
const nextBtn = document.querySelector('.team-carousel .next-btn');

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', prevTeamSlide);
    nextBtn.addEventListener('click', nextTeamSlide);
}

// Allow clicking on the side cards to bring them to the center
teamSlides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
        if (slide.classList.contains('prev') || slide.classList.contains('next')) {
            teamSlideIndex = index;
            updateTeamCarousel();
            resetAutoPlay();
        }
    });
});

// Initialize on load
if (teamSlides.length > 0) {
    updateTeamCarousel();
    startAutoPlay();
}

// --- ACREO AUTHENTICATION SYSTEM ---

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const authBtn = document.getElementById("myAccBtn");

    // Check if a user is already logged in on page load
    const currentUser = sessionStorage.getItem("acreo_user");
    const authUI = document.getElementById("auth-ui");

    if (currentUser && authUI) {
        // Replace the login button and modal with the username and profile image, linked to the profile page
        authUI.innerHTML = `
                <a href="profile.html" style="display: flex; align-items: center; gap: 10px;">
                    <img src="profile.jpg" alt="Profile" class="profile-img" title="${currentUser}'s Profile">
                </a>
                <p class="nav-desc1">${currentUser}</p>
        `;
    }

    // Handle Registration
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // 1. Fetch values using the new, unique IDs
            const user = document.getElementById("regUsername").value.trim();
            const email = document.getElementById("regEmail").value.trim();
            const birthdate = document.getElementById("regBirthdate").value;
            const pass = document.getElementById("regPassword").value;
            const confirmPass = document.getElementById("confirmPassword").value;

            if (pass !== confirmPass) {
                Swal.fire("Error", "Passwords do not match!", "error");
                return;
            }

            let users = JSON.parse(localStorage.getItem("acreo_users")) || [];
            if (users.find(u => u.username === user)) {
                Swal.fire("Error", "Username already taken!", "warning");
                return;
            }

            users.push({ username: user, email: email, password: pass, birthdate: birthdate });
            localStorage.setItem("acreo_users", JSON.stringify(users));

            // 2. Smoothen: Auto-login the user and redirect to home!
            Swal.fire("Success", "Account created successfully!", "success").then(() => {
                sessionStorage.setItem("acreo_user", user);
                window.location.href = "home.html";
            });
        });
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // 3. Use querySelector to ensure we ONLY grab inputs inside the login form
            const user = loginForm.querySelector('input[name="username"]').value.trim();
            const pass = loginForm.querySelector('input[name="password"]').value;

            const users = JSON.parse(localStorage.getItem("acreo_users")) || [];
            const foundUser = users.find(u => u.username === user && u.password === pass);

            if (foundUser) {
                sessionStorage.setItem("acreo_user", user);
                Swal.fire("Welcome", `Logged in as ${user}`, "success").then(() => {
                    window.location.href = "home.html";
                });
            } else {
                Swal.fire("Error", "Invalid credentials!", "error");
            }
        });
    }
});

// --- PROFILE & REDIRECT LOGIC ---

document.addEventListener("DOMContentLoaded", () => {
    const currentUser = sessionStorage.getItem("acreo_user");
    const path = window.location.pathname;

    // 1. If user is logged in and visits register.html, send them to profile.html
    if (currentUser && path.includes("register.html")) {
        window.location.href = "profile.html";
    }

    // 2. If user is NOT logged in and tries to see profile.html, send them to login
    if (!currentUser && path.includes("profile.html")) {
        window.location.href = "register.html";
    }

    // 3. Populate Profile Page Data
    if (path.includes("profile.html") && currentUser) {
        const users = JSON.parse(localStorage.getItem("acreo_users")) || [];
        const userData = users.find(u => u.username === currentUser);

        if (userData) {
            document.getElementById("profUser").textContent = userData.username;
            document.getElementById("profEmail").textContent = userData.email;
            document.getElementById("profBirthdate").textContent = userData.birthdate;
        }

        // Setup Logout Button for Profile Page specifically
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.onclick = () => {
                sessionStorage.removeItem("acreo_user");
                Swal.fire("Logged Out", "Redirecting...", "success").then(() => {
                    window.location.href = "home.html";
                });
            };
        }
    }
});

// --- SELL PAGE FORM LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    const sellForm = document.getElementById("sellForm");

    // Check if the sell form exists on the current page
    if (sellForm) {
        sellForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Prevents the default page reload

            // Trigger the SweetAlert success popup
            Swal.fire({
                title: "Listing Submitted!",
                text: "Your plot has been successfully submitted for review.",
                icon: "success",
                confirmButtonColor: "#F5AFAF" // Matches your Acreo pink theme
            }).then(() => {
                // Clear the plot info form fields
                sellForm.reset();
                
                // Also clear the contact info form (since it's a separate <form> tag in your HTML)
                const contactForm = document.querySelector(".sellForm > form:first-child");
                if (contactForm) contactForm.reset();
            });
        });
    }
});