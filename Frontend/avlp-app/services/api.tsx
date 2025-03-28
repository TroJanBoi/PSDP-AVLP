// services/api.ts
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9898";

console.log("✅ API base URL:", API);

const api = axios.create({
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
    throw error.response?.data?.message || "การเข้าสู่ระบบล้มเหลว";
  }
};

export const register = async (username: string, password: string, email: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    });

    return await response.json();
  } catch (error: any) {
    console.error('Register Error:', error.message || error);
    throw new Error(error.message || 'Unknown error occurred');
  }
};



export const forgotPassword = async (username: string) => {
  try {
    const response = await api.post("/users/forgot-password", { username });
    return response.data; // ส่งคืนอีเมลสำหรับการส่งรหัสยืนยัน
  } catch (error: any) {
    throw error;
  }
};

export const verifyCode = async (email: string, code: string) => {
  try {
    // ส่งคำขอไปยัง API เพื่อตรวจสอบรหัสยืนยัน
    try {
      // ใช้ endpoint reset-password เพื่อตรวจสอบความถูกต้องของรหัส OTP
      const response = await api.post("/users/reset-password", {
        email: email,
        new_password: "temporary_verification_password",
        code: code
      });
      
      return true;
    } catch (apiError: any) {
      // ในกรณีที่รหัส OTP ไม่ถูกต้อง (สถานะข้อผิดพลาด 401)
      if (apiError.response && apiError.response.status === 401) {
        return false;
      }
      
      throw new Error("เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ระหว่างการตรวจสอบ OTP กรุณาลองใหม่อีกครั้ง");
    }
  } catch (error: any) {
    console.error("ข้อผิดพลาดรหัสยืนยัน:", error);
    throw error;
  }
};

export const resetPassword = async (email: string, password: string, code: string) => {
  try {
    // ส่งคำขอเปลี่ยนรหัสผ่านไปยัง API โดยตรง
    const requestData = {
      email: email,
      new_password: password,
      code: code
    };
    
    const response = await api.post('/users/reset-password', requestData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response?.data?.message || "การรีเซ็ตรหัสผ่านล้มเหลว";
    } else if (error.request) {
      throw "ไม่ได้รับการตอบกลับจากเซิร์ฟเวอร์ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต";
    } else {
      throw error;
    }
  }
};

export const getAllClass = async () => {
  try {
    const response = await api.get('/classes');
    return response.data;
  } catch (error: any) {
    throw error || "ไม่สามารถดึงข้อมูลชั้นเรียนได้";
  }
};

export const getProblemsByClassId = async (classId: string, token: string) => {
  try {
    const response = await api.get(`/api/classes/${classId}/problem`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.log("Error loading problems:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return [];
  }
};

export const createProblemAttempt = async (problemId: number, userId: number) => {
  const startedAt = new Date().toISOString(); // ✅ ISO 8601

  const body = {
    problem_id: problemId,
    started_at: startedAt,
    user_id: userId,
  };

  try {
    const response = await api.post(`/api/problem_attempt/${problemId}`, body); // ✅ corrected endpoint
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "ไม่สามารถเริ่มโจทย์ได้";
  }
};

export const getClassById = async (classId: string | number) => {
  try {
    const response = await api.get(`/classes/${classId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "ไม่สามารถดึงข้อมูลคลาสได้";
  }
};
