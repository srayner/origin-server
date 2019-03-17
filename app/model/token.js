const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  refreshToken: { type: String, required: true }
});

module.exports = mongoose.model("Token", tokenSchema);
