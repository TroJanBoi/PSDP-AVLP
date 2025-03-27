import axios from 'axios';
import Swal from 'sweetalert2';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9898";

const api = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
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

export const changePassword = async (
  username: string, 
  currentPassword: string, 
  newPassword: string
) => {
  try {
    // First, validate inputs
    if (!username || !currentPassword || !newPassword) {
      throw new Error("All password fields are required");
    }
    if (currentPassword.length < 6 || newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Step 1: Verify current password by attempting to login
    try {
      await login(username, currentPassword);
    } catch (loginError) {
      throw new Error("Current password is incorrect");
    }

    // Step 2: Initiate forgot password flow to get verification code
    const forgotResponse = await forgotPassword(username);
    
    // Prompt user to enter the verification code
    const { value: code } = await Swal.fire({
      title: 'Enter Verification Code',
      input: 'text',
      text: 'A verification code has been sent to your email',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to enter the verification code!';
        }
      }
    });

    if (!code) {
      throw new Error("Verification cancelled");
    }

    // Step 3: Reset password using the verification code
    const resetResponse = await resetPassword(
      forgotResponse.email, 
      newPassword, 
      code
    );

    console.log('Change Password Response:', resetResponse);
    return resetResponse;

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('CHANGE PASSWORD ERROR (Axios):', {
        errorMessage: error.message ?? "No error message",
        responseStatus: error.response?.status ?? "No status",
        responseData: error.response?.data ?? "No response data"
      });

      throw new Error(error.response?.data?.message || "Failed to change password");
    } else if (error instanceof Error) {
      console.error('CHANGE PASSWORD ERROR (General):', error.message);
      throw error;
    } else {
      console.error('CHANGE PASSWORD ERROR (Unknown):', error);
      throw new Error("Unexpected error occurred");
    }
  }
};

export const register = async (username: string, password: string, email: string) => {
  try {
    const response = await api.post("/users", { username, password, email });
    return response.data; 
  } catch (error: any) {
    throw error.response?.data?.message || "การลงทะเบียนล้มเหลว";
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
    try {
      const response = await api.post("/users/reset-password", {
        email: email,
        new_password: "temporary_verification_password",
        code: code
      });
      
      return true;
    } catch (apiError: any) {
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
      throw "ไม่ได้รับการตอบกลับจากเซิร์ฟเวอร์ กรุณาตรวจสอบ การเชื่อมต่ออินเทอร์เน็ต";
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

export const getUserProfile = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to fetch user profile";
  }
};

export const updateUserProfile = async (
  userId: string, 
  profileData: { 
    name?: string;
    bio?: string | null;
    email?: string;
    github?: string | null;
    youtube?: string | null;
    linkedin?: string | null;
    discord?: string | null;
    profile_picture?: string | null;
    password?: string; 
  }
) => {
  try {
    // Create a new object to avoid mutation
    const payload: any = { ...profileData };

    // Explicit logging of payload
    console.log('Update Profile Payload:', {
      userId,
      payloadKeys: Object.keys(payload),
      hasPassword: !!payload.password
    });

    // Ensure empty strings are converted to null, except for password
    Object.keys(payload).forEach(key => {
      if (key !== 'password' && payload[key] === '') {
        payload[key] = null;
      }
    });

    // Make the API call
    const response = await api.put(`/users/${userId}`, payload);

    // Log the full response
    console.log('Update Profile Full Response:', response.data);

    return response.data;
  } catch (error: any) {
    // Detailed error logging
    console.error("Detailed Update Error:", {
      errorResponse: error.response?.data,
      errorMessage: error.message,
      errorStatus: error.response?.status
    });

    throw error.response?.data?.message || "อัปเดตโปรไฟล์ล้มเหลว";
  }
};

export default api;