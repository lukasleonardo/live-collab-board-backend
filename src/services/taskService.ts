import Task, { ITask } from "../models/Task";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { getIO } from "../sockets/index";
import  jwt  from "jsonwebtoken";

export const createTask = async (req: AuthenticatedRequest) => {
    const { title, description, boardId, status,laneId,assignees } = req.body;    
    const token = req.header('Authorization')?.split(' ')[1]??'';
    const lastCard = await Task.findOne({ laneId }).sort({ order: -1 }).lean();
    const newOrder = lastCard ? lastCard.order + 1 : 1;

    if (!token) {
        throw new Error("Token de autenticação ausente");
    }
    let  userId;
    try{
        const decoded:any = jwt.verify(token, process.env.JWT_SECRET as string);
        userId = decoded.id
    }catch(error){
        throw new Error("Token de autenticação inválido" + error);
    }
    const slug = title.replace(/\s+/g, '-').toLowerCase();   
    if(!title||!boardId){
        throw new Error("O título e o id do board é obrigatório");
    }
    const task = await Task.create({ 
        title, 
        description, 
        user: userId,
        assignees:[...assignees],
        board: boardId,
        order:newOrder,
        laneId,
        slug 
    });    
    //getIO().emit("task:create", task);
    return task
}

export const getTasksByUser = async (id:string) => {
    const tasks = await Task.find({ 
        $or: [
            { user: id }, 
            { assignees: id} 
        ] 
    })
    .populate("assignees", "name email");
    return tasks;
};

export const getTaskByBoard = async (req: AuthenticatedRequest) => {
    const id = req.params.boardId
    console.log(id);
    const task = await Task.find({board:id}).populate("assignees", "name email");
    if (!task) throw new Error("Tarefa não encontrada");
    return task;
}

export const updateTask = async (id: string, updates: Partial<ITask>) => {
    const task = await Task.findByIdAndUpdate(id, updates, { new: true })
    .populate("assignees", "name email");;
    if (!task) throw new Error("Tarefa não encontrada");
    //getIO().emit("task:update", task);
    return task;
}


export const deleteTask = async (req: AuthenticatedRequest) => {
    const id = req.params.id
    console.log(id);
    const task = await Task.findByIdAndDelete(id);
    if (!task) throw new Error("Tarefa não encontrada");
    //getIO().emit("task:delete", {id});
    return { message: "Tarefa deletada com sucesso" };
};

export const addAssignee = async (taskId: string, userId: string) => {
    const task = await Task.findById(taskId);
    if (!task) throw new Error("Tarefa nao encontrada");
    await task.addAssigneeToTask(userId);
    //getIO().emit("task:update", task);  // Emitir evento via socket (se necessário)

    return task;
}


type UpdateCard = {
    id: string;
    laneId: string;
    position: number;
  };

  export const reorderTasks = async (
    updates: { id: string; laneId: string; order: number }[]
  ): Promise<void> => {
    const bulkOperations = updates.map(({ id, laneId, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { laneId, order } },
      },
    }));
  
    await Task.bulkWrite(bulkOperations);
  };