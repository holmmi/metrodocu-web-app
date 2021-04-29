'use strict';

const form = document.getElementById("create-story-form");
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.delete("files");
    formData.append("svisibility", visibilities[selectedVisibility].visibility_id);
    const requestBody = {};
    formData.forEach((value, key) => {
        requestBody[key] = value;
    });
    requestBody.files = files.filter(file => file);
    try {
        const response = await fetch("/story/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });
        const result = await response.json();
        if (response.ok) {
            window.location.href = "/stories/" + result.storyId;
        } else {
            console.log(JSON.stringify(result));
        }
    } catch (error) {
        console.error(error);
    }
});

const files = [];

const uploadSection = document.querySelector(".upload-section");
    uploadSection.addEventListener("drop", async (event) => {
    event.preventDefault();
    if (files.length < 1) {
        const items = event.dataTransfer.items;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].kind === "file") {
                    const file = items[i].getAsFile();
                    if (file.type.startsWith("image")) {
                        try {
                            files.push({name: file.name, type: file.type, content: await getBase64EncodedString(file)});
                            addFileToSection(file);
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
            }
        }
    }
});

const filesInput = document.getElementById("files");

uploadSection.addEventListener("click", () => filesInput.click());

filesInput.addEventListener("change", async () => {
    const fileList = this.files.files;
    const file = fileList[fileList.length - 1];
    try {
        if (files.length < 1 && file.type.startsWith("image")) {
            files.push({name: file.name, type: file.type, content: await getBase64EncodedString(file)});
            addFileToSection(file);
        }
    } catch (error) {
        console.error(error);
    }
 }, false);

 const getBase64EncodedString = (file) => {
     return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.addEventListener("load", () => {
                resolve(fileReader.result.split(",")[1]);
            });
            fileReader.addEventListener("error", () => {
                reject(fileReader.error);
            });
     });
 }

 const addFileToSection = async file => {
    const p = document.createElement("p");
    p.innerText = file.name;
    p.className = file.type.startsWith("image") ? "image-upload" : "document-upload";
    uploadSection.appendChild(p);
    const paragraphs = document.querySelectorAll(".upload-section p");
    paragraphs.forEach((paragraph, index) => {
        paragraph.addEventListener("click", (event) => {
            event.stopPropagation();
            files.splice(index, 1);
            uploadSection.removeChild(paragraph);
        });
    });
    document.querySelector(".upload-instructions").style.display = "none";
 };