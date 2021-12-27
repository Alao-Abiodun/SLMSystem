const express = require("express");
const router = express.Router();
const {
  createBook,
  deleteBook,
  changeBook,
  approveBookRequest,
} = require("../controllers/book.controller");

router.post("/add", createBook);
router.delete("/remove/:id", deleteBook);
router.put("/change/:id", changeBook);
router.post("/approve", approveBookRequest);

module.exports = router;
