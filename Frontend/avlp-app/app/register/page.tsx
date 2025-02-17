import Link from "next/link";
import BtnSignUp from "./_components/BtnSignUp";
import { User, Mail, Lock } from "lucide-react";
export default function RegisterPage() {
  return (
    <div className="flex justify-start items-center w-screen h-screen bg-primary ">
      <div className="relative w-3/5 mr-auto space-y-6 min-h-screen bg-gray-100 p-14 shadow-lg rounded-r-3xl flex flex-col justify-center">
        <div className="flex justify-center">
          <div className="relative flex flex-col justify-center h-40 w-40 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold">
            Logo
          </div>
        </div>
        <div className="mx-auto text-center border-b-2 border-primary w-3/4">
          <h2 className="text-3xl text-center font-bold text-accent py-3">
            Sign Up
          </h2>
        </div>
        <div className="space-y-4 justify-center">
          {/* Username Input */}
          <div className="relative flex justify-center">
            <div className="relative w-3/5">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full pl-10 pr-4 py-2 rounded-md bg-primary text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          {/* Password Input */}
          <div className="relative flex justify-center">
            <div className="relative w-3/5">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2 rounded-md bg-primary text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          {/* Confirm Password */}
          <div className="relative flex justify-center">
            <div className="relative w-3/5">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full pl-10 pr-4 py-2 rounded-md bg-primary text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          {/* Email Input */}
          <div className="relative flex justify-center">
            <div className="relative w-3/5">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full pl-10 pr-4 py-2 rounded-md bg-primary text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          {/* Checkbox */}
          <div className="flex items-center justify-left w-3/5 mx-auto">
            <input id="agree" type="checkbox" className="w-4 h-4 text-primary" />
            <label htmlFor="agree" className="ml-2 text-gray-600 cursor-pointer">
              I agree to the{" "}
              <a href="#" className="text-primary underline">
                privacy policy
              </a>
            </label>
          </div>
          {/* Sign Up Button */}
          <button className="flex mx-auto justify-center w-3/5 rounded-lg bg-primary py-3 text-lg font-medium text-white shadow-md hover:bg-primary-dark">
            Sign Up
          </button>
        </div>
        <p className="mt-11 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}