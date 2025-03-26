// services/api.ts
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9898";

console.log("✅ API base URL:", API);

const fetcher = async (url: string, options?: RequestInit) => {
  const fullUrl = `${API}${url}`;
  try {
    console.log("🌐 Requesting:", fullUrl);
    const res = await fetch(fullUrl, options);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("❌ API Error Response:", errorData);
      throw new Error(errorData.message || `Request failed: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("❌ Fetcher error:", error);
    throw error;
  }
};

// 🧠 Auth APIs
export const login = async (username: string, password: string) => {
  return await fetcher("/users/login", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
};

export const register = async (username: string, password: string, email: string) => {
  return await fetcher("/users", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email })
  });
};

export const forgotPassword = async (username: string) => {
  return await fetcher("/users/forgot-password", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
};

export const verifyCode = async (email: string, code: string) => {
  try {
    await fetcher("/users/reset-password", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, new_password: "temporary_verification_password", code })
    });
    return true;
  } catch (error: any) {
    if (error.message.includes("401")) return false;
    throw new Error("เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ระหว่างการตรวจสอบ OTP กรุณาลองใหม่อีกครั้ง");
  }
};

export const resetPassword = async (email: string, password: string, code: string) => {
  return await fetcher("/users/reset-password", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, new_password: password, code })
  });
};

// 📚 Class APIs
export const getAllClass = async () => {
  return await fetcher("/classes");
};

export const getClassById = async (classId: string | number) => {
  return await fetcher(`/classes/${classId}`);
};

export const getOwnedClasses = async (token: string) => {
  return await fetcher("/classes/owned", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 🧩 Problems
export const getProblemsByClassId = async (classId: string, token: string) => {
  return await fetcher(`/api/classes/${classId}/problem`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createProblemAttempt = async (problemId: number, userId: number) => {
  const startedAt = new Date().toISOString();
  const body = {
    problem_id: problemId,
    started_at: startedAt,
    user_id: userId,
  };

  return await fetcher(`/api/problem_attempt/${problemId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};
