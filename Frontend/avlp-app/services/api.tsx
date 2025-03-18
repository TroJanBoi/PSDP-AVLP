import axios from 'axios';


const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9898";

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post("/users/login", { username, password });
    return response.data;
  } catch (error: any) {
    error.response.data.message;
  }
};

export const register = async (username: string, password: string, email: string) => {
  try {
    const register = await api.post("/users", { username, password, email });
    return register.data;
  } catch (error: any) {
    error.response.data.message;
  }
}

export const forgotPassword = async (username: string) => {
  try {
    const response = await api.post("/users/forgot-password", { username });
    return response.data; // Should only return email and success message, NOT the code
  } catch (error: any) {
    throw error; // Properly throw the error
  }
}

export const resetPassword = async (email: string, new_password: string, code: string) => {
  try {
    const response = await api.post("/users/reset-password", { email, code, new_password });
    return response.data;
  } catch (error: any) {
    throw error; // Properly throw the error
  }
}

// เพิ่มฟังก์ชันใหม่สำหรับการตรวจสอบ OTP
export const verifyOTP = async (email: string, code: string) => {
  try {
    const response = await api.post("/users/verify-otp", { email, code });
    return response.data;
  } catch (error: any) {
    throw error;
  }
}