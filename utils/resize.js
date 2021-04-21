'use strict';
const sharp = require('sharp');

const makeCover = async (file, thumbname) => { // file = full path to image (req.file.path), thumbname = filename (req.file.filename)
  // TODO: use sharp to create a png thumbnail of 160x160px, use async await
  return await sharp(file).resize(160, 160).toFile('thumbnails/' + thumbname);
};

module.exports = {
  makeCover,
};