const fs = require("fs");

const Profile = require("../models/Profile");
const User = require("../models/User");

exports.editProfile = async (req, res) => {
  const { location, bio } = req.body;
  const { avatar } = req.files;

  const profileFields = {
    user: req.user.id,
    location,
    bio,
    avatar,
  };

  try {
    let profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true }
    );
    res.json({ msg: "profile saved" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
};

exports.viewOwnProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("User", ["username"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
};

exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("User", ["username"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getSpecificProfile = async ({ params: { user_id } }, res) => {
  try {
    const profile = await Profile.findOne({
      user: user_id,
    }).populate("User", ["username"]);

    if (!profile) return res.status(400).json({ msg: "profile not found" });

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "server error" });
  }
};
