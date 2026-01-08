const mongoose = require("mongoose");
const { z } = require("zod");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

// Admin can view all "next level" users (level = 1) OR direct children of OWNER.
// Here we treat "next level" as: users whose parent is OWNER (anywhere)
async function adminNextLevelUsers(req, res) {
  // choose OWNER root: the OWNER account
  const owner = await User.findOne({ role: "OWNER" });
  if (!owner) return res.status(400).json({ message: "OWNER not found. Seed one OWNER." });

  const users = await User.find({ parentId: owner._id }).select("-passwordHash");
  res.json({ users });
}

// view complete downline for any user
async function adminDownline(req, res) {
  const userId = req.params.userId;
  const downline = await User.find({ ancestorPath: userId }).select("-passwordHash");
  const root = await User.findById(userId).select("-passwordHash");
  if (!root) return res.status(404).json({ message: "User not found" });

  res.json({ root, downline });
}

// Admin credit any user: deduct from immediate parent automatically
async function adminCredit(req, res) {
  const schema = z.object({
    targetUserId: z.string().min(1),
    amount: z.number().positive(),
    note: z.string().optional()
  });
  const { targetUserId, amount, note } = schema.parse(req.body);

  const target = await User.findById(targetUserId);
  if (!target) return res.status(404).json({ message: "Target user not found" });

  if (!target.parentId) {
    return res.status(400).json({ message: "Target has no parent to deduct from" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const parent = await User.findById(target.parentId).session(session);
    const recv = await User.findById(targetUserId).session(session);

    if (!parent || !recv) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Parent/Target not found" });
    }

    if (parent.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Parent has insufficient balance" });
    }

    parent.balance -= amount;
    recv.balance += amount;

    await parent.save({ session });
    await recv.save({ session });

    // ✅ FIX: insertMany with ordered:true
    await Transaction.insertMany(
      [
        {
          type: "DEBIT",
          amount,
          senderId: parent._id,
          receiverId: recv._id,
          note: note || "Admin credit (deducted from parent)",
          meta: { adminAction: true, ip: req.ip }
        },
        {
          type: "CREDIT",
          amount,
          senderId: parent._id,
          receiverId: recv._id,
          note: note || "Admin credit received",
          meta: { adminAction: true, ip: req.ip }
        }
      ],
      { session, ordered: true }
    );

    await session.commitTransaction();
    return res.json({ message: "Credited", parentBalance: parent.balance });
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    session.endSession();
  }
}


// balances summary
async function adminBalanceSummary(req, res) {
  const users = await User.find({}).select("username role balance parentId level").sort({ level: 1 });
  const total = users.reduce((sum, u) => sum + (u.balance || 0), 0);
  res.json({ totalSystemBalance: total, users });
}


async function getDownlineTree(req, res) {
  const userId = req.params.userId;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  const root = await User.findById(userId).select("_id username role level balance parentId");
  if (!root) return res.status(404).json({ message: "User not found" });

  // ✅ all descendants: ancestorPath contains root _id
  const descendants = await User.find({ ancestorPath: root._id })
    .select("_id username role level balance parentId")
    .sort({ level: 1, username: 1 });

  // Build tree in-memory
  const map = new Map();
  const rootNode = { ...root.toObject(), children: [] };
  map.set(String(root._id), rootNode);

  for (const u of descendants) {
    map.set(String(u._id), { ...u.toObject(), children: [] });
  }

  for (const u of descendants) {
    const node = map.get(String(u._id));
    const pid = u.parentId ? String(u.parentId) : null;
    const parentNode = pid ? map.get(pid) : null;
    if (parentNode) parentNode.children.push(node);
  }

  return res.json({ root: rootNode });
}
module.exports = { adminNextLevelUsers, adminDownline, adminCredit, adminBalanceSummary,getDownlineTree };
