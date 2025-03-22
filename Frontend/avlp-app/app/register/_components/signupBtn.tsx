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
    // Check if any required field is empty or contains only whitespace
    if (!username.trim() || !password.trim() || !confirmPassword.trim() || !email.trim()) {
      Swal.fire({ icon: "warning", title: "Please fill out all fields" });
      return;  // Stop the function if any field is empty
    }
  
    // Check if the user agrees to the privacy policy
    if (!policy) {
      Swal.fire({ icon: "warning", title: "Please agree to the privacy policy" });
      return;  // Stop the function if policy is not agreed
    }
  
    // Check if passwords match
    if (password !== confirmPassword) {
      Swal.fire({ icon: "warning", title: "Passwords do not match" });
      return;  // Stop the function if passwords don't match
    }
  
    setLoading(true);
  
    // Make the API call to register the user
    const data = await register(username, password, email);
  
    setLoading(false);
  
    // Check if the registration was successful
    if (data?.error) {
      let errorMessage = data.error;
  
      // Check if the error is related to duplicate email or username
      if (data.error.includes("uni_users_email")) {
        errorMessage = "This email is already in use. Please use another email address.";
      } else if (data.error.includes("uni_users_username")) {
        errorMessage = "This username is already taken. Please choose another one.";
      }
  
      Swal.fire({ icon: "error", title: "Register Failed", text: errorMessage });
      return;  // Stop the function if registration fails
    }
  
    // If registration is successful
    Swal.fire({ icon: "success", title: "Register success", text: "Please login to continue" })
      .then(() => {
        router.push("/login");
      });
  };  
  
  
  

  return (
    <button
      onClick={handleSignUp}
      type={type}  // ✅ Ensure the button type is handled
      className={`mt-10 w-full h-8 max-w-md bg-[#a07cff] text-white py-3 rounded-[8px] hover:bg-purple-700 transition flex items-center justify-center ${className}`}
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
