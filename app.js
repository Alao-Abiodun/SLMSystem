const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");

dotenv.config();

const app = express();

const bookRoute = require("./routes/book.route");
const userRoute = require("./routes/user.route");
const adminRoute = require("./routes/admin.route");
// const googleRoute = require("./routes/google.route");

const { PORT, MONGO_URI } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use(express.static("./public"));
app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 2000000 },
    abortOnLimit: true,
  })
);

app.get("/", (req, res) => {
  let name = "API-Documentation-Link";
  let html = `<html>
                <body>
                  <a href='https://documenter.getpostman.com/view/15379432/UVREkQDz'>${name}</a>
                </body>
              </html>`;
  res.status(200).json({
    message: "This is the version one of library management system API",
    "api-documentation_link": `${html}`,
  });
});

app.use("/api/v1/book", bookRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
// app.use("/api/v1/google", googleRoute);

app.listen(PORT, async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database is connected");
  } catch (error) {
    console.log(`Database Not Connected`);
  }
  console.log(`The app is listening on PORT ${PORT}`);
});
