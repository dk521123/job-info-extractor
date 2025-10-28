export type UpdatedJobInfo = {
  id?: number;
  file_name?: string;
  file_type?: string;
  company_name: string;
  position: string;
  location: string;
  salary: string;
  created_at?: string;
  updated_at?: string;
  updateType: UpdateType;
};

export type UpdateType = "new" | "update" | "delete";