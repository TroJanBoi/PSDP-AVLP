"use client";

import Link from "next/link";
import { User, Mail, Key, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/api";
import Swal from "sweetalert2";
import SignupBtn from "./_components/signupBtn";

interface InputFieldProps {
  type: React.HTMLInputTypeAttribute;
  name: string;
  placeholder: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePasswordVisibility?: () => void;
  showPasswordButton?: boolean;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  name,
  placeholder,
  Icon,
  value,
  onChange,
  onTogglePasswordVisibility,
  showPasswordButton = false,
  className = "",
}) => (
  <div className="relative w-full">
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#696969] w-5 h-5" />
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full h-8 pl-10 py-3 px-4 bg-[#f0f0f0] rounded-[10px] placeholder-[#696969] focus:outline-none focus:ring-0 ${className}`}
    />

    {showPasswordButton && (
      <button
        type="button"
        onClick={onTogglePasswordVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#696969] w-5 h-5"
      >
        {type === "password" ? <EyeOff /> : <Eye />}
      </button>
    )}
  </div>
);

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
  const [policy, setPolicy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [passwordError, setPasswordError] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!policy) {
      Swal.fire({ icon: "warning", title: "Please agree to the privacy policy" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError(true);
      Swal.fire({ icon: "warning", title: "Passwords do not match" });
      return;
    } else {
      setPasswordError(false);
    }

    const { username, password, email } = formData;
    const data = await register(username, password, email);

    if (!data) {
      Swal.fire({ icon: "error", title: "Register failed" });
      return;
    }

    Swal.fire({ icon: "success", title: "Register success", text: "Please login to continue" }).then(() => {
      router.push("/login");
    });
  };

  return (
    <div
      className="flex h-screen w-screen bg-cover bg-center bg-opacity-60"
      style={{ backgroundImage: "url('https://i.postimg.cc/qBcGFBv4/man2new.jpg')" }}
    >
      {/* Left side - Image with transparency */}
      <div className="w-1/2 bg-cover bg-center hidden md:block bg-opacity-60"></div>

      {/* Right side - Form with background */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10 bg-white rounded-l-[40px] shadow-3xl overflow-hidden shadow-lg">
        <div className="text-center mb-6">
          <img
            src="https://i.postimg.cc/LsBzbNmv/image-2025-03-16-034214396.png"
            alt="Logo"
            className="h-[120px] w-[120px] rounded-[35px] mx-auto mb-1 shadow-lg object-cover max-w-full max-h-full"
          />
        </div>

        <form onSubmit={handleSignUp} className="w-full max-w-sm space-y-7">
          <h2 className="font-bold text-black border-b border-black w-full text-center mb-10">Sign Up</h2>

          <InputField
            type="text"
            name="username"
            placeholder="Username"
            Icon={User}
            value={formData.username}
            onChange={handleInputChange}
          />

          <InputField
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            Icon={Key}
            value={formData.password}
            onChange={handleInputChange}
            showPasswordButton
            onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
          />

          <InputField
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            Icon={Key}
            value={formData.confirmPassword}
            onChange={(e) => {
              handleInputChange(e);
              setPasswordError(formData.password !== e.target.value);
            }}
            showPasswordButton
            onTogglePasswordVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
            className={passwordError ? "border-2 border-red-500" : ""}
          />

          <InputField
            type="email"
            name="email"
            placeholder="Email"
            Icon={Mail}
            value={formData.email}
            onChange={handleInputChange}
          />
          
          {/* Privacy Policy Checkbox */}
          <div className="flex items-center mt-10">
            <input
              id="agree"
              type="checkbox"
              checked={policy}
              onChange={() => setPolicy(!policy)}
              className="mr-2 w-3 h-3 appearance-none border-2 bg-[#f0f0f0] rounded-sm checked:bg-[#696969] checked:border-[#f0f0f0] focus:ring-0 cursor-pointer"
            />
            <label htmlFor="agree" className="text-primary text-xs font-semibold">
              I agree to the{" "}
              <a href="#" className="text-primary underline">
                privacy policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <SignupBtn
            username={formData.username}
            password={formData.password}
            confirmPassword={formData.confirmPassword}
            email={formData.email}
            policy={policy}
            type="submit"
            className="mt-10 w-full h-8 max-w-sm bg-[#a07cff] text-white py-3 rounded-[8px] hover:bg-purple-700 transition flex items-center justify-center"
          >
            Sign Up
          </SignupBtn>

          <p className="mt-10 text-primary font-semibold">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
