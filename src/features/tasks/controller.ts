import { Response } from "express";
import { AuthenticatedRequest } from "../../types/auth";
import * as taskRepo from "./repository";

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.supabase) {
      return res.status(500).json({ error: "Database client not available" });
    }

    const { boardId } = req.params;
    if (!boardId) {
      return res.status(400).json({ error: "Missing boardId in params" });
    }

    const tasks = await taskRepo.getTasksByBoard(req.supabase, boardId);
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log('🎯 createTask called');
    console.log('👤 req.user:', req.user);
    console.log('🔑 req.supabase exists:', !!req.supabase);
    
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!req.supabase) {
      return res.status(500).json({ error: "Database client not available" });
    }

    const { board_id, title } = req.body;
    if (!board_id || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log('📝 Creating task for board:', board_id, 'by user:', req.user.id);
    console.log('🔑 About to call repository with authenticated client...');

    const { description = "", status = "todo" } = req.body;
    const newTask = await taskRepo.createTask(req.supabase, {
      board_id,
      title,
      description,
      status,
      created_by: req.user.id,
    });
    
    console.log('✅ Task created successfully:', newTask.id);
    res.status(201).json(newTask);
  } catch (err: any) {
    console.log('❌ Error in createTask:', err.message);
    res.status(500).json({ error: err.message });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.supabase) {
      return res.status(500).json({ error: "Database client not available" });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Missing task id in params" });
    }

    const updates = req.body;
    const updated = await taskRepo.updateTask(req.supabase, id, updates);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.supabase) {
      return res.status(500).json({ error: "Database client not available" });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Missing task id in params" });
    }

    await taskRepo.deleteTask(req.supabase, id);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
