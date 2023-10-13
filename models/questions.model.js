const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  chapter: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: Boolean,
    required: true,
  },
  hint: {
    type: String,
  },
});

const Question = mongoose.model('questions', questionSchema);
module.exports = Question;
