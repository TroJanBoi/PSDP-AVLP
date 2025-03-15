"use client";

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

  const handleSignUp = async () => {
    if (!policy) {
      Swal.fire({ icon: "warning", title: "Please agree to the privacy policy" });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({ icon: "warning", title: "Passwords do not match" });
      return;
    }
    
    const data = await register(username, password, email);
    if (!data) {
      Swal.fire({ icon: "error", title: "Register failed" });
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
    >
      {children}  {/* ✅ Display button text dynamically */}
    </button>
  );
};

export default SignupBtn;
