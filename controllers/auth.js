const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const sgMail = require("@sendgrid/mail");

const User = require("../models/User");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signUp = async (req, res) => {
  const { username, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({ error: "user already exists" });
  }

  try {
    const token = jwt.sign(
      { username, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: 600 }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `${username}, please activate your account at Basic Image Sharer`,
      html: `
          <p>please click the below link to activate your account at Basic Image Sharer</p>
          <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
          <hr/>
          <p>${process.env.CLIENT_URL}</p>
        `,
    };

    sgMail.send(emailData).then((send) => {
      return res.status(200).json({ msg: `email has been sent to ${email}` });
    });
  } catch (error) {
    console.log("ERROR: " + error);
    res.status(400).json({ error: "server error" });
  }
};

exports.activateUser = async (req, res) => {
  try {
    const { token } = req.body;

    if (token) {
      jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
        if (err) {
          return res.status(401).json({ msg: "expired link" });
        }
      });

      const { username, email, password } = jwt.decode(token);

      const user = new User({ username, email, password });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.json({ msg: "signup success" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ msg: "server error" });
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 36000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
};

exports.signOut = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Signout success",
  });
};

exports.isSignedIn = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: "Token is not valid" });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.error("something wrong with auth middleware");
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.checkObjectId = (idToCheck) => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[idToCheck]))
    return res.status(400).json({ msg: "invalid id" });
  next();
};
