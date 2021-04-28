'use strict';

const mobileMenu = document.getElementById("mobile-menu");
mobileMenu.addEventListener("click", () => {
    const menuContainer = document.getElementsByClassName("mobile-menu-container")[0];
    if (mobileMenu.innerText === "menu") {
        mobileMenu.innerText = "close";
        menuContainer.style.display = "block";
    } else {
        mobileMenu.innerText = "menu";
        menuContainer.style.display = "none";
    }
});

window.addEventListener("dragover", (event) => {
    if (event.target.id !== "drop-zone") {
        event.preventDefault();
    }
}, false);

window.addEventListener("drop", (event) => {
    if (event.target.id !== "drop-zone") {
        event.preventDefault();
    }
}, false);

const searchIcons = document.querySelectorAll(".search-container span");
const searchForms = document.querySelectorAll(".search-container form");
searchIcons.forEach((icon, index) => {
    icon.addEventListener("click", () => {
        searchForms[index].submit();
    });
});