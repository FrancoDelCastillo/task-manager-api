import { Response } from "express";
import { AuthenticatedRequest } from "../../types/auth";
import * as boardRepo from "./repository";

export const getBoards = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!req.supabase) {
      return res.status(500).json({ error: "Database client not available" });
    }

    const boards = await boardRepo.getBoardsByUser(req.supabase, req.user.id);
    res.json(boards);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createBoard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log('🎯 createBoard called');
    console.log('👤 req.user:', req.user);
    console.log('🔑 req.supabase exists:', !!req.supabaseAuth);
    
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!req.supabaseAuth) {
      return res.status(500).json({ error: "Database client not available" });
    }

    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log('📝 Creating board:', name, 'by user:', req.user.id);
    console.log('🔑 About to call repository with authenticated client...');

    const newBoard = await boardRepo.createBoard(req.supabaseAuth, { 
      name, 
      description
    });

    
    
    console.log('✅ Board created successfully:', newBoard.id);
    res.status(201).json(newBoard);
  } catch (err: any) {
    console.log('❌ newBoard:', err);
    console.log('❌ Error in createBoard:', err.message);
    res.status(500).json({ error: err.message });
  }
};

export const updateBoard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.supabase) {
      return res.status(500).json({ error: "Database client not available" });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Missing board id in params" });
    }

    const updates = req.body;
    const updated = await boardRepo.updateBoard(req.supabase, id, updates);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBoard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.supabase) {
      return res.status(500).json({ error: "Database client not available" });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Missing board id in params" });
    }

    await boardRepo.deleteBoard(req.supabase, id);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};