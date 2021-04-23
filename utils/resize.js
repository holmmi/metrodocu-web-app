'use strict';

const sharp = require('sharp');

const makeCover = async (buffer, fileName) => {
  try {
    await sharp(buffer)
      .resize(240, 240)
      .toFormat("png")
      .toFile('uploads/covers/' + fileName);
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  makeCover
};