const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {findImage} = require('../middleware/imageMiddleware');
const {
    getAllImages,
    getImage,
    uploadImage,
    deleteImage,
    favoriteImage,
} = require('../controllers/imageController');

router.get('/', authenticate, getAllImages);
router.get('/:id', authenticate,findImage, getImage);
router.post('/upload', uploadImage);
router.delete('/delete/:id', authenticate,findImage, deleteImage);
router.patch('/favorite/:id', authenticate,findImage, favoriteImage);

module.exports = router;