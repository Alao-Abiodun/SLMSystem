const express = require("express");
const router = express.Router();
const {
  createBook,
  deleteBook,
  changeBook,
  approveBookRequest,
} = require("../controllers/book.controller");

const { validateUserToken, validateAdmin } = require("../middleware/auth");

router.post("/add", validateUserToken, validateAdmin, createBook);
router.delete("/remove/:id", validateUserToken, validateAdmin, deleteBook);
router.put("/change/:id", validateUserToken, validateAdmin, changeBook);
router.post("/approve", validateUserToken, validateAdmin, approveBookRequest);

module.exports = router;
