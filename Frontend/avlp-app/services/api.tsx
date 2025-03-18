import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9898";

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`, // หรือวิธีการอื่นในการเก็บ token
  },
});

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post("/users/login", { username, password });
    return response.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
};

export const register = async (username: string, password: string, email: string) => {
  try {
    const register = await api.post("/users", { username, password, email });
    return register.data;
  } catch (error: any) {
    throw error.response.data.message;
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

// แก้ไขฟังก์ชัน resetPassword ในไฟล์ API service
export const resetPassword = async (email: string, new_password: string, code: string) => {
  try {
    const response = await api.post('/users/reset-password', { 
      email, 
      new_password,
      code 
    });
    return response.data;
  } catch (error: any) {
    // Better error handling with more specific errors
    if (error.response) {
      const errorMessage = error.response.data.error || 
                          error.response.data.message || 
                          "Failed to reset password";
      throw new Error(errorMessage);
    }
    throw new Error("Network error. Please try again later.");
  }
};

// เพิ่มฟังก์ชันใหม่สำหรับตรวจสอบโค้ดโดยไม่เปลี่ยนรหัสผ่าน
export const verifyCode = async (email: string, code: string) => {
  try {
    // Use a dedicated endpoint for verification if available
    // If not, we can use a different approach
    const response = await api.post('/users/verify-code', { 
      email, 
      code 
    });
    return true;
  } catch (error: any) {
    console.error("Verification error:", error);
    return false;
  }
};

// เพิ่มฟังก์ชันใหม่สำหรับการเปลี่ยนรหัสผ่าน
export const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
  try {
    const response = await api.put(`/users/${userId}/change-password`, { old_password: oldPassword, new_password: newPassword });
    return response.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
}