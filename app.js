const express = require("express");

const app = express();

const PORT = process.env.PORT || 2022;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`The app is listening on PORT ${PORT}`);
});
