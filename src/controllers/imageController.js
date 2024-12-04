const { Request, Response, NextFunction } = require("express");
const config = require("../config/config");
const Image = require("../models/image");
const fs = require('fs');
const path = require('path');

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
    const filePath = req.body.filePath;
  
    if (!filePath) {
      return res.status(400).json({ message: 'No file path provided' });
    }
  
    const fileName = path.basename(filePath);
    const destPath = path.join(__dirname, '../../public/staticimages', fileName);
  
    fs.copyFile(filePath, destPath, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error copying file', error: err.message });
      }
  
      const image = new Image({
        imageUrl: `/staticimages/${fileName}`,
        totalEntity: req.body.totalEntity,
      });
  
      try {
        const newImage = await image.save();
        res.status(201).json({ message: 'File uploaded successfully', url: `/staticimages/${fileName}` });
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    });
  }
  
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