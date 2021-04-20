'use strict';

const siteKey = "6LeGkagaAAAAAC7HkQ4xcmoNENAP9CSyDM0c9gQ7";

const form = document.getElementById("registration-form");
form.addEventListener("submit", async event => {
    event.preventDefault();
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
        }
    } catch (error) {
        console.error(error);
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