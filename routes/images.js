require('dotenv').config();

const express = require('express');
const router = express.Router();
const Image = require('../models/image');
const fs = require('fs');
const path = require('path');

module.exports = router;

// Serve static files from the "public" directory
router.use('/images', express.static(path.join(__dirname, '../public/images')));

// GET all images
router.get('/', async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET one image
router.get('/:id', getImage, (req, res) => {
    res.status(200).json({ message: "Image found successfully", imageData: res.image });
});

// Upload URL directly to database
router.post('/', async (req, res) => {
    const image = new Image({
        imageUrl: req.body.imageUrl
    });
    try {
        const newImage = await image.save();
        res.status(201).json(newImage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Upload image to ./public/images and save URL to database
router.post('/upload', (req, res) => {
    const filePath = req.body.filePath;

    if (!filePath) {
        return res.status(400).json({ message: 'No file path provided' });
    }

    const fileName = path.basename(filePath);
    const destPath = path.join(__dirname, '../public/images', fileName);

    fs.copyFile(filePath, destPath, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error copying file', error: err.message });
        }

        const image = new Image({
            imageUrl: `/images/${fileName}`
        });

        try {
            const newImage = await image.save();
            res.status(201).json({ message: 'File uploaded successfully', url: `/images/${fileName}` });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });
});

// Delete one image
router.delete('/:id', getImage, async (req, res) => {
    try {
        await res.image.deleteOne();
        res.json({ message: 'Deleted image', imageUrl: res.image.imageUrl });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getImage(req, res, next) {
    let image;
    try {
        image = await Image.findById(req.params.id);
        if (image == null) {
            return res.status(404).json({ message: 'Cannot find image' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.image = image;
    next();
}

// PATCH update starred status
router.patch('/:id/star', async (req, res) => {
    const { starred } = req.body;
    if (typeof starred !== 'boolean') {
        return res.status(400).json({ message: "Invalid starred value. It must be a boolean." });
    }

    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Cannot find image' });
        }

        image.starred = starred;
        const updatedImage = await image.save();
        res.status(200).json({ message: "Starred status updated successfully", updatedImage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
