import { Response } from "express";
import { AuthenticatedRequest } from "../../types/auth";
import * as taskRepo from "./repository";

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { boardId } = req.params;
    
    if (!boardId) {
      return res.status(400).json({ 
        error: "Missing boardId in params",
        code: "MISSING_PARAMS"
      });
    }

    const tasks = await taskRepo.getTasksByBoard(boardId, userId);
    res.json(tasks);
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';
    
    res.status(statusCode).json({ 
      error: err.message,
      code: errorCode
    });
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { boardId } = req.params;

    if (!boardId) {
      return res.status(400).json({ error: "Missing boardId in params" });
    }

    const { title, description, status } = req.body ?? {};

    const task = await taskRepo.createTask({ board_id: boardId, title, description, status, created_by: userId });

    console.log("Task created")
    return res.status(201).json(task);

  } catch (e: any) {
    const statusCode = e.statusCode || e.status || 500;
    const errorCode = e.code || 'INTERNAL_ERROR';
    
    return res.status(statusCode).json({ 
      error: e.message,
      code: errorCode
    });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { taskId, boardId } = req.params;
    if (!taskId) {
      return res.status(400).json({ 
        error: "Missing task id in params",
        code: "MISSING_PARAMS"
      });
    }
    if (!boardId) {
      return res.status(400).json({ 
        error: "Missing board id in params",
        code: "MISSING_PARAMS"
      });
    }

    const updates = req.body;
    const updated = await taskRepo.updateTask(taskId, userId, boardId, updates);
    console.log("Task updated")
    res.json(updated);
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';
    
    res.status(statusCode).json({ 
      error: err.message,
      code: errorCode
    });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { taskId, boardId } = req.params;
    if (!taskId) {
      return res.status(400).json({ 
        error: "Missing task id in params",
        code: "MISSING_PARAMS"
      });
    }
    if (!boardId) {
      return res.status(400).json({ 
        error: "Missing board id in params",
        code: "MISSING_PARAMS"
      });
    }

    await taskRepo.deleteTask(taskId, userId, boardId);
    res.status(204).send();
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';
    
    res.status(statusCode).json({ 
      error: err.message,
      code: errorCode
    });
  }
};
