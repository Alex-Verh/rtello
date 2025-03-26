export interface ListResponse {
  id: number;
  container_id: number;
  name: string;
  position: number;
  created_at: string;
  update_at: string;
}

export interface TaskResponse {
  id: number;
  list_id: number;
  description: string;
  position: number;
  created_at: string;
  update_at: string;
}
