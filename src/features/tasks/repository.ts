import { SupabaseClient } from "@supabase/supabase-js";
import { Task } from "./types";

export const getTasksByBoard = async (supabase: SupabaseClient, boardId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("board_id", boardId);

  if (error) throw new Error(error.message);
  return data || [];
};

export const createTask = async (
  supabase: SupabaseClient,
  task: Omit<Task, "id" | "created_at">
): Promise<Task> => {
  const { data, error } = await supabase
    .from("tasks")
    .insert(task)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateTask = async (
  supabase: SupabaseClient,
  taskId: string,
  updates: Partial<Task>
): Promise<Task> => {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const deleteTask = async (
  supabase: SupabaseClient,
  taskId: string
): Promise<void> => {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) throw new Error(error.message);
};