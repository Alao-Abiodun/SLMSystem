const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const session = require("express-session");
const cookieSession = require("cookie-session");
const User = require("../models/user.model");
const { OAuth2Client } = require("google-auth-library");
const { isRegisteredWithGoogle } = require("../middleware/google-auth");

const { GOOGLE_CLIENT_ID } = process.env;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post("/auth/google", isRegisteredWithGoogle, async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();
  const user = await User.upsert({
    where: { email: email },
    update: { name, picture },
    create: { name, email, picture },
  });
  req.session.userId = user.id;
  return Response(res).success({ data: user }, 201);
  // res.status(201)
  // res.json(user)
  // res.redirect('/user/auth/user-dashboard')
});

module.exports = router;
