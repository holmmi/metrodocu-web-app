'use strict';

let visibilities = [];
let selectedVisibility = 0;

const visibilityButton = document.getElementById("visibility-button");
visibilityButton.addEventListener("click", () => {
    const dropdownItems = document.getElementsByClassName("dropdown-menu")[0];
    if (dropdownItems.style.display === "block") {
        dropdownItems.style.display = "none";
        return;
    }
    if (dropdownItems.children.length === 0) {
        visibilities.forEach((visibility, index) => {
            const dropdownItem = document.createElement("div");
            dropdownItem.className = "dropdown-item";
            dropdownItem.innerText = visibility.visibility_description;
            dropdownItem.addEventListener("click", () => {
                selectedVisibility = index;
                visibilityButton.innerText = visibilities[selectedVisibility].visibility_description;
                dropdownItems.style.display = "none";
            });
            dropdownItems.appendChild(dropdownItem);
        });
    }
    dropdownItems.style.display = "block";
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/story/visibility");
        visibilities = await response.json();
        visibilityButton.innerText = visibilities[selectedVisibility].visibility_description;
    } catch (error) {
        console.error(error);
    }
});