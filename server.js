require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");

const app = express();

const mongoUri = process.env.MONGODB_URI;
const port = process.env.PORT;

const authRoute = require("./routes/api/auth");
const imageRoute = require("./routes/api/image");
const profileRoute = require("./routes/api/profile");

mongoose.connect(
  mongoUri,
  { useFindAndModify: true, useNewUrlParser: true, useUnifiedTopology: true },
  console.log("mongodb connected")
);

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use("/auth", authRoute);
app.use("/image", imageRoute);
app.use("/profile", profileRoute);

app.listen(port, console.log(`express app running on port ${port}`));
