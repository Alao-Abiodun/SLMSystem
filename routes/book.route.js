const express = require("express");
const router = express.Router();
const {
  createBook,
  deleteBook,
  changeBook,
  approveBookRequest,
  blockUser,
} = require("../controllers/book.controller");

router.post("/add", createBook);
router.delete("/remove/:id", deleteBook);
router.put("/change/:id", changeBook);
router.post("/approve", approveBookRequest);
router.delete("/deactivate", blockUser);

module.exports = router;
