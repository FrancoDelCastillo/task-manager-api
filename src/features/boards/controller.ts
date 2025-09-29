import { Response } from "express";
import { AuthenticatedRequest } from "../../types/auth";
import * as boardRepo from "./repository";

export const getBoards = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const boards = await boardRepo.getBoardsByUser(userId);
    return res.status(201).json(boards);

  } catch (e: any) {
    return res.status(e.status || 500).json({ error: e.message });
  }
};

export const createBoard = async (req: AuthenticatedRequest, res: Response) =>{
  try {
    const userId = req.userId!;
    const { name, description } = req.body ?? {};

    const board = await boardRepo.createBoard( { name, description, created_by: userId});
    console.log("Board created")
    return res.status(201).json(board);
  } catch (e: any) {
    return res.status(e.status || 500).json({ error: e.message });
  }
}

export const updateBoard = async (req: AuthenticatedRequest, res: Response) => {
  try {

    const userId = req.userId!;
    
    const { boardId } = req.params;

    if (!boardId) {
      return res.status(400).json({ error: "Missing board id in params" });
    }

    const updates = req.body;
    const updated = await boardRepo.updateBoard(userId, boardId, updates);
    res.json(updated);
    // res.status(204).send(); 
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBoard = async (req: AuthenticatedRequest, res: Response) => {
  try {

    const userId = req.userId!;
    
    const { boardId } = req.params;

    if (!boardId) {
      return res.status(400).json({ error: "Missing board id in params" });
    }

    const deleted = await boardRepo.deleteBoard(userId, boardId);
    console.log("Board deleted")
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};