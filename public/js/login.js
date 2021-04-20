'use strict';

const modalContainer = document.querySelector(".modal-container");
document.getElementById("login-button").addEventListener("click", () => {
    modalContainer.style.display = "flex";
});
document.getElementById("login-link").addEventListener("click", () => {
    modalContainer.style.display = "flex";
});

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const json = {};
    formData.forEach((value, key) => {
        json[key] = value;
    });
    const loginError = document.getElementById("login-error");
    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            body: JSON.stringify(json),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            location.reload();
        }
        if (response.status === 401) {
            loginError.style.display = "block";
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

const registerButton = document.getElementById("register-button");
registerButton.addEventListener("click", () => {
    window.location.href = "/register";
});