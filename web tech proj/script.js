document.querySelectorAll(".favBtn").forEach(button => {
    button.addEventListener("click", () => {
        const filled = button.textContent === "★";

        button.textContent = filled ? "☆" : "★";
        button.setAttribute("aria-pressed", String(!filled));
    })
})
