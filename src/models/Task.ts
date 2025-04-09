import mongoose, { Schema, Document } from "mongoose";
import { UUIDTypes, v4 as uuidv4 } from 'uuid';

export interface ITask extends Document {
    title: string;
    description: string;
    slug: string,
    board: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    assignees: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    order: number;
    laneId: UUIDTypes;
    addAssigneeToTask: (userId: string) => Promise<ITask>;
  }

const TaskSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        slug: { type: String, unique: true },
        board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        assignees: [{ type: Schema.Types.ObjectId, ref: "User" }],default:[],
        createdAt:{type:Date, default:Date.now},
        updatedAt:{type:Date, default:Date.now},
        order: { type: Number, default: 0 },
        laneId: { type: String, required: true, default: uuidv4() },
        
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

  TaskSchema.methods.addAssigneeToTask = async function (userId: string) {
    // Verificar se o assignee já está presente no array
    if (this.assignees.includes(userId)) {
      throw new Error("Este usuário já é um assignee desta tarefa.");
    }
    this.assignees.push(userId);
    await this.save();
    return this;
  };


export default mongoose.model<ITask>("Task", TaskSchema);