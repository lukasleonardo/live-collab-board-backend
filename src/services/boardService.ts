import Board, { IBoard } from "../models/Board";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export const createBoard = async (req: AuthenticatedRequest) => {
    const { title, description } = req.body;
    if(!title){
        throw new Error("O título é obrigatório");
    }

    const board = await Board.create({ 
        title, 
        description, 
        owner: req.user._id,
        members: [req.user._id]});

    return board
}

export const getBoards = async (req: AuthenticatedRequest) => {
    const boards = await Board.find({ members: req.user._id }).populate("owner", "name email");;
    return boards;
}

export const getBoardById = async (id: string, userId: string) => {
    const board = await Board.findById({_id:id,members:userId}).populate("owner", "name email");
    if(!board){
        throw new Error("Quadro não encontrado");
    }
    return board;
}

export const updateBoard = async (id: string, userId: string, updates: Partial<IBoard>) => {
    const board = await Board.findOneAndUpdate({
        id:id,
        owner:userId,  
    },{updates},{new:true});

    if(!board){
        throw new Error("Quadro não encontrado ou sem permissão para editar");
    }
    return board;
}

export const deleteBoard = async (id: string, userId: string) =>{
    const board = await Board.findOneAndDelete({id:id,owner:userId});
    if(!board){
        throw new Error("Quadro não encontrado ou sem permissão para deletar");
    }
    return {message:"Quadro deletado com sucesso"};
}