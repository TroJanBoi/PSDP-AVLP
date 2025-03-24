import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { register } from "@/services/api";

interface SignupBtnProps {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  policy: boolean;
  children: React.ReactNode;  // ✅ Allow button text as children
  className?: string;         // ✅ Allow additional styling
  type?: "button" | "submit"; // ✅ Allow setting type
}

const SignupBtn: React.FC<SignupBtnProps> = ({ username, password, confirmPassword, email, policy, children, className, type = "button" }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);  // New state to track loading

  const handleSignUp = async (event?: React.FormEvent) => {
    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
    console.log("Email:", email);
    console.log("Policy Agreed:", policy);
  
    event?.preventDefault();  // ป้องกันการ submit ฟอร์มอัตโนมัติ  
  
    if (!username?.trim() || !password?.trim() || !confirmPassword?.trim() || !email?.trim()) {
      Swal.fire({ icon: "warning", title: "Please fill out all fields" });
      return;
    }
  
    // ✅ เช็คว่ารหัสผ่านต้องมีมากกว่า 6 ตัวอักษร
    if (password.length < 6) {
      Swal.fire({ icon: "warning", title: "Password must be at least 6 characters long" });
      return;
    }
  
    // เช็คว่าผู้ใช้กดยอมรับนโยบายความเป็นส่วนตัวหรือยัง
    if (!policy) {
      Swal.fire({ icon: "warning", title: "Please agree to the privacy policy" });
      return;
    }
  
    // เช็ครหัสผ่านว่าตรงกันหรือไม่
    if (password !== confirmPassword) {
      Swal.fire({ icon: "warning", title: "Passwords do not match" });
      return;
    }
  
    setLoading(true);
  
    // เรียก API สำหรับสมัครสมาชิก
    const data = await register(username, password, email);
  
    setLoading(false);
  
    // ตรวจสอบว่าการสมัครสำเร็จหรือไม่
    if (data?.error) {
      let errorMessage = data.error;
  
      if (data.error.includes("uni_users_email")) {
        errorMessage = "This email is already in use. Please use another email address.";
      } else if (data.error.includes("uni_users_username")) {
        errorMessage = "This username is already taken. Please choose another one.";
      }
  
      Swal.fire({ icon: "error", title: "Register Failed", text: errorMessage });
      return;
    }
  
    // สมัครสำเร็จ
    Swal.fire({ icon: "success", title: "Register success", text: "Please login to continue" })
      .then(() => {
        router.push("/login");
      });
  };
  
  return (
    <button
      onClick={handleSignUp}
      type={type}  // ✅ Ensure the button type is handled
      className={`font-semibold text-lg md:text-xl bg-[#a394f9] text-textbase w-full rounded-md py-3 text-center hover:bg-secondary flex justify-center items-center h-12 ${className}`}
      disabled={loading}  // Disable the button when loading
    >
      {loading ? (
        <span>Loading...</span>  // Show loading text or spinner while processing
      ) : (
        children  // Show button text when not loading
      )}
    </button>
  );
};

export default SignupBtn;
