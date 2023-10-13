const mongoose = require('mongoose');

const scratchCardSchema = new mongoose.Schema(
  {
    isScratch: {
      type: Boolean,
      default: false,
    },
    details: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'rewards'
    },
  },
  {
    versionKey: false,
    _id: false,
    timestamps: true, // Add timestamps
  }
);

const earningSchema = new mongoose.Schema({
  userId: { type: Number, default: 0 },
  max_streak: { type: Number, default: 0 },
  diamonds: { type: Number, default: 0 },
  skip: { type: Number, default: 0 },
  hint: { type: Number, default: 0 },
  pw_coins: { type: Number, default: 0 },
  pw_coupons: { type: Number, default: 0 },
  pw_coupons_details: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'rewards', // Reference to the 'Reward' model
    },
  ],
  scratch_cards_details: [scratchCardSchema],
}, { versionKey: false });

const Earning = mongoose.model('earnings', earningSchema);

module.exports = Earning;
