const bcrypt = require("bcrypt");
const { z } = require("zod");
const User = require("../models/User");

async function createNextLevelUser(req, res) {
  const schema = z.object({
    username: z.string().min(3),
    password: z.string().min(6)
  });
  const { username, password } = schema.parse(req.body);

  const exists = await User.findOne({ username });
  if (exists) return res.status(409).json({ message: "Username already exists" });

  const parent = await User.findById(req.user._id);
  const passwordHash = await bcrypt.hash(password, 10);

  const child = await User.create({
    username,
    passwordHash,
    role: "USER",
    parentId: parent._id,
    level: parent.level + 1,
    ancestorPath: [...(parent.ancestorPath || []), parent._id],
    balance: 0
  });

  res.json({ id: child._id, username: child.username, parentId: child.parentId, level: child.level });
}

async function myChildren(req, res) {
  const children = await User.find({ parentId: req.user._id }).select("-passwordHash");
  res.json({ children });
}

async function myDownline(req, res) {
  const downline = await User.find({ ancestorPath: req.user._id }).select("-passwordHash");
  res.json({ downline });
}

async function changeChildPassword(req, res) {
  const schema = z.object({ newPassword: z.string().min(6) });
  const { newPassword } = schema.parse(req.body);

  const childId = req.params.id;
  const child = await User.findById(childId);
  if (!child) return res.status(404).json({ message: "User not found" });

  // only direct child
  if (String(child.parentId) !== String(req.user._id)) {
    return res.status(403).json({ message: "You can change password only for your direct children" });
  }

  child.passwordHash = await bcrypt.hash(newPassword, 10);
  await child.save();

  res.json({ message: "Password updated" });
}

async function changeDirectChildPassword(req, res) {
  const schema = z.object({
    newPassword: z.string().min(6)
  });

  const { newPassword } = schema.parse(req.body);
  const parentId = req.user._id;
  const childId = req.params.childId;

  const child = await User.findById(childId);
  if (!child) return res.status(404).json({ message: "Child user not found" });

  // ✅ only direct child
  if (String(child.parentId) !== String(parentId)) {
    return res.status(403).json({ message: "You can change password only of your direct child" });
  }

  child.passwordHash = await bcrypt.hash(newPassword, 10);
  await child.save();

  return res.json({ message: "Password updated successfully" });
}

module.exports = { createNextLevelUser, myChildren, myDownline, changeChildPassword ,changeDirectChildPassword};
