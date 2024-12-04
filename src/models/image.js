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
      default: Date.now,
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
