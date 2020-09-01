const router = require("express").Router();

const {
  signUp,
  activateUser,
  signIn,
  signOut,
} = require("../../controllers/auth");

router.post("/signup", signUp);
router.post("/activate", activateUser);
router.post("/signin", signIn);
router.post("/signout", signOut);

module.exports = router;
