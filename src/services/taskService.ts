import Task, { ITask } from "../models/Task";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { getIO } from "../sockets/index";

export const createTask = async (req: AuthenticatedRequest) => {
    const { title, description, boardId, assignees  } = req.body;
    const slug = title.replace(/\s+/g, '-').toLowerCase();
    
    if(!title||!boardId){
        throw new Error("O título e o id do board é obrigatório");
    }
    const task = await Task.create({ 
        title, 
        description, 
        user: req.user._id,
        assignees:[...(assignees || []), req.user._id],
        board: boardId,
        slug 
    });
    getIO().emit("task:create", task);
    return task
}

export const getTasks = async (req: AuthenticatedRequest) => {
    const tasks = await Task.find({ 
        $or: [
            { user: req.user._id }, 
            { assignees: req.user._id } 
        ] 
    })
    .populate("assignees", "name email");

    return tasks;
};

export const getTaskById = async (id: string) => {
    const task = await Task.findById(id).populate("assignees", "name email");
    if (!task) throw new Error("Tarefa não encontrada");
    return task;
}

export const updateTask = async (id: string, updates: Partial<ITask>) => {
    const task = await Task.findByIdAndUpdate(id, updates, { new: true })
    .populate("assignees", "name email");;
    if (!task) throw new Error("Tarefa não encontrada");
    getIO().emit("task:update", task);
    return task;
}


export const deleteTask = async (id: string) => {
    const task = await Task.findByIdAndDelete(id);
    if (!task) throw new Error("Tarefa não encontrada");
    getIO().emit("task:delete", {id});
    return { message: "Tarefa deletada com sucesso" };
};

export const addAssignee = async (taskId: string, userId: string) => {
    const user =parseAssignees(userId);
    const task = await Task.findById(taskId);
    if (!task) throw new Error("Tarefa nao encontrada");
    task.assignees.push(user);
    await task.save();
    // getIO().emit("task:update", task);
    return task;
}