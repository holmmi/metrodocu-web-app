'use strict';

const loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", () => {
    const modalContainer = document.querySelector(".modal-container");
    modalContainer.style.display = "flex";
});

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    const formData = new URLSearchParams(new FormData(event.target));
    const loginError = document.getElementById("login-error");
    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            body: formData
        });
        if (response.status === 401) {
            loginError.style.display = "block";
        } 
        if (response.redirected) {
            window.location.href = response.url;
        }
    } catch (error) {
        console.error(error);
        loginError.style.display = "block";
        loginError.innerText = "Service is down. Please try again later."
    }
    
});

const dialogFooter = document.getElementsByClassName("modal-footer")[0];
const modalButtons = dialogFooter.children;
modalButtons[0].addEventListener("click", () => {
    loginForm.dispatchEvent(new Event("submit"));
});
modalButtons[1].addEventListener("click", () => {
    const modalContainer = document.querySelector(".modal-container");
    modalContainer.style.display = "none";
});