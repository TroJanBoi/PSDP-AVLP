"use client";

import Link from "next/link";
import { User, Lock } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";

import Swal from "sweetalert2";

export default function LoginPage() {
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
            window.location.href = "/homePage";
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
        <div className="flex h-screen w-screen">
            {/* PC Layout */}
            <div className="hidden xl:flex h-full w-full relative">
                {/* Background Image */}
                <div 
                    className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{ 
                        backgroundImage: 'url("https://img5.pic.in.th/file/secure-sv1/Screenshot-2025-03-15-034500.png")', 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center top'
                    }}
                ></div>
                
                {/* Form */}
                <div className="relative z-10 flex flex-col justify-center items-center bg-background 
                    w-full sm:w-4/5 md:w-3/5 lg:w-1/2 max-w-[1180px] 
                    sm:h-auto md:h-auto lg:h-full 
                    sm:py-8 md:py-8
                    sm:mx-auto md:mx-auto 
                    sm:rounded-l-3xl md:rounded-l-3xl lg:rounded-l-3xl
                    drop-shadow-lg gap-5
                    md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2
                    lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2">

                    {/* Logo */}
                    <div className="mb-4 lg:mb-0 mt-6">
                        <div className="rounded-3xl bg-secondary w-32 h-32 flex justify-center items-center shadow-lg" 
                            style={{ 
                                boxShadow: '0 0 20px 5px rgba(43, 255, 0, 0.7), 0 0 30px 10px rgba(255, 255, 255, 0.5)',
                                filter: 'drop-shadow(0 0 10px rgba(163, 148, 249, 0.5))',
                                position: 'relative'
                            }}>
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white to-transparent opacity-20"></div>
                            <h1 className="text-textbase font-bold text-2xl relative z-10">LOGO</h1>
                        </div>
                    </div>
                    
                    {/* Form Content */}
                    <form onSubmit={handleSubmit} method="POST" className="w-full max-w-sm space-y-3">
                        <h2 className="text-2xl font-bold text-[#2e3136] border-b-2 w-full text-center border-primary mt-4 mb-7">Sign In</h2>
                        
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
                        
                        {/* Remember Me & Forgot Password */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2 mb-1 text-base md:text-lg">
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

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            className={buttonClass}
                        >
                            <span className="font-semibold text-lg md:text-xl">Sign In</span>
                        </button>
                        
                        {/* Don't have an account - MODIFIED */}
                        <div className="mt-5 flex justify-between text-[#2e3136] text-base md:text-lg">
                            <span>Don't have an account?</span>
                            <Link href="../signUpPage/" className="hover:underline hover:font-semibold">Sign up here!</Link>
                        </div>
                        
                        {/* Social Login Divider */}
                        <div className="w-full mt-4">
                            <div className="w-full border-b-2 border-primary mb-1"></div>
                        </div>
                        
                        {/* Social Login Buttons */}
                        <div className="space-y-2 mt-2">
                            {/* Google Login */}
                            <button type="button" className={buttonClass}>
                                <div className="flex font-semibold items-center justify-center gap-2 text-lg md:text-xl">
                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                        <path d="M6 12.5C5.99856 13.9165 6.49829 15.2877 7.41074 16.3712C8.32318 17.4546 9.58951 18.1802 10.9856 18.4197C12.3816 18.6592 13.8174 18.397 15.0388 17.6797C16.2601 16.9623 17.1883 15.836 17.659 14.5H12V10.5H21.805V14.5H21.8C20.873 19.064 16.838 22.5 12 22.5C6.477 22.5 2 18.023 2 12.5C2 6.977 6.477 2.5 12 2.5C13.6345 2.49884 15.2444 2.89875 16.6883 3.66467C18.1323 4.43058 19.3662 5.5391 20.282 6.893L17.004 9.188C16.2924 8.11241 15.2532 7.29473 14.0404 6.85617C12.8275 6.4176 11.5057 6.38149 10.2707 6.75319C9.03579 7.12488 7.95347 7.88461 7.18421 8.91974C6.41495 9.95487 5.9997 11.2103 6 12.5Z" fill="#EEEEEE" />
                                    </svg>
                                    <span>Continue with Google</span>
                                </div>
                            </button>
                            
                            {/* Github Login */}
                            <button type="button" className={buttonClass}>
                                <div className="flex font-semibold items-center justify-center gap-2 text-lg md:text-xl">
                                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                        <path d="M10 0.5C8.68678 0.5 7.38642 0.758658 6.17317 1.2612C4.95991 1.76375 3.85752 2.50035 2.92893 3.42893C1.05357 5.3043 0 7.84784 0 10.5C0 14.92 2.87 18.67 6.84 20C7.34 20.08 7.5 19.77 7.5 19.5V17.81C4.73 18.41 4.14 16.47 4.14 16.47C3.68 15.31 3.03 15 3.03 15C2.12 14.38 3.1 14.4 3.1 14.4C4.1 14.47 4.63 15.43 4.63 15.43C5.5 16.95 6.97 16.5 7.54 16.26C7.63 15.61 7.89 15.17 8.17 14.92C5.95 14.67 3.62 13.81 3.62 10C3.62 8.89 4 8 4.65 7.29C4.55 7.04 4.2 6 4.75 4.65C4.75 4.65 5.59 4.38 7.5 5.67C8.29 5.45 9.15 5.34 10 5.34C10.85 5.34 11.71 5.45 12.5 5.67C14.41 4.38 15.25 4.65 15.25 4.65C15.8 6 15.45 7.04 15.35 7.29C16 8 16.38 8.89 16.38 10C16.38 13.82 14.04 14.66 11.81 14.91C12.17 15.22 12.5 15.83 12.5 16.76V19.5C12.5 19.77 12.66 20.09 13.17 20C17.14 18.66 20 14.92 20 10.5C20 9.18678 19.7413 7.88642 19.2388 6.67317C18.7362 5.45991 17.9997 4.35752 17.0711 3.42893C15.1957 2.30357 12.6522 1.5 10 1.5Z" fill="#EEEEEE" />
                                    </svg>
                                    <span>Continue with Github</span>
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            {/* iPad/Mobile Layout */}
            <div className="xl:hidden flex justify-center items-center w-full h-full bg-cover bg-center" 
                style={{ 
                    backgroundImage: 'url("https://img5.pic.in.th/file/secure-sv1/Screenshot-2025-03-15-034500.png")', 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center top'
                }}>
                <div className="bg-white p-6 rounded-3xl shadow-lg w-11/12 max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-7">
                        <div className="rounded-3xl bg-secondary w-32 h-32 flex justify-center items-center shadow-lg mx-auto" 
                            style={{ 
                                boxShadow: '0 0 20px 5px rgba(43, 255, 0, 0.7), 0 0 30px 10px rgba(255, 255, 255, 0.5)',
                                filter: 'drop-shadow(0 0 10px rgba(163, 148, 249, 0.5))',
                                position: 'relative'
                            }}>
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white to-transparent opacity-20"></div>
                            <h1 className="text-textbase font-bold text-2xl relative z-10">LOGO</h1>
                        </div>
                    </div>
                    
                    {/* Form */}
                    <form onSubmit={handleSubmit} method="POST" className="space-y-3">
                        <h2 className="text-2xl font-bold text-[#2e3136] border-b-2 w-full text-center border-primary mt-4 mb-7">Sign In</h2>
                        
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
                        
                        {/* Remember Me & Forgot Password */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 mb-1 text-base">
                            <label className="flex items-center text-gray-500 mb-2 sm:mb-0">
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

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            className={buttonClass}
                        >
                            <span className="font-semibold text-lg">Sign In</span>
                        </button>
                        
                        {/* Don't have an account - MODIFIED */}
                        <div className="mt-5 flex justify-between text-[#2e3136] text-base sm:text-base">
                            <span>Don't have an account?</span>
                            <Link href="../signUpPage/" className="hover:underline hover:font-semibold">Sign up here!</Link>
                        </div>
                        
                        {/* Social Login Divider */}
                        <div className="w-full px-4 mt-4">
                            <div className="w-full border-b-2 border-primary mb-1"></div>
                        </div>
                        
                        {/* Social Login Buttons */}
                        <div className="space-y-2 mt-2">
                            {/* Google Login */}
                            <button type="button" className={buttonClass}>
                                <div className="flex font-semibold items-center justify-center gap-2 text-lg">
                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                        <path d="M6 12.5C5.99856 13.9165 6.49829 15.2877 7.41074 16.3712C8.32318 17.4546 9.58951 18.1802 10.9856 18.4197C12.3816 18.6592 13.8174 18.397 15.0388 17.6797C16.2601 16.9623 17.1883 15.836 17.659 14.5H12V10.5H21.805V14.5H21.8C20.873 19.064 16.838 22.5 12 22.5C6.477 22.5 2 18.023 2 12.5C2 6.977 6.477 2.5 12 2.5C13.6345 2.49884 15.2444 2.89875 16.6883 3.66467C18.1323 4.43058 19.3662 5.5391 20.282 6.893L17.004 9.188C16.2924 8.11241 15.2532 7.29473 14.0404 6.85617C12.8275 6.4176 11.5057 6.38149 10.2707 6.75319C9.03579 7.12488 7.95347 7.88461 7.18421 8.91974C6.41495 9.95487 5.9997 11.2103 6 12.5Z" fill="#EEEEEE" />
                                    </svg>
                                    <span>Continue with Google</span>
                                </div>
                            </button>
                            
                            {/* Github Login */}
                            <button type="button" className={buttonClass}>
                                <div className="flex font-semibold items-center justify-center gap-2 text-lg">
                                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                        <path d="M10 0.5C8.68678 0.5 7.38642 0.758658 6.17317 1.2612C4.95991 1.76375 3.85752 2.50035 2.92893 3.42893C1.05357 5.3043 0 7.84784 0 10.5C0 14.92 2.87 18.67 6.84 20C7.34 20.08 7.5 19.77 7.5 19.5V17.81C4.73 18.41 4.14 16.47 4.14 16.47C3.68 15.31 3.03 15 3.03 15C2.12 14.38 3.1 14.4 3.1 14.4C4.1 14.47 4.63 15.43 4.63 15.43C5.5 16.95 6.97 16.5 7.54 16.26C7.63 15.61 7.89 15.17 8.17 14.92C5.95 14.67 3.62 13.81 3.62 10C3.62 8.89 4 8 4.65 7.29C4.55 7.04 4.2 6 4.75 4.65C4.75 4.65 5.59 4.38 7.5 5.67C8.29 5.45 9.15 5.34 10 5.34C10.85 5.34 11.71 5.45 12.5 5.67C14.41 4.38 15.25 4.65 15.25 4.65C15.8 6 15.45 7.04 15.35 7.29C16 8 16.38 8.89 16.38 10C16.38 13.82 14.04 14.66 11.81 14.91C12.17 15.22 12.5 15.83 12.5 16.76V19.5C12.5 19.77 12.66 20.09 13.17 20C17.14 18.66 20 14.92 20 10.5C20 9.18678 19.7413 7.88642 19.2388 6.67317C18.7362 5.45991 17.9997 4.35752 17.0711 3.42893C15.1957 2.30357 12.6522 1.5 10 1.5Z" fill="#EEEEEE" />
                                    </svg>
                                    <span>Continue with Github</span>
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}