'use strict';

const siteKey = "6LeGkagaAAAAAC7HkQ4xcmoNENAP9CSyDM0c9gQ7";

let allowSubmit = false;

const form = document.getElementById("registration-form");
form.addEventListener("submit", async event => {
    event.preventDefault();
    if (allowSubmit) {
        try {
            const token = await validateCaptcha();
            const formData = new FormData(event.target);
            formData.append("token", token);
            const bodyData = {};
            formData.forEach((value, key) => {
                bodyData[key] = value;
            });
            const response = await fetch("/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyData)
            });
            const result = await response.json(response);
            if (response.ok) {
                window.location.href = "/";
            } else {
                const inputContainers = document.querySelectorAll("#registration-form .input-container");
                inputContainers.forEach(inputContainer => {
                    const input = inputContainer.querySelector("input");
                    let div = inputContainer.querySelector(".form-error");
                    if (div) {
                        inputContainer.removeChild(div);
                    }
                    result.errors.forEach(error => {
                        if (input.name === error.param) {
                            div = document.createElement("div");
                            div.className = "form-error";
                            div.innerText = error.msg;
                            inputContainer.appendChild(div);
                        }
                    });
                    
                });
            }
        } catch (error) {
            console.error(error);
        } 
    }
});

// Get captcha response by utilizing the site key defined above
const validateCaptcha = () => {
    return new Promise((resolve, reject) => {
        grecaptcha.ready(() => {
            grecaptcha.execute(siteKey, {action: 'submit'})
                .then(token => resolve(token))
                .catch(error => reject(error));
        });
    });
};

const username = document.getElementById("username");
let checkTimeout = null;
username.addEventListener("input", event => {
    const u = event.target.value;
    clearTimeout(checkTimeout);
    if (u.length >= 5) {
        checkTimeout = setTimeout(async () => {
            try {
                const response = await fetch("/auth/availability?username=" + u);
                const result = await response.json();
                if (response.ok) {
                    const inputContainer = username.parentElement;
                    let div = inputContainer.querySelector(".form-error");
                    if (!result.available) {
                        allowSubmit = false;
                        if (div) {
                            div.innerText = "This username is already taken.";
                        } else {
                            div = document.createElement("div");
                            div.className = "form-error";
                            div.innerText = "This username is already taken.";
                            inputContainer.appendChild(div);
                        }
                    } else {
                        allowSubmit = true;
                        if (div) {
                            inputContainer.removeChild(div);
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }, 1000);
    }
});