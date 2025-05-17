import api from "./api";
import { Profile } from "../types/profile";

export const fetchMyProfile = async (): Promise<Profile> => {
  const res = await api.get("/profile/me");
  return res.data;
};

export const updateProfile = async (data: Profile): Promise<Profile> => {
  const res = await api.put("/profile", data);
  return res.data;
};

export const fetchProfileById = async (id: string) => {
  const res = await api.get(`/profile/${id}`);
  return res.data;
};
