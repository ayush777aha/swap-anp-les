// RewardModel.js

const mongoose = require('mongoose');

// Define the schema for the Reward model
const rewardSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
  },
  code: {
    type: String,
  },
  percentage: {
    type: Number,
  },
  name: {
    type: String,
  },
});

// Create the Reward model based on the schema
const Reward = mongoose.model('rewards', rewardSchema);

// Export the model for use in other parts of your application
module.exports = Reward;
