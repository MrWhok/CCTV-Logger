const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { authenticate } = require('../middleware/auth');
const {findImage} = require('../middleware/imageMiddleware');
const {
    getAllImages,
    getImage,
    uploadImage,
    deleteImage,
    favoriteImage,
} = require('../controllers/imageController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../public/staticimages'));
    },
    filename: (req, file, cb) => {
      const fileName = Date.now() + path.extname(file.originalname);
      cb(null, fileName);
    }
});

const upload = multer({ storage });

router.get('/', authenticate, getAllImages);
router.get('/:id', authenticate,findImage, getImage);
router.post('/upload', upload.single('image'), uploadImage);
router.delete('/delete/:id', authenticate,findImage, deleteImage);
router.patch('/favorite/:id', authenticate,findImage, favoriteImage);

module.exports = router;