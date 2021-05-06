const id = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);

const modal = document.getElementById("story-modal");
const showStoryModal = () => {
  modal.style.display = "flex";
};

const closeStoryModal = () => {
  modal.style.display = "none";
};

const storyForm = document.getElementById("update-story");
storyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  formData.append("svisibility", visibilities[selectedVisibility].visibility_id);
  const json = {};
  formData.forEach((key, value) => {
    json[key] = value;
  });
  try {
    const response = await fetch("/story/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(json)
    });
    const result = await response.json();
    if (response.ok) {
      // Update the story without refreshing page
    }
    if (response.status === 400) {
      
    }
  } catch (error) {
    console.error(error);
  }
});

// File uploads
const fileUpload = new FileUpload(["application/pdf", "image/png", "image/gif", "image/jpg", "image/jpeg"], 10);

const uploadSection = document.querySelector(".upload-section");
if (uploadSection) {
  uploadSection.addEventListener("drop", (event) => {
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
}

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

const uploadItems = async () => {
  try {
    const files = fileUpload.getFiles();
    if (files.length> 0) {
      const response = await fetch("/story/upload/" + id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(files)
      });
      if (response.ok) {
        location.reload();
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Load the comments
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/story/" + id + "/comment");
    if (response.ok) {
      const result = await response.json();
      const comments = document.querySelector(".comments");
      result.comments.forEach(comment => {
        const commentDiv = document.createElement("div");
        commentDiv.className = "comment";

        const author = document.createElement("author");
        author.className = "comment-author";
        author.innerText = comment.username;
        commentDiv.appendChild(author);

        const time = document.createElement("div");
        time.className = "comment-time";
        time.innerText = comment.time;
        commentDiv.appendChild(time);

        const content = document.createElement("p");
        content.className = "medium";
        content.innerText = comment.comment;
        commentDiv.appendChild(content);

        if (result.admin) {
          const commentActions = document.createElement("div");
          commentActions.className = "comment-actions";
          
          const removeCommentLink = document.createElement("a");
          removeCommentLink.href = `/story/comment/${comment.comment_id}`;
          removeCommentLink.innerText = "Remove";
          removeCommentLink.addEventListener("click", removeComment);
          commentActions.appendChild(removeCommentLink);

          commentDiv.appendChild(commentActions);
        }

        const commentInput = document.querySelector(".comment-input");
        if (commentInput) {
          comments.insertBefore(commentDiv, commentInput);
        } else {
          comments.appendChild(commentDiv);
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
});

const addComment = async () => {
  const commentField = document.querySelector("input[name=comment]")
  if (commentField.value.length > 0) {
    try {
      const response = await fetch("/story/" + id + "/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({comment: commentField.value})
      });
      if (response.ok) {
        const result = await response.json();
        
        const comments = document.querySelector(".comments");

        const comment = document.createElement("div");
        comment.className = "comment";

        const author = document.createElement("author");
        author.className = "comment-author";
        author.innerText = result.username;
        comment.appendChild(author);

        const time = document.createElement("div");
        time.className = "comment-time";
        time.innerText = result.time;
        comment.appendChild(time);

        const content = document.createElement("p");
        content.className = "medium";
        content.innerText = result.comment;
        comment.appendChild(content);

        if (result.admin) {
          const commentActions = document.createElement("div");
          commentActions.className = "comment-actions";
          
          const removeCommentLink = document.createElement("a");
          removeCommentLink.href = `/story/comment/${result.commentId}`;
          removeCommentLink.innerText = "Remove";
          removeCommentLink.addEventListener("click", removeComment);
          commentActions.appendChild(removeCommentLink);

          comment.appendChild(commentActions);
        }

        comments.insertBefore(comment, document.querySelector(".comment-input"));

        commentField.value = "";
      }
    } catch (error) {
      console.error(error);
    }
  }
};

const removeComment = async (event) => {
  event.preventDefault();
  try {
    const a = event.target;
    const url = a.href;
    const response = await fetch(url, { method: "DELETE" });
    if (response.ok) {
      const comment = a.parentElement.parentElement;
      document.querySelector(".comments").removeChild(comment);
    }
  } catch (error) {
    console.error(error);
  }
};