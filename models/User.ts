import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { getModel } from "@/lib/mongooseModel";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "admin" | "customer";
  name: string;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

// Mongoose v9 pre-hook - use .pre on the schema directly
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password as string, 12);
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default getModel<IUser>("User", UserSchema);
