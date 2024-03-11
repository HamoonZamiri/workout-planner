export type User = {
  id: string;
  email: string;
  refreshToken: string;
  accessToken: string;
};

export type APIResponse<T> = {
  message: string;
  data: T;
  error?: string;
  emptyFields?: string[];
};

export type WorkoutFormData = {
  title: string;
  load: string;
  repsLow: string;
  repsHigh: string;
  setsLow: string;
  setsHigh: string;
};

export const initialFormData: WorkoutFormData = {
  title: "",
  load: "0",
  repsLow: "8",
  repsHigh: "12",
  setsLow: "1",
  setsHigh: "3",
};
