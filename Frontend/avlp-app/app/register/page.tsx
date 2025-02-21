"use client";

import Link from "next/link";
import BtnSignUp from "./_components/BtnSignUp";
import { User, Mail, Lock } from "lucide-react";
import React, { useState, useEffect } from "react";
import { register } from "@/services/api";
import Swal from "sweetalert2";

interface InputFieldProps {
  type: string;
  name: string;
  placeholder: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ type, name, placeholder, Icon, value, onChange }) => (
  <div className="relative flex justify-center items-center">
    <div className="relative w-3/5 px-4 py-3 text-center">
      <Icon className="absolute top-1/2 transform ml-2 -translate-y-1/2 text-gray-500 w-6 h-6" />
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 py-3 rounded-md bg-white text-primary placeholder-primary text-md xl:text-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-md"
      />
    </div>
  </div>
);

export default function RegisterPage() {

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [policy, setPolicy] = useState<boolean>(false);


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      if (policy === false) {
        Swal.fire({
          icon: "warning",
          title: "Please agree to the privacy policy",
        });
        return;
      }

      if (password !== confirmPassword) {
        Swal.fire({
          icon: "warning",
          title: "Passwords do not match",
        });
        return;
      }
      const data = await register(username, password, email);
      console.log("register success: ", data);

      if (data === undefined) {
        Swal.fire({
          icon: "error",
          title: "Register failed",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Register success",
        text: "Please login to continue",
      }).then(() => {
        window.location.href = "/login";
      });

    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Register failed",
        text: error.response.data.message,
      });
    }
  };

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
      <div className="relative flex w-1/2 mr-auto space-y-3 min-h-screen bg-gray-100 p-14 shadow-lg rounded-r-3xl flex-col justify-center
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
        <form onSubmit={handleSignUp} className="gap-4 justify-center">
          <InputField type="text" name="username" placeholder="Username" Icon={User} value={username} onChange={(e) => setUsername(e.target.value)} />
          <InputField type="password" name="password" placeholder="Password" Icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} />
          <InputField type="password" name="confirmPassword" placeholder="Confirm Password" Icon={Lock} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <InputField type="email" name="email" placeholder="Email" Icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="flex items-center justify-left w-3/5 mx-auto mt-5 mb-">
            <input id="agree" name="policy" onChange={(e) => setPolicy(e.target.checked)} type="checkbox" className="w-4 h-4 text-accent" />
            <label htmlFor="agree" className="ml-2 text-accent cursor-pointer">
              I agree to the <a href="#" className="text-accent font-semibold hover:underline">privacy policy</a>
            </label>
          </div>
          <button className="flex mx-auto justify-center w-3/5 rounded-lg bg-primary py-3 text-lg font-medium text-white shadow-md hover:bg-secondary" type="submit">
            Sign Up
          </button>
        </form>
        <p className="mt-11 text-center text-accent">
          Already have an account? <Link href="/login" className="text-accent font-semibold hover:underline ">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

function then(arg0: () => void) {
  throw new Error("Function not implemented.");
}
