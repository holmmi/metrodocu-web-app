'use strict';

let visibilities = [];
let selectedVisibility = 0;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/story/visibility");
        if (response.ok) {
            visibilities = await response.json();
        
            const dropdownContainer = document.querySelector(".dropdown-container");
            const dropdownMenu = document.createElement("div");
            dropdownMenu.className = "dropdown-menu";
            dropdownMenu.style.display = "none";

            const button = document.createElement("button");
            button.type = "button";
            button.className = "primary dropdown";
            button.innerText = "Visibility";
            button.innerText = visibilities[selectedVisibility].visibility_description;
            button.addEventListener("click", () => {
                if (dropdownMenu.style.display === "none") {
                    dropdownMenu.style.display = "block";
                } else {
                    dropdownMenu.style.display = "none";
                }
            })
            dropdownContainer.appendChild(button);
            dropdownContainer.appendChild(dropdownMenu);

            visibilities.forEach((visibility, index) => {
                const dropdownItem = document.createElement("div");
                dropdownItem.className = "dropdown-item";
                dropdownItem.innerText = visibility.visibility_description;
                dropdownMenu.appendChild(dropdownItem);
                dropdownItem.addEventListener("click", () => {
                    button.innerText = visibility.visibility_description;
                    selectedVisibility = index;
                    dropdownMenu.style.display = "none";
                })
            });
        }
    } catch (error) {
        console.error(error);
    }
});