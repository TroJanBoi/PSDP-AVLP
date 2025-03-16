"use client";

import Link from "next/link";
import { User, Mail, Lock, Key, Eye, EyeOff } from "lucide-react";
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
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  hasToggle?: boolean;
  isVisible?: boolean;
  toggleVisibility?: () => void;
  isInvalid?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  name,
  placeholder,
  Icon,
  value,
  onChange,
  hasToggle = false,
  isVisible = false,
  toggleVisibility,
  isInvalid = false
}) => (
  <div className="relative w-full">
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#696969] w-5 h-5" />
    <input
      type={isVisible ? "text" : type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full h-8 pl-10 pr-10 py-3 px-4 bg-[#f0f0f0] rounded-[10px] placeholder-[#696969] focus:outline-none focus:ring-0 ${
        isInvalid ? "border border-red-500" : ""
      }`}
    />
    {hasToggle && (
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#696969]"
      >
        {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    )}
  </div>
);

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [policy, setPolicy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const passwordsMatch = password === confirmPassword || confirmPassword === "";

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!policy) {
      Swal.fire({ icon: "warning", title: "Please agree to the privacy policy" });
      return;
    }
    if (!passwordsMatch) {
      Swal.fire({ icon: "warning", title: "Passwords do not match" });
      return;
    }
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <InputField
            type="password"
            name="password"
            placeholder="Password"
            Icon={Key}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            hasToggle
            isVisible={showPassword}
            toggleVisibility={() => setShowPassword(!showPassword)}
          />

          <InputField
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            Icon={Key}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            hasToggle
            isVisible={showConfirmPassword}
            toggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
            isInvalid={!passwordsMatch}
          />

          <InputField
            type="email"
            name="email"
            placeholder="Email"
            Icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </form>

        <div className="flex items-center mt-10">
          <input
            id="agree"
            type="checkbox"
            checked={policy}
            onChange={(e) => setPolicy(e.target.checked)}
            className="mr-2 w-3 h-3 appearance-none border-2 bg-[#f0f0f0] rounded-sm checked:bg-[#696969] checked:border-[#f0f0f0] focus:ring-0 cursor-pointer"
          />
          <label htmlFor="agree" className="text-primary text-xs font-semibold">
            I agree to the <a href="#" className="text-primary underline">privacy policy</a>
          </label>
        </div>

        <SignupBtn
          username={username}
          password={password}
          confirmPassword={confirmPassword}
          email={email}
          policy={policy}
          type="submit"
          className="mt-10 w-full h-8 max-w-sm bg-[#a07cff] text-white py-3 rounded-[8px] hover:bg-purple-700 transition flex items-center justify-center"
        >
          Sign Up
        </SignupBtn>

        <p className="mt-10 text-primary font-semibold">
          Already Have an Account? <Link href="/login" className="text-primary underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
