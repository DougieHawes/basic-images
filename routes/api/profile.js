const router = require("express").Router();

const { isSignedIn, checkObjectId } = require("../../controllers/auth");
const {
  editProfile,
  viewOwnProfile,
  getAllProfiles,
  getSpecificProfile,
} = require("../../controllers/profile");

router.post("/edit", isSignedIn, editProfile);
router.get("/me", isSignedIn, viewOwnProfile);
router.get("/", isSignedIn, getAllProfiles);
router.get("/:user_id", checkObjectId("user_id"), getSpecificProfile);

module.exports = router;
