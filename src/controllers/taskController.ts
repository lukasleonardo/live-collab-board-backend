import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { createTask, deleteTask, updateTask, getTasks, getTaskById, addAssignee } from "../services/taskService";


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
        const tasks = await getTasks(req);
        res.status(200).json(tasks);
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
};

export const listByBoard = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const task = await getTaskById(req.params.id);
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
        const task = await deleteTask(req.params.id);    
        res.status(200).json(task);
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
};

export const assignToTask= async (req: AuthenticatedRequest, res: Response) => {
    try {
        const task = await addAssignee(req.params.id, req.body.userId);    
        res.status(200).json(task);
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
};