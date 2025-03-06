import mongoose from "mongoose";
import bcrypt from "bcrypt";

const salted = 10;

const hostSchema = new mongoose.Schema(
  {
    collageName: {
      type: String,
      required: true,
    },
    collageEmail: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    collegeId: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return new mongoose.Types.ObjectId().toHexString(); // Generates a unique ID if not provided
      },
    },
    role: {
      type: String,
      default: "host",
    },
  },
  { timestamps: true }
);

// Hash password before saving
hostSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, salted);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
hostSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error("Password comparison error:", error);
    throw new Error("Password comparison failed");
  }
};

// Ensure unique index
hostSchema.index({ collegeId: 1 }, { unique: true, sparse: true });

const Host = mongoose.model("Host", hostSchema);
export default Host;
