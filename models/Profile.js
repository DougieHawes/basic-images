const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  avatar: {
    data: Buffer,
    contentType: String,
  },
  location: {
    type: String,
  },
  bio: {
    type: String,
  },
  lastUpdated: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Profile", profileSchema);
