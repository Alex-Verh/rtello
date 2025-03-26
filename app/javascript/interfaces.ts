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

export interface TemplateResponse {
  id: number;
  container_id: number;
  usage_count: number;
  created_at: string;
  update_at: string;
  container: {
    id: number;
    name: string;
    container_type: number;
    created_at: string;
    update_at: string;
  };
}
