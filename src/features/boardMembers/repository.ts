import { supabaseSrv } from "../../db/supabase";

export interface BoardMember {
  board_id: string;
  user_id: string;
  role: "admin" | "member";
  created_at: string;
}

export const getBoardMembers = async (boardId: string): Promise<BoardMember[]> => {
  const { data, error } = await supabaseSrv
    .from("board_members")
    .select("*")
    .eq("board_id", boardId)

  if (error) throw new Error(error.message);
  return (data as BoardMember[]) ?? [];
};

export const isBoardMember = async (boardId: string, userId: string): Promise<boolean> => {
  const { data, error } = await supabaseSrv
    .from("board_members")
    .select("user_id")
    .eq("board_id", boardId)
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return !!data;
};

export const addBoardMember = async (boardId: string, new_member: string, role: BoardMember["role"] = "member"): Promise<void> => {
  const { error } = await supabaseSrv
    .from("board_members")
    .insert({ board_id: boardId, user_id: new_member, role });

  if (error) throw new Error(error.message);
};

export const removeBoardMember = async (boardId: string, userId: string): Promise<void> => {
  const { error } = await supabaseSrv
    .from("board_members")
    .delete()
    .eq("board_id", boardId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
};
