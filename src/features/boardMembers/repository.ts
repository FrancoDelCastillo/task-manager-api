import { supabaseSrv } from "../../db/supabase";

export type BoardMemberWithProfile = {
  id: string;
  role: "admin" | "member";
  board_id: string;
  profile: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
};

export const getBoardMembers = async (boardId: string): Promise<BoardMemberWithProfile[]> => {
  const { data, error } = await supabaseSrv
    .from("board_members")
    .select(`
      board_id,
      role,
      user_id,
      profiles (
        id,
        email,
        first_name,
        last_name
      )
    `)
    .eq("board_id", boardId);

  if (error) throw new Error(error.message);
  return (
    data?.map((m: any) => ({
      id: m.user_id,            
      role: m.role,
      board_id: m.board_id,
      profile: m.profiles ? {
        id: m.profiles.id,
        email: m.profiles.email,
        first_name: m.profiles.first_name,
        last_name: m.profiles.last_name,
      } : null,
    })) ?? []
  );
};

export const getUserRoleInBoard = async (boardId: string, userId: string) : Promise<BoardMemberWithProfile["role"]> => {
  const { data, error } = await supabaseSrv
    .from("board_members")
    .select("role")
    .eq("board_id", boardId)
    .eq("user_id", userId)
    .single();
    
    console.log("getUserRoleInBoard data: ", data)
    
  if (error) throw new Error(error.message);
  return data.role as BoardMemberWithProfile["role"];
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

export const addBoardMember = async (boardId: string, new_member: string, role: BoardMemberWithProfile["role"] = "member"): Promise<void> => {
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
