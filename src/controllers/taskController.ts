import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { createTask, deleteTask, updateTask, addAssignee, getTaskByBoard, getTasksByUser, updateTaskStatus, updateCardsInBatch } from "../services/taskService";


export const create = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const task = await createTask(req);
        res.status(201).json(task);
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
};

export const listByUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const id = req.body.id
        const tasks = await getTasksByUser(id);
        res.status(200).json(tasks);
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
};

export const listByBoard = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const task = await getTaskByBoard(req);
        res.status(200).json(task);
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
};

export const update = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const task = await updateTask(req.params.id, req.body);
        res.status(200).json(task);
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
};

export const removeTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const task = await deleteTask(req);    
        res.status(200).json(task);
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
};

export const assignToTask= async (req: AuthenticatedRequest, res: Response) => {
    try {
        const taskId = req.params.id
        const userId = req.body.id
        const task = await addAssignee(taskId,userId);    
        res.status(200).json(task);
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
};

export const changeTaskStatus = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const taskId = req.params.id
        const status = req.body.status
        const task = await updateTaskStatus(taskId,status); 
        res.status(200).json(task);
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
}

export const updateTasksinBatch = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const tasks = req.body.tasks
        const task = await updateCardsInBatch(tasks); 
        res.status(200).json(task);
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
}