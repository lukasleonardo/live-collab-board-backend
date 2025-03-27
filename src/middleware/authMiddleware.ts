import { Request, Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User";
dotenv.config();

export interface AuthenticatedRequest extends Request {
    user?: any;
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token = req.header('Authorization')?.split(' ')[1]??'';
    if (!token || token==='') {
        res.status(401).json({ error: 'Acesso não authorizado' })
    }

    try {
        const decoded:any = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
}