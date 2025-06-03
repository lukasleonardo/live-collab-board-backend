import Board, { IBoard } from "../models/Board";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Task from "../models/Task";

export const createBoard = async (req: AuthenticatedRequest) => {
    const { title, description, members } = req.body;
    const token = req.header('Authorization')?.split(' ')[1]??'';
    if(!title){
        throw new Error("O título é obrigatório");
    }
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

    const board = await Board.create({ 
        title, 
        description, 
        owner: userId,
        members: [userId,...members]},  
    );
    
    const populatedBoard = await Board.findById(board._id)
    .populate('owner', 'name').populate('members', '_id name email')
    .exec();

    if (!populatedBoard) {
        throw new Error("Erro ao criar o board");
    }
    return populatedBoard
}

export const getBoards = async (req: AuthenticatedRequest) => {
    const boards = await Board.find({ members: req.user._id }).populate("owner", "name email").populate("members", "_id name email");;
    return boards;
}

export const getBoardById = async (id: string, userId: string) => {
    const board = await Board.findOne({_id:id,members:userId}).populate("owner", "name email").populate("members", "_id name email");
    if(!board){
        throw new Error("Quadro não encontrado");
    }
    return board;
}

export const updateBoard = async (id: string, userId: string, updates: Partial<IBoard>) => {
    console.log("Tentando atualizar board:", { id, userId });
    const board = await Board.findOneAndUpdate({
        _id:id,
        owner:userId,  
    },updates,{new:true});

    if(!board){
        throw new Error("Quadro não encontrado ou sem permissão para editar");
    }
    return board;
}

export const deleteBoard = async (req: AuthenticatedRequest) => {
  const id = req.params.id;
  const board = await Board.findById(id);

  if (!board) {
    throw new Error("Quadro não encontrado");
  }

  if (board.owner.toString() !== req.user._id.toString()) {
    throw new Error("Você não tem permissão para deletar este quadro");
  }
  await board.deleteOne();

  return { message: "Quadro deletado com sucesso" };
};


export const getBoardsWithTaskCount = async (req: AuthenticatedRequest) => {
  const boards = await Board.find({ members: req.user._id }).lean();

  // Adiciona o taskCount a cada board
  const boardsWithCount = await Promise.all(
    boards.map(async (board) => {
      const count = await Task.countDocuments({ board: board._id });
      return {
        ...board,
        taskCount: count,
      };
    })
  );

  return boardsWithCount;
};