const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    imageUrl: {
      type: String,
      required: true,
    },
    totalEntity:{
      type: Number,
      default: 0,
    },
    date:{
      type: Date,
      default: () => new Date(Date.now() + 7 * 60 * 60 * 1000),
    },
    time:{
      type: String,
      default: () => new Date().toLocaleTimeString(),
    },
    starred:{
      type: Boolean,
      default: false,
    }
  });

module.exports = mongoose.model('Image', imageSchema);
