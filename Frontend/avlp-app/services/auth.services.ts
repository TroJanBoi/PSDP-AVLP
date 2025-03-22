// services/auth.service.ts
import api from './api';
import { handleApiError } from './error.helper';

export const login = async (username: string, password: string) => {
  try {
    const res = await api.post("/users/login", { username, password });
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const register = async (username: string, password: string, email: string) => {
  try {
    const res = await api.post("/users", { username, password, email });
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const forgotPassword = async (username: string) => {
  try {
    const res = await api.post("/users/forgot-password", { username });
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const resetPassword = async (email: string, new_password: string, code: string) => {
  try {
    const res = await api.post("/users/reset-password", { email, code, new_password });
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};
