const { Request, Response, NextFunction } = require("express");
const config = require("../config/config");
const Image = require("../models/image");
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const getAllImages= async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getImage = async (req, res) => {
  try {
    res.status(200).json({ message: "Image found successfully", imageData: res.image });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Tidak ada file yang diunggah' });
  }

  const fileName = req.file.filename;
  const fileUrl = `http://localhost:3000/staticimages/${fileName}`;

  const image = new Image({
    imageUrl: fileUrl,
    totalEntity: req.body.totalEntity,
  });

  try {
    const newImage = await image.save();
    res.status(201).json({ message: 'File berhasil diunggah', url: fileUrl });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    // Delete the image file from the static images folder
    fs.unlinkSync(path.join(__dirname, '../../public', res.image.imageUrl));

    // Delete the image document from MongoDB
    await res.image.deleteOne();

    res.json({ message: 'Image deleted successfully', imageUrl: res.image.imageUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const favoriteImage = async (req, res) => {
    const { starred } = req.body;
    if (typeof starred !== 'boolean') {
        return res.status(400).json({ message: "Invalid starred value. It must be a boolean." });
    }
    try {
        res.image.starred = starred;
        const updatedImage = await res.image.save();
        res.status(200).json({ message: "Starred status updated successfully", updatedImage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getAllImages,
    getImage,
    uploadImage,
    deleteImage,
    favoriteImage,
};