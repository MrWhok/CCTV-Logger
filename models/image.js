const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    // datetime: {
    //   type: Date,
    //   required: false,
    // },
    // location: {
    //   type: String,
    //   required: false,
    // },
    // weather: {
    //   type: String,
    //   required: false,
    // },
    // temperature: {
    //   type: Number,
    //   required: false,
    // },
    imageUrl: {
      type: String,
      required: true,
    },
  });

module.exports = mongoose.model('Image', imageSchema);