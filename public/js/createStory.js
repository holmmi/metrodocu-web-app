'use strict';

const fileUpload = new FileUpload(["image/png", "image/gif", "image/jpg", "image/jpeg"], 1);

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
    requestBody.files = fileUpload.getFiles();
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

const uploadSection = document.querySelector(".upload-section");
    uploadSection.addEventListener("drop", async (event) => {
    event.preventDefault();
    const items = event.dataTransfer.items;
    fileUpload.addFiles(items);
});

const filesInput = document.getElementById("files");

uploadSection.addEventListener("click", () => filesInput.click());

filesInput.addEventListener("change", async () => {
    const fileList = this.files.files;
    fileUpload.addFilesFromSelection(fileList);
}, false);

const addFileToSection = file => {
    const p = document.createElement("p");
    p.innerText = file.name;
    p.className = file.type.startsWith("image") ? "image-upload" : "document-upload";
    uploadSection.appendChild(p);
    p.addEventListener("click", (event) => {
      event.stopPropagation();
      removeFileFromSection(p);
    });
    document.querySelector(".upload-instructions").style.display = "none";
};

const removeFileFromSection = (target) => {
    const paragraphs = document.querySelectorAll(".upload-section p");
    paragraphs.forEach((paragraph, index) => {
      if (paragraph === target) {
        fileUpload.removeFile(index);
        uploadSection.removeChild(paragraph);
      }
    });
    if (paragraphs.length <= 1) {
      document.querySelector(".upload-instructions").style.display = "block";
    }
}