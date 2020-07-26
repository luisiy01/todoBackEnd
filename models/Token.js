const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiration: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Token", TokenSchema);
