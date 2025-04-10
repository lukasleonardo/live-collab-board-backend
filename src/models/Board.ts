import mongoose, { Schema, Document } from "mongoose";
import { UUIDTypes, v4 as uuidv4 } from 'uuid';
export interface ILane {
    title: string;
    id: number;
  }

export interface IBoard extends Document {
    title: string;
    description: string;
    owner: mongoose.Schema.Types.ObjectId;
    members: mongoose.Schema.Types.ObjectId[];
    lane:{title:string, id:UUIDTypes}[]
}

const LaneSchema = new Schema<ILane>({
    title: { type: String, required: true },
    id: { type: Number, required: true },
  });

const BoardSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String},
        owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
        lanes:{
            type: [LaneSchema],
            default: [
              { title: "Todo", id: uuidv4() },
              { title: "In Progress", id: uuidv4() },
              { title: "Done", id: uuidv4() }
            ]
          },
        members: [{ type: Schema.Types.ObjectId, ref: "User" }],
      },
      { timestamps: true }
)

export default mongoose.model<IBoard>("Board", BoardSchema);