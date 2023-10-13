const mongoose = require('mongoose');

const choiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  chapters: [
    {
      type: String,
    },
  ],
});

const Choice = mongoose.model('choices', choiceSchema);
module.exports = Choice;
