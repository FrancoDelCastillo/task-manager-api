export interface Board {
    id: string;
    name: string;
    description?: string | null;
    created_at: string;
    created_by: string; // user id
  }