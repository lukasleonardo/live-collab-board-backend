import Task, { ITask } from "../models/Task";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { getIO } from "../sockets/index";
import  jwt  from "jsonwebtoken";

export const createTask = async (req: AuthenticatedRequest) => {
    const { title, description, boardId, status  } = req.body;    
    const token = req.header('Authorization')?.split(' ')[1]??'';
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
        assignees:[userId],
        board: boardId,
        status,
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

type taskStatus = "todo" | "inprogress" | "done";

export const updateTaskStatus = async (taskId: string, status: taskStatus) => {
    const task = await Task.findById(taskId);
    if (!task) throw new Error("Tarefa nao encontrada");
    if(!["todo", "inprogress", "done"].includes(status)){
        throw new Error("Status inválido");
    }
    task.status = status;
    await task.save();
    //getIO().emit("task:update", task);  // Emitir evento via socket (se necesario)
    return task;
}

type UpdateCard = {
    id: string;
    laneId: string;
    position: number;
  };
  export const updateCardsInBatch = async (updates: UpdateCard[]) => {
    const operations = updates.map(({ id, laneId, position }) => ({
      updateOne: {
        filter: { _id: id },
        update: {
          $set: { laneId, position },
        },
      },
    }));
  
    const result = await Task.bulkWrite(operations);
    return result;
  };