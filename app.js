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

const { PORT, DB_USERNAME, DB_PASSWORD } = process.env;

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
  res.status(200).json("The main application already started");
});

app.use("/api/v1/book", bookRoute);
app.use("/api/v1/user", userRoute);

app.listen(PORT, async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.iij5r.mongodb.net/SLMSystem_DB`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Database is connected");
  } catch (error) {
    console.log(`Database Not Connected`);
  }
  console.log(`The app is listening on PORT ${PORT}`);
});
