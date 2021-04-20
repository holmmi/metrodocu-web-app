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