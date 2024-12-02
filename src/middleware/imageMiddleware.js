const Image = require('../models/image');

async function findImage(req, res, next) {
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

module.exports = { findImage };