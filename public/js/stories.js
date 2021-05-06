'use strict';

let stories = null;

const loadStories = async () => {
    try {
        const response = await fetch("/story?visibility=" + visibilities[selectedVisibility].visibility_id);
        const result = await response.json();
        const storyContainer = document.querySelector(".story-container");
        storyContainer.innerHTML = "";
        if (response.ok) {  
            stories = result.map(story => {
                return {...story, isLiked: story.isLiked > 0 ? true : false};
            });
            stories.forEach((story) => {
                const figure = document.createElement("figure");
                figure.className = "story";
                
                const img = document.createElement("img");
                img.alt = "Cover photo";
                img.src = "/covers/" + story.cover_photo;
                figure.appendChild(img);

                const figcaption = document.createElement("figcaption");
                const divHeader = document.createElement("div");
                divHeader.className = "story-header";
                divHeader.innerHTML = `<a href="/stories/${story.story_id}">${story.story_name}</a>`;
                figcaption.appendChild(divHeader);

                const divDescription = document.createElement("div");
                divDescription.className = "story-description";
                divDescription.innerText = story.story_description;
                figcaption.appendChild(divDescription);

                const divSocial = document.createElement("div");
                divSocial.className = "story-social";
                
                const divLikes = document.createElement("div");
                divLikes.className = "story-likes";
                divLikes.innerText = story.likes;
                if (typeof story.isLiked !== "undefined") {
                    divLikes.style.cursor = "pointer";
                    divLikes.addEventListener("click", async () => {
                        if (!story.isLiked) {
                            const likeResponse = await fetch("/story/like/" + story.story_id, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            });
                            if (likeResponse.ok) {
                                story.isLiked = true;
                                const likes = parseInt(divLikes.innerText, 10) + 1;
                                divLikes.innerText = likes;
                            }
                        }
                    });
                }
                divSocial.appendChild(divLikes);

                const divComments = document.createElement("div");
                divComments.className = "story-comments"
                divComments.innerText = story.comments;
                divSocial.appendChild(divComments);

                figcaption.appendChild(divSocial);
                figure.appendChild(figcaption);

                storyContainer.appendChild(figure);
            });
        }
        if (!response.ok || result.length === 0) {
            const h2 = document.createElement("h2");
            h2.innerText = "There are no stories.";
            storyContainer.appendChild(h2);
        }
    } catch (error) {
        console.error(error);
    }
};

const clickCreateStory = () => {
    window.location.href = "/stories/create-story";
};