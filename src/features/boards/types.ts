export interface Board {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
}

export type BoardInsert = Pick<Board, "name" | "description">;