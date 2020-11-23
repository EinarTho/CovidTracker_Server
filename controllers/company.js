const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema(
  {
    companyId: {
      type: Number,
      required: true,
    },
    companyName: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
