import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseSrv } from "../../db/supabase";
import { Task } from "./types";

export interface CreateTaskInput {
  board_id: string;
  title: string;
  description?: string;
  status: string;
  created_by: string;
}

export const getTasksByBoard = async (boardId: string, userId: string): Promise<Task[]> => {
  const { data: membership, error: membershipError } = await supabaseSrv
    .from("board_members")
    .select()
    .eq("board_id", boardId)
    .eq("user_id", userId)
    .single();

  if (membershipError || !membership) {
    const error = new Error("Access denied: You are not a member of this board");
    (error as any).statusCode = 403;
    (error as any).code = 'FORBIDDEN';
    throw error;
  }

  const { data, error } = await supabaseSrv
    .from("tasks")
    .select("*")
    .eq("board_id", boardId);

  if (error) throw new Error(error.message);
  return data;
};

export const createTask = async (
  task: CreateTaskInput
): Promise<Task> => {
  const { data: membership, error: membershipError } = await supabaseSrv
    .from("board_members")
    .select()
    .eq("board_id", task.board_id)
    .eq("user_id", task.created_by)
    .single();

  if (membershipError || !membership) {
    const error = new Error("Access denied: You are not a member of this board");
    (error as any).statusCode = 403;
    (error as any).code = 'FORBIDDEN';
    throw error;
  }

  const { data, error } = await supabaseSrv
    .from("tasks")
    .insert(task)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateTask = async (
  taskId: string,
  userId: string,
  boardId: string,
  updates: Partial<Task>
): Promise<Task> => {
  const { data, error } = await supabaseSrv
    .from("tasks")
    .update(updates)
    .eq("id", taskId)
    .eq("board_id", boardId)
    .eq("created_by", userId)
    .select()
    .single();

  if (error) {
    const errorMsg = new Error(error.message);
    (errorMsg as any).statusCode = 404;
    (errorMsg as any).code = 'NOT_FOUND_OR_FORBIDDEN';
    throw errorMsg;
  }
  
  if (!data) {
    const error = new Error("Task not found or you don't have permission to update it");
    (error as any).statusCode = 404;
    (error as any).code = 'NOT_FOUND_OR_FORBIDDEN';
    throw error;
  }
  
  return data;
};

export const deleteTask = async (
  taskId: string,
  userId: string,
  boardId: string
): Promise<void> => {
  const { data: task, error: taskError } = await supabaseSrv
    .from("tasks")
    .select("board_id")
    .eq("id", taskId)
    .eq("board_id", boardId) 
    .single();

  if (taskError || !task) {
    const error = new Error("Task not found in this board");
    (error as any).statusCode = 404;
    (error as any).code = 'NOT_FOUND';
    throw error;
  }

  const { data: membership, error: membershipError } = await supabaseSrv
    .from("board_members")
    .select("role")
    .eq("board_id", boardId)
    .eq("user_id", userId)
    .single();

  if (membershipError || !membership || membership.role !== 'admin') {
    const error = new Error("Access denied: Admin role required to delete tasks");
    (error as any).statusCode = 403;
    (error as any).code = 'FORBIDDEN';
    throw error;
  }

  const { error } = await supabaseSrv
    .from("tasks")
    .delete()
    .eq("id", taskId);

    console.log("Task deleted")
    
  if (error) throw new Error(error.message);
};