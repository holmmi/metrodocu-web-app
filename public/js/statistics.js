'use strict';

const topLikers = document.querySelector('#top-likers');
const topCommenters = document.querySelector('#top-commenters');
const topLiked = document.querySelector('#top-liked');
const topCommented = document.querySelector('#top-commented');

const addUserLikes = (likes) => {
    topLikers.innerHTML = '';

    likes.forEach((like) => {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = like.username;
        const td2 = document.createElement('td');
        td2.textContent = like.likes;
        tr.appendChild(td);
        tr.appendChild(td2);
        topLikers.appendChild(tr);
    });
};

const addUserComments = (comments) => {
    topCommenters.innerHTML = '';

    comments.forEach((comment) => {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = comment.username;
        const td2 = document.createElement('td');
        td2.textContent = comment.comments;
        tr.appendChild(td);
        tr.appendChild(td2);
        topCommenters.appendChild(tr);
    });
};

const addStoryLikes = (likes) => {
    topLiked.innerHTML = '';

    likes.forEach((like) => {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        const a = document.createElement('a');
        a.href = `/stories/${like.story_id}`;
        a.textContent = like.story_name;
        td.appendChild(a);
        const td2 = document.createElement('td');
        td2.textContent = like.likes;
        tr.appendChild(td);
        tr.appendChild(td2);
        topLiked.appendChild(tr);
    });
};

const addStoryComments = (comments) => {
    topCommented.innerHTML = '';

    comments.forEach((comment) => {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        const a = document.createElement('a');
        a.href = `/stories/${comment.id}`;
        a.textContent = comment.name;
        td.appendChild(a);
        const td2 = document.createElement('td');
        td2.textContent = comment.comments;
        tr.appendChild(td);
        tr.appendChild(td2);
        topCommented.appendChild(tr);
    });
};

const getUserLikes = async () => {
    const response = await fetch("/statistics/likers");
    const likes = await response.json();

    addUserLikes(likes);
};

const getUserComments = async () => {
    const response = await fetch("/statistics/commenters");
    const comments = await response.json();

    addUserComments(comments);
};

const getStoryLikes = async () => {
    const response = await fetch("/statistics/storylikes?topCount=" + 10);
    const likes = await response.json();

    addStoryLikes(likes);
};

const getStoryComments = async () => {
    const response = await fetch("/statistics/storycomments");
    const comments = await response.json();

    addStoryComments(comments);
};

getUserLikes();
getUserComments();
getStoryLikes();
getStoryComments();




