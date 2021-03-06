const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    companyId: {
      type: Number,
      required: true,
    },
    visits: {
      type: Array,
      default: [],
    },
    inRisk: {
      type: Boolean,
      default: false,
    },
    dateOfContact: {
      type: String,
    },
    role: {
      type: String,
      default: 'basic',
      enum: ['basic', 'admin'],
    },
    accessToken: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
