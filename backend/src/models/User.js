const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["OWNER", "ADMIN", "USER"], default: "USER" },

    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    level: { type: Number, default: 0 },

    // for fast downline queries:
    ancestorPath: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    balance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

UserSchema.index({ parentId: 1 });
UserSchema.index({ ancestorPath: 1 });

module.exports = mongoose.model("User", UserSchema);
