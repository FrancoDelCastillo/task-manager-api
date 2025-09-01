import { SupabaseClient } from "@supabase/supabase-js";
import { Board } from "./types";

export const getBoardsByUser = async (supabase: SupabaseClient, userId: string): Promise<Board[]> => {
  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .eq("created_by", userId);

  if (error) throw new Error(error.message);
  return data || [];
};

export const createBoard = async (
  supabase: SupabaseClient,
  board: Omit<Board, "id" | "created_at">
): Promise<Board> => {
  try {
    const { data, error } = await supabase
      .from("boards")
      .insert(board)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    throw err;
  }
};

export const updateBoard = async (
  supabase: SupabaseClient,
  boardId: string,
  updates: Partial<Board>
): Promise<Board> => {
  const { data, error } = await supabase
    .from("boards")
    .update(updates)
    .eq("id", boardId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const deleteBoard = async (
  supabase: SupabaseClient,
  boardId: string
): Promise<void> => {
  const { error } = await supabase.from("boards").delete().eq("id", boardId);
  if (error) throw new Error(error.message);
};