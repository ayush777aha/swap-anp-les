const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  step: {
    type: Number,
    required: true,
  },
  milestone: {
    type: String,
    required: true,
  },
  streak_count: {
    type: Number,
    required: true,
  },
});

const Milestone =  mongoose.model('milestone', milestoneSchema);
module.exports = Milestone;
