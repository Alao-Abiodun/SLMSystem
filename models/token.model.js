const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Types.Schema.ObjectId,
    required: true,
  },
  expiry: {
    type: Date,
    default: Date.now,
    expires: 900,
  },
});

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;
