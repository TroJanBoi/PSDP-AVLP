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

  const handleSignUp = async () => {
    if (!policy) {
      Swal.fire({ icon: "warning", title: "Please agree to the privacy policy" });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({ icon: "warning", title: "Passwords do not match" });
      return;
    }
  
    setLoading(true);
  
    const data = await register(username, password, email);
  
    setLoading(false);
  
    if (data?.error) {
      let errorMessage = data.error;
    
      // ตรวจสอบว่าข้อผิดพลาดมาจาก username หรือ email ซ้ำ
      if (data.error.includes("uni_users_email")) {
        errorMessage = "This email is already in use. Please use another email address.";
      } else if (data.error.includes("uni_users_username")) {
        errorMessage = "This username is already taken. Please choose another one.";
      }
    
      Swal.fire({ icon: "error", title: "Register Failed", text: errorMessage });
      return;
    }
    
  
    Swal.fire({ icon: "success", title: "Register success", text: "Please login to continue" })
      .then(() => {
        router.push("/login");
      });
  };
  

  return (
    <button
      onClick={handleSignUp}
      type={type}  // ✅ Ensure the button type is handled
      className={`mt-10 w-full h-8 max-w-sm bg-[#a07cff] text-white py-3 rounded-[8px] hover:bg-purple-700 transition flex items-center justify-center ${className}`}
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
