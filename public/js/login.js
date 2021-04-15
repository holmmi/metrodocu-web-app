'use strict';
const url = 'https://localhost:8000'; // change url when uploading to server

const loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", () => {
    const modalContainer = document.querySelector(".modal-container");
    modalContainer.style.display = "flex";
});

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    const formData = serializeJson(loginForm);
    console.log(formData);
    const loginError = document.getElementById("login-error");
    const fetchOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    };
    try {
        const response = await fetch(url +"/auth/login", fetchOptions );
        const json = await response.json();
        console.log('login response', json);
        if (response.status === 401) {
            loginError.style.display = "block";
        }
        if (response.redirected) {
            window.location.href = response.url;
        }
        if (!json.user) {
            alert(json.message);
        } else {
            // save token
            sessionStorage.setItem('token', json.token);
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