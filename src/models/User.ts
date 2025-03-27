import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    },
    { timestamps: true }
  );

// hash da senha
  UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
  
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  });
  
  // verificação da senha
  UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  };


export default mongoose.model<IUser>("User", UserSchema);