const mongoose = require("mongoose");
const { z } = require("zod");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

async function ownerSelfRecharge(req, res) {
  if (req.user.role !== "OWNER") return res.status(403).json({ message: "Forbidden" });

  const schema = z.object({ amount: z.number().positive(), note: z.string().optional() });
  const { amount, note } = schema.parse(req.body);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const owner = await User.findById(req.user._id).session(session);
    owner.balance += amount;
    await owner.save();

    await Transaction.create(
      [
        {
          type: "CREDIT",
          amount,
          senderId: null,
          receiverId: owner._id,
          note: note || "Owner self recharge",
          meta: { adminAction: false, ip: req.ip }
        }
      ],
      { session }
    );

    await session.commitTransaction();
    res.json({ message: "Recharged", balance: owner.balance });
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    session.endSession();
  }
}

async function transferToChild(req, res) {
  const schema = z.object({
    receiverId: z.string().min(1),
    amount: z.number().positive(),
    note: z.string().optional()
  });
  const { receiverId, amount, note } = schema.parse(req.body);

  const senderId = req.user._id;

  const receiver = await User.findById(receiverId);
  if (!receiver) return res.status(404).json({ message: "Receiver not found" });

  // only direct child
  if (String(receiver.parentId) !== String(senderId)) {
    return res.status(403).json({ message: "You can credit only your direct children" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sender = await User.findById(senderId).session(session);
    const recv = await User.findById(receiverId).session(session);

    if (!sender || !recv) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Sender/Receiver not found" });
    }

    if (sender.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    sender.balance -= amount;
    recv.balance += amount;

    await sender.save({ session });
    await recv.save({ session });

    // ✅ FIX: use insertMany with ordered:true when using session + multiple docs
    await Transaction.insertMany(
      [
        {
          type: "DEBIT",
          amount,
          senderId: sender._id,
          receiverId: recv._id,
          note: note || "Transfer to child",
          meta: { adminAction: false, ip: req.ip }
        },
        {
          type: "CREDIT",
          amount,
          senderId: sender._id,
          receiverId: recv._id,
          note: note || "Received from parent",
          meta: { adminAction: false, ip: req.ip }
        }
      ],
      { session, ordered: true }
    );

    await session.commitTransaction();
    return res.json({ message: "Transferred", senderBalance: sender.balance });
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    session.endSession();
  }
}


async function myStatement(req, res) {
  const userId = req.user._id;

  const tx = await Transaction.find({
    $or: [{ senderId: userId }, { receiverId: userId }]
  })
    .sort({ createdAt: -1 })
    .limit(200)
    .populate("senderId", "username")
    .populate("receiverId", "username");

  res.json({
    balance: req.user.balance,
    transactions: tx.map((t) => ({
      id: t._id,
      type: t.type,
      amount: t.amount,
      sender: t.senderId ? t.senderId.username : null,
      receiver: t.receiverId ? t.receiverId.username : null,
      note: t.note,
      at: t.createdAt
    }))
  });
}

module.exports = { ownerSelfRecharge, transferToChild, myStatement };
