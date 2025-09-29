import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseSrv } from "../../db/supabase";
import { Board, BoardInsert } from "./types";

export interface CreateBoardInput {
  name: string;
  description?: string;
  created_by: string;
}

export const getBoardsByUser = async (userId: string): Promise<Board[]> => {
  const { data, error } = await supabaseSrv
    .from("boards")
    .select("*")
    .eq("created_by", userId);

  if (error) throw new Error(error.message);
  return data;
};

export const createBoard = async (
  input: CreateBoardInput
): Promise<Board> => {
    const { data, error } = await supabaseSrv
      .from("boards")
      .insert(input)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
};

export const updateBoard = async (
  userId: string,
  boardId: string,
  updates: Partial<Board>
): Promise<Board> => {
  const { data, error } = await supabaseSrv
    .from("boards")
    .update(updates)
    .eq("id", boardId)
    .eq("created_by", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const deleteBoard = async (
  userId: string,
  boardId: string
): Promise<void> => {
  const { error } = await supabaseSrv.from("boards").delete().eq("id", boardId).eq("created_by", userId);
  if (error) throw new Error(error.message);
};