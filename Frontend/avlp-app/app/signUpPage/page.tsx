"use client";

import Link from "next/link";
import { User, Mail, Key, Eye, EyeOff, Lock } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/api";
import Swal from "sweetalert2";
import SignupBtn from "./_components/signupBtn";
import { useEffect } from "react";

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
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 mr-2 w-6 h-6 text-primary" />
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`pl-12 placeholder-black flex items-center text-xl bg-[#dddddd] shadow-md border transition-all duration-200 hover:border-primary text-primary px-4 py-2 rounded-lg w-full ${className}`}
    />
    {showPasswordButton && (
      <button
        type="button"
        onClick={onTogglePasswordVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5"
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

  useEffect(() => {
    console.log('Password error state:', passwordError);
    setPasswordError(formData.confirmPassword !== "" && formData.password !== formData.confirmPassword);
  }, [formData.confirmPassword, formData.password]);

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
    <div className="flex h-screen w-screen">
      {/* PC Layout */}
      <div className="hidden xl:flex h-full w-full relative">
        {/* Background Image */}
        <div 
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://i.postimg.cc/qBcGFBv4/man2new.jpg')", backgroundSize: 'cover', backgroundPosition: 'center'}}
        ></div>
  
        {/* Form */}
        <div className="relative z-10 flex flex-col justify-center items-center bg-background w-full sm:w-4/5 md:w-3/5 lg:w-1/2 max-w-[1180px] sm:h-auto md:h-auto lg:h-full sm:py-8 md:py-8 sm:mx-auto md:mx-auto sm:rounded-l-3xl md:rounded-l-3xl lg:rounded-l-3xl drop-shadow-lg gap-5 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2">
          <div className="mb-4 lg:mb-0 mt-6">
            <img 
              src="https://i.postimg.cc/LsBzbNmv/image-2025-03-16-034214396.png" 
              alt="Logo" 
              className="rounded-3xl bg-secondary w-32 h-32 flex justify-center items-center shadow-lg" 
              style={{ 
                boxShadow: '0 0 20px 5px rgba(43, 255, 0, 0.7), 0 0 30px 10px rgba(255, 255, 255, 0.5)', 
                filter: 'drop-shadow(0 0 10px rgba(163, 148, 249, 0.5))', 
                position: 'relative' 
              }} 
            />
          </div>
  
          <form onSubmit={handleSignUp} className="w-full max-w-sm space-y-3">
            <h2 className="text-2xl font-bold text-[#2e3136] border-b-2 w-full text-center border-primary mt-4 mb-7">Sign Up</h2>
            <InputField type="text" name="username" placeholder="Username" Icon={User} value={formData.username} onChange={handleInputChange} />
            <InputField type={showPassword ? "text" : "password"} name="password" placeholder="Password" Icon={Lock} value={formData.password} onChange={handleInputChange} showPasswordButton onTogglePasswordVisibility={() => setShowPassword(!showPassword)} />
            <InputField type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" Icon={Lock} value={formData.confirmPassword} onChange={handleInputChange} showPasswordButton onTogglePasswordVisibility={() => setShowConfirmPassword(!showConfirmPassword)} className={passwordError ? "border-2 border-red-500" : "border-2 border-transparent"} />
            <InputField type="email" name="email" placeholder="Email" Icon={Mail} value={formData.email} onChange={handleInputChange} />
            <div className="flex justify-center items-center mt-10">
              <input id="agree" type="checkbox" checked={policy} onChange={() => setPolicy(!policy)} className="mr-2" />
              <label htmlFor="agree" className="text-primary">I agree to the <a href="#" className="text-center sm:text-right hover:underline hover:font-semibold">privacy policy</a></label>
            </div>
            <SignupBtn username={formData.username} password={formData.password} confirmPassword={formData.confirmPassword} email={formData.email} policy={policy} type="submit">Sign Up</SignupBtn>
            <p className="mt-10 text-primary text-center">Already have an account? <Link href="/login" className="text-center sm:text-right hover:underline hover:font-semibold">Sign In</Link></p>
          </form>
        </div>
      </div>
  
      {/* iPad Layout */}
      <div className="xl:hidden flex justify-center items-center w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://i.postimg.cc/qBcGFBv4/man2new.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="bg-white p-6 rounded-3xl shadow-lg w-11/12 max-w-md">
          <div className="text-center mb-7">
            <img src="https://i.postimg.cc/LsBzbNmv/image-2025-03-16-034214396.png" alt="Logo" className="rounded-3xl bg-secondary w-32 h-32 flex justify-center items-center mx-auto shadow-lg" style={{ boxShadow: '0 0 20px 5px rgba(43, 255, 0, 0.7), 0 0 30px 10px rgba(255, 255, 255, 0.5)', filter: 'drop-shadow(0 0 10px rgba(163, 148, 249, 0.5))', position: 'relative' }} />
          </div>
          <form onSubmit={handleSignUp} className="space-y-3">
            <h2 className="text-2xl font-bold text-[#2e3136] border-b-2 w-full text-center border-primary mt-4 mb-7">Sign Up</h2>
            <InputField type="text" name="username" placeholder="Username" Icon={User} value={formData.username} onChange={handleInputChange} />
            <InputField type={showPassword ? "text" : "password"} name="password" placeholder="Password" Icon={Lock} value={formData.password} onChange={handleInputChange} showPasswordButton onTogglePasswordVisibility={() => setShowPassword(!showPassword)} />
            <InputField type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" Icon={Lock} value={formData.confirmPassword} onChange={handleInputChange} showPasswordButton onTogglePasswordVisibility={() => setShowConfirmPassword(!showConfirmPassword)} className={passwordError ? "border-2 border-red-500" : "border-2 border-transparent"} />
            <InputField type="email" name="email" placeholder="Email" Icon={Mail} value={formData.email} onChange={handleInputChange} />
            <div className="flex justify-center items-center mt-10">
              <input id="agree" type="checkbox" checked={policy} onChange={() => setPolicy(!policy)} className="mr-2" />
              <label htmlFor="agree" className="text-primary">I agree to the <a href="#" className="text-center sm:text-right hover:underline hover:font-semibold">privacy policy</a></label>
            </div>
            <SignupBtn username={formData.username} password={formData.password} confirmPassword={formData.confirmPassword} email={formData.email} policy={policy} type="submit">Sign Up</SignupBtn>
            <p className="mt-10 text-primary text-center">Already have an account? <Link href="/login" className="text-center sm:text-right hover:underline hover:font-semibold">Sign In</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
  
}
