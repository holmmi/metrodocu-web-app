'use strict';

const storyModel = require('../models/storyModel');
const { makeCover } = require('../utils/resize');
const { v4 } = require('uuid');
const fs = require('fs');
const VISIBILITIES = require('../constants/visibilities');
const GROUPS = require('../constants/groups');
const { getFormattedTimestamp } = require('../utils/time');

const checkStoryAccessRights = async (req, res, next) => {
    try {
        const visibilityInformation = await storyModel.getStoryVisibility(req.user ? req.user.user_id : 0, req.params.storyId);
        res.locals.storyOwner = req.user ? req.user.user_id === visibilityInformation.owner_id : false;
        if (visibilityInformation.visibility_id === VISIBILITIES.PUBLIC) {
            return next();
        }
        if (!req.user) {
            return res.status(401).json({error: "Unauthorized"});
        }
        switch (visibilityInformation.visibility_id) {
            case VISIBILITIES.PRIVATE: {
                if (res.locals.storyOwner) {
                    return next();
                }
                break;
            }
            case VISIBILITIES.SHARED: {
                if (req.user.user_id === visibilityInformation.user_id) {
                    return next();
                }
                break;
            }
        }
        return res.status(401).json({error: "Unauthorized"});
    } catch (error) {
        console.error("checkStoryAccessRights: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

const storyOwnerAccessCheck = async (req, res, next) => {
    const visibilityInformation = await storyModel.getStoryVisibility(req.user ? req.user.user_id : 0, req.params.storyId);
    if (req.user) {
        if (req.user.user_id === visibilityInformation.owner_id) {
            return next();
        }
    }
    return res.status(401).json({error: "Unauthorized"});
  };

const visibility = async (req, res) => {
    try {
        res.json(await storyModel.getStoryVisibilities());
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
};

const getStories = async (req, res) => {
    try {
        res.json(await storyModel.getStories(req.user ? req.user.user_id : null, parseInt(req.query.visibility, 10)));
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

const getCover = (req, res) => {
    res.download("uploads/covers/" + req.params.fileName, (err) => {
        if (err) {
            res.sendStatus(500);
            console.error("getCover: ", err.message);
        }
    });
}

const getStory = async (req, res) => {
    try {
        const story = await storyModel.getStoryById(req.params.storyId);
        res.json(story);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

const addStory = async (req, res) => {
    if (req.user) {
        try {
            const {sname, sdescription, svisibility, files} = req.body;
            // Decode Base64 encoded string back to binary format
            const buffer = Buffer.from(files[0].content, "base64");
            const fileName = v4();
            // Create a resized cover photo from an image data and save it
            makeCover(buffer, fileName);
            const insertId = await storyModel.addStory([sname, sdescription, fileName, svisibility, req.user.user_id]);
            res.json({storyId: insertId});
        } catch (e) {
            console.error(e.message);
            res.status(500).json({error: "Internal Server Error"});
        }
    } else {
        res.status(401).json({error: "Unauthorized"});
    }

};

const addLike = async (req, res) => {
    if (req.user) {
        try {
            await storyModel.addLike([req.user.user_id, req.params.storyId]);
            res.sendStatus(200);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({error: "Internal Server Error"});
        }
    } else {
        res.status(401).json({error: "Unauthorized"});
    }
};

const updateStory = async (req, res) => {
    try {
        const {sname, sdescription, svisibility} = req.body;
        const updated = await storyModel.updateStory([sname, sdescription, svisibility, req.params.storyId]);
        res.sendStatus(updated ? 200 : 400);
    } catch (error) {
        console.error("updateStory: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

const deleteStory = async (req, res) => {
    if (req.user) {
        if (req.user.groups.includes(GROUPS.ADMIN)) {
            try {
                await storyModel.deleteStory([req.params.storyId]);
                return res.sendStatus(204);
            } catch (error) {
                console.error("deleteStory: ", error.message);
            }
        }
    }
    return res.status(401).json({ error: "Unauthorized" });
};

const uploadDocument = async (req, res) => {
    try {
        const files = req.body;
        files.forEach(async file => {
            const buffer = Buffer.from(file.content, "base64");
            const fileName = v4();
            fs.writeFile("uploads/documents/" + fileName, buffer, (err) => {
                if (err) {
                    console.error(err);
                }
            });
            await storyModel.addDocumentDetails([file.name, file.type, fileName, req.params.storyId]);
        });
        res.sendStatus(200);
    } catch (error) {
        console.error("uploadDocument: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

const getDocument = async (req, res) => {
    try {
        const {document_name, document_location} = await storyModel.getDocumentDetailsById([req.params.documentId]);
        res.download("uploads/documents/" + document_location, document_name, (err) => {
            if (err) {
                console.error(err);
            }
        });
    } catch (error) {
        console.error("getDocument: ", error.message);
        res.sendStatus(500)
    }
    
};

const getComments = async (req, res) => {
    try {
        const response = {
            admin: req.user ? req.user.groups.includes(GROUPS.ADMIN) : false,
            comments: await storyModel.getComments([req.params.storyId])
        };
        return res.json(response);
    } catch (error) {
        console.error("getComments: ", error.message);
    }
};

const addComment = async (req, res) => {
    try {
        const commentId = await storyModel.addComment([req.user.user_id, req.params.storyId, req.body.comment]);
        res.status(200).json({
            username: req.user.username,
            admin: req.user.groups.includes(GROUPS.ADMIN),
            commentId: commentId,
            comment: req.body.comment,
            time: getFormattedTimestamp()
        });
    } catch (error) {
        console.error("addComment: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

const deleteComment = async (req, res) => {
    if (req.user) {
        if (req.user.groups.includes(GROUPS.ADMIN)) {
            try {
                await storyModel.deleteComment([req.params.commentId]);
                return res.sendStatus(200);
            } catch (error) {
                console.error("deleteComment: ", error.message);
                return res.status(500).json({error: "Internal Server Error"});
            }
        }
    }
    return res.status(401).json({error: "Unauthorized"});
};

module.exports = {
    storyOwnerAccessCheck,
    visibility,
    getStories,
    getCover,
    getStory,
    addStory,
    addLike,
    updateStory,
    deleteStory,
    uploadDocument,
    getDocument,
    checkStoryAccessRights,
    getComments,
    addComment,
    deleteComment,
};