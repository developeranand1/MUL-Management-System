const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["CREDIT", "DEBIT"], required: true },
    amount: { type: Number, required: true },

    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    note: { type: String, default: "" },

    commissionAmount: { type: Number, default: 0 },
    meta: {
      adminAction: { type: Boolean, default: false },
      ip: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

TransactionSchema.index({ senderId: 1, createdAt: -1 });
TransactionSchema.index({ receiverId: 1, createdAt: -1 });

module.exports = mongoose.model("Transaction", TransactionSchema);
