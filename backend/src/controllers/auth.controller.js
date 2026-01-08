const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const User = require("../models/User");
const { createCaptcha, verifyCaptcha } = require("../utils/captchaStore");

const cookieOpts = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: String(process.env.COOKIE_SECURE) === "true"
});

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  });
}

// OPTIONAL: Use only for initial seeding, or restrict to OWNER/ADMIN.
// For machine test, it’s okay to keep but you can remove public register.
async function register(req, res) {
  const schema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
    role: z.enum(["OWNER", "ADMIN", "USER"]).optional()
  });
  const { username, password, role } = schema.parse(req.body);

  const exists = await User.findOne({ username });
  if (exists) return res.status(409).json({ message: "Username already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  // if creating OWNER/ADMIN here, keep parent null; otherwise normal USER as top-level
  const user = await User.create({
    username,
    passwordHash,
    role: role || "USER",
    parentId: null,
    level: 0,
    ancestorPath: []
  });

  res.json({ id: user._id, username: user.username, role: user.role });
}

async function captcha(req, res) {
  const { captchaId, question } = createCaptcha();
  // tie captchaId to cookie (session-like)
  res.cookie("captcha_id", captchaId, {
    httpOnly: false,
    sameSite: "lax",
    secure: false,
    maxAge: 5 * 60 * 1000
  });
  res.json({ question, captchaId }); // returning captchaId helps Postman, UI can ignore and rely on cookie
}

async function login(req, res) {
  const schema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
    captchaAnswer: z.string().min(1)
  });
  const { username, password, captchaAnswer } = schema.parse(req.body);

  const captchaId = req.cookies?.captcha_id || req.body.captchaId;
  const cap = verifyCaptcha(captchaId, captchaAnswer);
  if (!cap.ok) return res.status(400).json({ message: "CAPTCHA failed", reason: cap.reason });

  const user = await User.findOne({ username });
  if (!user || !user.isActive) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user._id.toString());
  res.cookie("access_token", token, { ...cookieOpts(), maxAge: 24 * 60 * 60 * 1000 });

  res.json({ message: "Logged in" });
}

async function logout(req, res) {
  res.clearCookie("access_token", cookieOpts());
  res.json({ message: "Logged out" });
}

async function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { register, captcha, login, logout, me };
