"use client";

import Link from "next/link";
import { User, Lock } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import Swal from "sweetalert2";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
      
        const res = await signIn("credentials", {
          redirect: false,
          username,
          password,
        });

        console.log("res: ", res);
        console.log("username: ", username);
        console.log("password: ", password);

        if (res?.ok) {
          Swal.fire({
            icon: "success",
            title: "Login success",
            text: "Welcome to AVLP",
          }).then(() => {
            router.push("/homePage");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Login failed",
            text: "Invalid username or password",
          });
        }
      
        setLoading(false);
      };
      

    // กำหนด class ของปุ่มให้เป็นตัวแปรเพื่อให้แน่ใจว่าใช้ style เดียวกันทุกปุ่ม
    const buttonClass = "bg-[#a394f9] text-textbase w-full rounded-md py-3 text-center hover:bg-secondary flex justify-center items-center h-12";

    return (
        <div className="flex justify-center items-center h-screen w-screen bg-primary relative overflow-hidden">
            <div 
                className="absolute inset-0 bg-cover bg-center w-full h-full" 
                style={{ 
                    backgroundImage: 'url("https://img5.pic.in.th/file/secure-sv1/Screenshot-2025-03-15-034500.png")',
                    backgroundPosition: 'center top',
                    zIndex: 0 
                }}>
            </div>
            <div className="relative z-10 flex flex-col justify-center items-center bg-background 
                w-full sm:w-4/5 md:w-3/5 lg:w-1/2 max-w-[1180px] 
                sm:h-auto md:h-auto lg:h-full 
                sm:py-8 md:py-8
                sm:mx-auto md:mx-auto 
                sm:rounded-3xl md:rounded-3xl lg:rounded-l-3xl
                drop-shadow-lg gap-5
                md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2
                lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2">

                
               
                
                {/* Form Content */}
                <div className="flex flex-col gap-3 justify-center items-center w-full sm:w-3/4 md:w-3/4 lg:w-3/4 mt-4">
                    {/* Line 1 - Adjusted to match button width */}
                    <div className="w-4/5 sm:w-3/4 md:w-3/4 lg:w-3/4 px-4">
                        <div className="border-b-2 w-full text-center border-primary">
                            <h1 className="text-2xl font-bold text-[#2e3136]">Sign In</h1>
                        </div>
                    </div>
                    
                    {/* Login Form - Now using same width as social buttons container */}
                    <div className="w-4/5 sm:w-3/4 md:w-3/4 lg:w-3/4 mt-2 bg-background p-4 pt-2 rounded-lg">
                        <form onSubmit={handleSubmit} method="POST" className="flex flex-col gap-2">
                            {/* Reduced gap from gap-3 to gap-2 */}
                            {/* Username Input */}
                            <div className="flex items-center text-xl bg-[#dddddd] shadow-md border border-transparent transition-all duration-200 hover:border-primary text-primary px-4 py-2 rounded-lg w-full">
                                <User className="mr-2 w-6 h-6 text-primary" />
                                <input 
                                    type="text" 
                                    placeholder="Username" 
                                    value={username} 
                                    className="bg-[#dddddd] outline-none text-primary w-full h-8" 
                                    onChange={(e) => setUsername(e.target.value)} 
                                />
                            </div>
                            
                            {/* Password Input */}
                            <div className="w-full mt-1">
                                {/* Reduced mt-2 to mt-1 */}
                                <div className="flex items-center text-xl bg-[#dddddd] shadow-md border border-transparent transition-all duration-200 hover:border-primary text-white px-4 py-2 rounded-lg w-full">
                                    <Lock className="mr-2 w-6 h-6 text-primary" />
                                    <input 
                                        type="password" 
                                        placeholder="Password" 
                                        value={password} 
                                        className="bg-[#dddddd] outline-none text-primary w-full h-8" 
                                        onChange={(e) => setPassword(e.target.value)} 
                                    />
                                </div>
                                
                                {/* Remember Me & Forgot Password - Reduced margin */}
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2 mb-1 text-base md:text-lg">
                                    {/* Changed mt-4 to mt-2 and added mb-1 */}
                                    <label className="flex items-center text-gray-500 mb-2 md:mb-0">
                                        <input 
                                            type="checkbox" 
                                            className="mr-3" 
                                            style={{ 
                                                accentColor: '#a894fc',
                                                width: '16px',
                                                height: '16px'
                                            }}
                                        />
                                        <span className="text-[#2e3136] cursor-pointer">remember</span>
                                    </label>
                                    <Link href="login/forgot" className="text-[#2e3136] hover:underline hover:font-semibold">
                                        forgot password?
                                    </Link>
                                </div>
                            </div>

                            {/* Sign In Button - NO margin-top */}
                            <div className="flex flex-col justify-center items-center w-full">
                                {/* Removed margin-top completely */}
                                <button
                                    type="submit"
                                    className={buttonClass}
                                >
                                    <span className="font-semibold text-lg md:text-xl">Sign In</span>
                                </button>
                                {/* Don't have an account - NO margin-top */}
                                <div className="text-base md:text-lg text-[#2e3136] w-full">
                                    {/* Removed margin-top completely */}
                                    <div className="flex flex-col md:flex-row justify-between items-center w-full mt-1">
                                        {/* Added small margin-top here instead */}
                                        <span className="text-center md:text-left mb-1 md:mb-0">
                                            {/* Reduced mb-2 to mb-1 */}
                                            Don't have an account ?
                                        </span>
                                        <Link href={"../signUpPage/"} className="text-center sm:text-right hover:underline hover:font-semibold">
                                            Sign up here!
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}