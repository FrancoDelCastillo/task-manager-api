import type { Response } from "express";
import type { AuthenticatedRequest } from "../../types/auth";
import * as boardMembersRepo from "./repository";
import { supabaseSrv } from "../../db/supabase";

export async function getBoardMembers(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    const boardId = req.params.boardId;

    if (!boardId) {
      return res.status(400).json({ error: "Missing board id" });
    }
    
    const isMember = await boardMembersRepo.isBoardMember(boardId, userId);
    if (!isMember) {
      return res.status(403).json({ error: "Access denied: You are not a member of this board" });
    }

    const rows = await boardMembersRepo.getBoardMembers(boardId);
    return res.json(rows);
  } catch (e: any) {
    return res.status(e.status || 500).json({ error: e.message });
  }
}

export async function addBoardMember(req: AuthenticatedRequest, res: Response) {
  try {
    const requester = req.userId!;
    const boardId = req.params.boardId;
    const { new_member } = req.body;
    const role = "member";

    if (!boardId) {
      return res.status(400).json({ error: "Missing board id" });
    }

    const { data: board, error } = await supabaseSrv
      .from("boards")
      .select("created_by")
      .eq("id", boardId)
      .single();

    if (error || !board || board.created_by !== requester) {
      return res.status(403).json({ error: "Access denied: Only board owner can add members" });
    }

    if (new_member === requester) {
      return res.status(400).json({ error: "Board owner cannot add themselves as a member" });
    }

    const isAlreadyMember = await boardMembersRepo.isBoardMember(boardId, new_member);
    if (isAlreadyMember) {
      return res.status(400).json({ error: "User is already a member of this board" });
    }

    await boardMembersRepo.addBoardMember(boardId, new_member, role);

    console.log("member added")
    return res.status(201).json({ ok: true });
  } catch (e: any) {
    return res.status(e.status || 500).json({ error: e.message });
  }
}

export async function removeBoardMember(req: AuthenticatedRequest, res: Response) {
  try {
    const requester = req.userId!;
    const boardId = req.params.boardId;
    const { userId } = req.body;
  
    if (!boardId) {
      return res.status(400).json({ error: "Missing board id" });
    }

    if (!userId) {
      return res.status(400).json({ error: "Missing user id in request body" });
    }

    const { data: board, error } = await supabaseSrv
      .from("boards")
      .select("created_by")
      .eq("id", boardId)
      .single();

    if (error || !board || board.created_by !== requester) {
      return res.status(403).json({ error: "Access denied: Only board owner can remove members" });
    }

    if (userId === requester) {
      return res.status(400).json({ error: "Board owner cannot remove themselves" });
    }

    const isMember = await boardMembersRepo.isBoardMember(boardId, userId);
    if (!isMember) {
      return res.status(404).json({ error: "User is not a member of this board" });
    }

    await boardMembersRepo.removeBoardMember(boardId, userId);
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(e.status || 500).json({ error: e.message });
  }
}