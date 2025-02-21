"use client";

import Link from "next/link";
import BtnSignUp from "./_components/BtnSignUp";
import { User, Mail, Lock } from "lucide-react";
import React, { useEffect } from "react";

interface InputFieldProps {
  type: string;
  name: string;
  placeholder: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

const InputField: React.FC<InputFieldProps> = ({ type, name, placeholder, Icon }) => (
  <div className="relative flex justify-center">
    <div className="relative w-3/5">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-md bg-primary text-white focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  </div>
);

export default function RegisterPage() {
  useEffect(() => {
    const updateOrientation = () => {
      if (window.matchMedia("(orientation: portrait)").matches) {
        document.body.classList.add("portrait");
      } else {
        document.body.classList.remove("portrait");
      }
    };
    updateOrientation();
    window.addEventListener("resize", updateOrientation);
    return () => window.removeEventListener("resize", updateOrientation);
  }, []);

  return (
    <div className="flex justify-start items-center w-screen h-screen bg-primary">
      <div className="relative w-1/2 mr-auto space-y-6 min-h-screen bg-gray-100 p-14 shadow-lg rounded-r-3xl flex-col justify-center
                      md:w-1/2 md:rounded-r-3xl
                      portrait:w-full portrait:rounded-none portrait:min-h-screen">
        <div className="flex justify-center">
          <div className="relative flex flex-col justify-center h-40 w-40 rounded-full bg-gray-300 text-lg font-bold items-center">
            Logo
          </div>
        </div>
        <div className="mx-auto text-center border-b-2 border-primary w-3/4">
          <h2 className="text-3xl font-bold text-accent py-3">Sign Up</h2>
        </div>
        <div className="space-y-4 justify-center">
          <InputField type="text" name="username" placeholder="Username" Icon={User} />
          <InputField type="password" name="password" placeholder="Password" Icon={Lock} />
          <InputField type="password" name="confirmPassword" placeholder="Confirm Password" Icon={Lock} />
          <InputField type="email" name="email" placeholder="Email" Icon={Mail} />
          
          <div className="flex items-center justify-left w-3/5 mx-auto">
            <input id="agree" type="checkbox" className="w-4 h-4 text-primary" />
            <label htmlFor="agree" className="ml-2 text-gray-600 cursor-pointer">
              I agree to the <a href="#" className="text-primary underline">privacy policy</a>
            </label>
          </div>
          
          <button className="flex mx-auto justify-center w-3/5 rounded-lg bg-primary py-3 text-lg font-medium text-white shadow-md hover:bg-primary-dark">
            Sign Up
          </button>
        </div>
        <p className="mt-11 text-center text-gray-600">
          Already have an account? <Link href="/login" className="text-primary font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
}