import mongoose, { Schema, Document } from "mongoose";

export interface IBoard extends Document {
    title: string;
    description: string;
    owner: mongoose.Schema.Types.ObjectId;
    members: mongoose.Schema.Types.ObjectId[];
    updatedAt: Date;
}

const BoardSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String},
        owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
        members: [{ type: Schema.Types.ObjectId, ref: "User" }],
        updatedAt:{type:Date}
      },
      { timestamps: true }
)

export default mongoose.model<IBoard>("Board", BoardSchema);