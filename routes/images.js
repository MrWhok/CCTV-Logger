require('dotenv').config();

const express = require('express');
const router = express.Router();
const Image = require('../models/image');
const fs = require('fs');
const ImageKit = require('imagekit');

module.exports = router;

//GET all images
router.get('/', async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

//GET one image
router.get('/:id', getImage,(req, res) => {
    res.status(200).json({message:"Image found successfully",imageData:res.image});
});

//Upload url directly to database
router.post('/', async (req, res) => {
    const image= new Image({
        imageUrl: req.body.imageUrl
    })
    try {
        const newImage = await image.save();
        res.status(201).json(newImage);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

//Upload image to ImageKit and save url to database
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

router.post('/upload',(req,res)=>{

    const filePath=req.body.filePath;

    if(!filePath){
        return res.status(400).json({message:'No file path provided'});
    }

    fs.readFile(filePath,(err,data)=>{
        if(err){
            return res.status(500).json({message:'Error reading file',error:err.message});
        }

        imagekit.upload({
            file:data,
            fileName:filePath.split('/').pop()
        },async (error,result)=>{
            if(error){
                return res.status(500).json({message:error.message});
            }

            const image=new Image({
                imageUrl:result.url
            });

            try {
                const newImage = await image.save();
                res.status(201).json({message:'File uploaded successfully',url:result.url});
            } catch (err) {
                res.status(400).json({message: err.message});
            }
        });
    })
})

//Delete one image
router.delete('/:id', getImage, async (req, res) => {
    try {
        await res.image.deleteOne();
        res.json({message: 'Deleted image', imageUrl: res.image.imageUrl});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

async function getImage(req, res, next) {
    let image;
    try {
        image = await Image.findById(req.params.id);
        if (image == null) {
            return res.status(404).json({message: 'Cannot find image'});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
    res.image = image;
    next();
}