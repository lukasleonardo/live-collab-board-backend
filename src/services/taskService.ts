import Task, { ITask } from "../models/Task";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import  jwt  from "jsonwebtoken";

export const createTask = async (req: AuthenticatedRequest) => {
    const { title, description, boardId,laneId,members } = req.body;    
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
        members:[...members],
        board: boardId,
        order:newOrder,
        laneId,
        slug 
    });    
    
    return task
}

export const getTasksByUser = async (id:string) => {
    const tasks = await Task.find({ 
        $or: [
            { user: id }, 
            { assignees: id} 
        ] 
    })
    .populate("members", "_id name email");
    return tasks;
};

export const getTaskByBoard = async (req: AuthenticatedRequest) => {
    const id = req.params.boardId
    const task = await Task.find({board:id}).populate("members", "_id name email");
    if (!task) throw new Error("Tarefa não encontrada");
    return task;
}

export const updateTask = async (id: string, updates: Partial<ITask>) => {
    const task = await Task.findByIdAndUpdate(id, updates, { new: true })
    .populate("members", "_id name email");;
    if (!task) throw new Error("Tarefa não encontrada");
    ;
    return task;
}


export const deleteTask = async (req: AuthenticatedRequest) => {
    const id = req.params.id
    const task = await Task.findByIdAndDelete(id);
    if (!task) throw new Error("Tarefa não encontrada");
    
    return { message: "Tarefa deletada com sucesso" };
};

export const addAssignee = async (taskId: string, userId: string) => {
    const task = await Task.findById(taskId);
    if (!task) throw new Error("Tarefa nao encontrada");
    await task.addAssigneeToTask(userId);

    return task;
}


type UpdateCard = {
    id: string;
    laneId: string;
    order: number;
  };

  export const reorderTasks = async (
    updates: UpdateCard[]
  ): Promise<void> => {
    try {
        const bulkOperations = updates.map(({ id, laneId, order }) => ({
          updateOne: {
            filter: { _id: id },
            update: { $set: { laneId, order } },
          },
        }));
    
        // Executa as operações de bulkWrite
        const result = await Task.bulkWrite(bulkOperations);
    
        // Checa se todas as tarefas foram atualizadas
        if (result.modifiedCount === updates.length) {
          console.log('Todas as tarefas foram atualizadas com sucesso');
        } else {
          console.warn('Algumas tarefas não foram atualizadas');
        }
    
      } catch (error) {
        console.error('Erro ao atualizar tarefas:', error);
        throw new Error('Erro ao realizar a reordenação das tarefas');
      }
  };


  export const findTaskById = async (id: string) => {
    const task = await Task.findById(id).populate("members", "_id name email");
    if (!task) throw new Error("Tarefa nao encontrada");
    return task;
  }