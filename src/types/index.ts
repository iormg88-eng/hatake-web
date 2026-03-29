export type StatusType = "good" | "caution" | "urgent" | "unknown";

export type TagType =
  | "bug"
  | "disease"
  | "water"
  | "growth"
  | "work"
  | "machine";

export type User = {
  id: number;
  name: string;
  email: string;
};

export type Group = {
  id: number;
  name: string;
  invite_token: string;
};

export type LatestLog = {
  status: StatusType;
  tags: TagType[];
  memo: string | null;
  updated_at: string;
  updated_by: string;
};

export type Field = {
  id: number;
  name: string;
  crop: string | null;
  latest_log: LatestLog | null;
};

export type FieldLog = {
  id: number;
  status: StatusType;
  tags: TagType[];
  memo: string | null;
  created_at: string;
  updated_by?: string;
  user?: Pick<User, "id" | "name">;
};

export type GroupMember = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "member";
};

export type GroupDetail = {
  group: Group;
  members: GroupMember[];
  fields: Field[];
};
