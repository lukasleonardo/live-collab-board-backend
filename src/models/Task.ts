import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
    title: string;
    description: string;
    slug: string,
    status: "todo" | "in-progress" | "done";
    board: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    assignees: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
  }

const TaskSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        slug: { type: String, unique: true },
        board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
        assignees: [{ type: Schema.Types.ObjectId, ref: "User" ,default:[]}],
        createdAt:{type:Date, default:Date.now},
        updatedAt:{type:Date, default:Date.now}
    },
    { timestamps: true }
)

TaskSchema.pre("save", function (next) {
    // Verifique se há assignees e os converta para mongoose.Types.ObjectId
    if (Array.isArray(this.assignees) && this.assignees.length > 0) {
      this.assignees = this.assignees.map((assignee: string) =>
        new mongoose.Types.ObjectId(assignee)
      );
    }
    next();
  });



export default mongoose.model<ITask>("Task", TaskSchema);