import {Request, Response} from "express";
import {createBoard, getBoards, getBoardById, deleteBoard, updateBoard} from "../services/boardService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export const create = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const board = await createBoard(req);
        res.status(201).json(board);
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
}

export const listBoards = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const boards = await getBoards(req);
        res.status(200).json(boards);
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
}

export const getOne = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const board = await getBoardById(req.params.id, req.user._id);
        res.status(200).json(board);
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
}

export const update = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const board = await updateBoard(req.params.id, req.user._id, req.body);
        res.status(200).json(board);
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
}

export const remove = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const board = await deleteBoard(req.params.id, req.user._id);
        res.status(200).json(board);
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
}