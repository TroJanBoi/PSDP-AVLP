"use client";

import { forgotPassword, resetPassword } from "@/services/api";
import { User, Lock, Code, ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ForgotPasswordPage() {
    const [username, setUsername] = useState<string>(''); // ชื่อผู้ใช้
    const [code, setCode] = useState<string>(''); // รหัสยืนยันจาก mail
    const [password, setPassword] = useState<string>('');  // รหัสผ่านใหม่
    const [confirmPassword, setConfirmPassword] = useState<string>(''); // ยืนยันรหัสผ่านใหม่
    const [email, setEmail] = useState<string>(''); // อีเมลของผู้ใช้
    const [status, setStatus] = useState<boolean>(false); // เช็คสถานะว่ามีการส่งรหัสไปหรือยัง
    const [isDisabled, setIsDisabled] = useState<boolean>(false);  // ปุ่มส่งรหัสใหม่
    const [timeleft, setTimeleft] = useState<string>("03:20"); // เวลาที่เหลือสำหรับรหัสยืนยันตั้งไว้ 3 นาที 20 วิ
    const [countdown, setCountdown] = useState<number | null>(null); // ตัวจับเวลา Countdown
    const [step, setStep] = useState<number>(1); // แบ่งให้มันเป็น 3 ขั้นตอน 1.หน้ากรอก username 2.หน้า ใส่รหัสยืนยัน 3.ตั้งรหัสใหม่

    useEffect(() => {
        if (countdown !== null) {
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev !== null && prev > 0) {
                        updateTimer(prev - 1);
                        return prev - 1;
                    } else {
                        clearInterval(interval);
                        setIsDisabled(false);
                        setCountdown(null);
                        setStatus(false);
                        return null;
                    }
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [countdown]);

    // นับเวลาถอยหลังรูปแบบ mm:ss
    const updateTimer = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        setTimeleft(`${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`);
    };
    
    // ส่งอีเมลขอรหัสยืนยัน
    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isDisabled) {
            return;
        }
        
        try {
            const data = await forgotPassword(username); // เรียก API เพื่อขอรหัสยืนยัน
            if (!data) {
                Swal.fire({
                    icon: "error",
                    title: "Username not found",
                    text: "Please check your username",
                });
                return;
            }
            
            setEmail(data.email); // เก็บอีเมลของผู้ใช้
            console.log("Verification code sent to email"); 
            setStatus(true); // ตั้งสถานะให้รู้ว่ามีการส่งรหัสแล้ว
            setIsDisabled(true); // ปิดการกดปุ่มส่งซ้ำชั่วคราว
            setCountdown(200); // ตัวจับเวลาถอยหลัง
            setStep(2); // ถ้ากดปุ่มแล้วเปลี่ยนไปหน้ากรอกรหัสยืนยัน
            
            // แสดงแจ้งเตือน
            Swal.fire({
                icon: "success",
                title: "Verification Code Sent",
                text: `A verification code has been sent to ${data.email}`,
            });
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "Failed to send verification code",
                text: error.response?.data?.message || "Something went wrong",
            });
        }
    };
    
    // ตรวจสอบรหัสยืนยันที่ผู้ใช้ป้อน
    // ตรวจสอบรหัสยืนยันที่ผู้ใช้ป้อน
// ทางเลือกในกรณีไม่สามารถเพิ่ม API endpoint ได้
const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!status || countdown === null || countdown <= 0) {
        Swal.fire({
            icon: "error",
            title: "Code expired",
            text: "Please request a new code",
        });
        setStatus(false);
        return;
    }
    
    try {
        // ใช้ resetPassword โดยส่งรหัสผ่านชั่วคราวที่ไม่สำคัญ
        const tempPassword = "temporary_password_for_verification";
        const result = await resetPassword(email, tempPassword, code);
        if (result) {
            // ถ้าการตรวจสอบสำเร็จ ให้ไปยังหน้า 3
            setStep(3);
            Swal.fire({
                icon: "success",
                title: "Code verified",
                text: "Please set your new password",
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Verification failed",
                text: "Invalid verification code",
            });
        }
    } catch (error: any) {
        Swal.fire({
            icon: "error",
            title: "Verification failed",
            text: error.response?.data?.message || "Invalid verification code",
        });
    }
};

    // ฟังก์ชันรีเซ็ตรหัสผ่านใหม่
const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!status || countdown === null || countdown <= 0) {
        Swal.fire({
            icon: "error",
            title: "Code expired",
            text: "Please request a new code",
        });
        setStatus(false);
        return;
    }
    
    if (password !== confirmPassword) {
        Swal.fire({
            icon: "error",
            title: "Passwords do not match",
        });
        return;
    }
    
    try { 
        // ตอนนี้เราไม่ต้องตรวจสอบ OTP อีกแล้ว เพราะตรวจสอบไปแล้วในขั้นตอนก่อนหน้า
        const result = await resetPassword(email, password, code);
        if (!result) {
            Swal.fire({
                icon: "error",
                title: "Reset password failed",
                text: "Please try again",
            });
            return;
        }
        
        console.log("Password changed successfully");
        Swal.fire({
            icon: "success",
            title: "Password changed",
            text: "Please login to continue",
        }).then(() => {
            window.location.href = "/login"; 
        });
    } catch (error: any) {
        Swal.fire({
            icon: "error",
            title: "Reset password failed",
            text: error.response?.data?.message || "Something went wrong",
        });
    }
};

    // ฟังก์ชันขอรหัสยืนยันใหม่หากไม่ได้รหัส
    const handleResendCode = async () => {
        if (isDisabled) {
            return;
        }
        
        try {
            const data = await forgotPassword(username);
            if (!data) {
                Swal.fire({
                    icon: "error",
                    title: "Username not found",
                    text: "Please check your username",
                });
                return;
            }
            
            setEmail(data.email);
            setStatus(true);
            setIsDisabled(true);
            setCountdown(200); // 3:20 in seconds
            
            Swal.fire({
                icon: "success",
                title: "Verification Code Resent",
                text: `A new verification code has been sent to ${data.email}`,
            });
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "Failed to resend verification code",
                text: error.response?.data?.message || "Something went wrong",
            });
        }
    };

    // สร้างโครงสร้างพื้นฐานของแต่ละหน้าจอ  3 หน้าใช้เหมือนกัน
    const renderPageLayout = (title: string, subtitle: string, formContent: React.ReactNode) => {
        return (
            <div className="flex justify-center items-center min-h-screen w-full bg-white py-4 px-2 sm:px-4 md:py-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col lg:flex-row w-full justify-center items-center">
                        {/* Left Content */}
                        <div className="w-full lg:w-2/5 flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:pr-8">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">{title}</h1>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6">{subtitle}</p>
                            
                            <Link href="/login" className="flex items-center text-blue-500 mb-4 sm:mb-6 w-fit text-sm sm:text-base md:text-lg">
                                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-1" />
                                <span>Back to login</span>
                            </Link>
                            
                            {formContent}
                        </div>
                        
                        {/* Right Image */}
                        <div className="hidden lg:flex lg:w-3/5 justify-center items-center p-4 lg:pl-8">
                            <div className="flex justify-center items-center w-full h-full">
                                <img 
                                    src="https://img5.pic.in.th/file/secure-sv1/computer-security-with-login-password-padlock.jpg" 
                                    alt="computer security with login password padlock" 
                                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ฟังก์ชันสำหรับแสดงหน้ากรอก user name
    const renderEnterUsername = () => {
        const formContent = (
            <form onSubmit={handleSendEmail} className="w-full">
                <div className="mb-4">
                    <label className="block text-base sm:text-lg font-medium text-gray-600 mb-2">Username</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                </div>
                {/* ปุ่มส่งรหัสยืนยัน */}
                <button
                    type="submit"
                    disabled={countdown !== null && countdown > 0}
                    className={`w-full py-3 sm:py-4 rounded-lg font-medium text-base sm:text-lg ${
                        isDisabled 
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                        : "bg-violet-400 text-white hover:bg-violet-500 transition-colors"
                    }`}
                >
                    Send Verification Code
                </button>
            </form>
        );

        return renderPageLayout(
            "Forgot your password?", 
            "Enter your username to receive a verification code.",
            formContent
        );
    };

    // ฟังก์ชันสำหรับแสดงหน้ายืนยันรหัส OTP
    const renderVerifyCode = () => {
        const formContent = (
            <form onSubmit={handleVerifyCode} className="w-full">
                <div className="mb-4">
                    <label className="block text-base sm:text-lg font-medium text-gray-600 mb-2">Username</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg"
                            readOnly
                        />
                        {countdown && countdown > 0 ? (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-100 text-blue-600 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">
                                {`( ${Math.floor(countdown)} sec )`}
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSendEmail}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm hover:bg-blue-600"
                            >
                                Send Otp
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="mb-4">
                    <label className="block text-base sm:text-lg font-medium text-gray-600 mb-2">Verification Code</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Code className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg"
                            placeholder="Enter verification code"
                            required
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm sm:text-base text-gray-600">
                            Time remaining: <span className="font-semibold">{timeleft}</span>
                        </p>
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={isDisabled}
                            className={`text-sm sm:text-base ${
                                isDisabled 
                                ? "text-gray-400 cursor-not-allowed" 
                                : "text-blue-500 hover:text-blue-700"
                            }`}
                        >
                            Resend Code
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 sm:py-4 rounded-lg font-medium text-base sm:text-lg bg-violet-400 text-white hover:bg-violet-500 transition-colors"
                >
                    Verify Code
                </button>
                </form>
       );

       return renderPageLayout(
           "Verification Code",
           "Enter the verification code sent to your email.",
           formContent
       );
   };

   // ฟังก์ชันสำหรับแสดงหน้าตั้งรหัสผ่านใหม่
   // ฟังก์ชันสำหรับแสดงหน้าตั้งรหัสผ่านใหม่
const renderResetPassword = () => {
    const formContent = (
        <form onSubmit={handleResetPassword} className="w-full">
            <div className="mb-4">
                <label className="block text-base sm:text-lg font-medium text-gray-600 mb-2">Verification Code</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Code className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={code}
                        className="w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-3 border border-gray-300 rounded-lg bg-gray-100 text-base sm:text-lg"
                        readOnly
                    />
                </div>
            </div>
            
            <div className="mb-4">
                <label className="block text-base sm:text-lg font-medium text-gray-600 mb-2">New Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400" />
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg"
                        placeholder="Enter new password"
                        required
                    />
                </div>
            </div>
            
            <div className="mb-4">
                <label className="block text-base sm:text-lg font-medium text-gray-600 mb-2">Confirm Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400" />
                    </div>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg"
                        placeholder="Confirm new password"
                        required
                    />
                </div>
            </div>
            <div className="mb-4">
                <div className="flex justify-between items-center">
                    <p className="text-sm sm:text-base text-gray-600">
                        Time remaining: <span className="font-semibold">{timeleft}</span>
                    </p>
                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={isDisabled}
                        className={`text-sm sm:text-base ${
                            isDisabled 
                            ? "text-gray-400 cursor-not-allowed" 
                            : "text-blue-500 hover:text-blue-700"
                        }`}
                    >
                        Resend Code
                    </button>
                </div>
            </div>
            
            <button
                type="submit"
                className="w-full py-3 sm:py-4 rounded-lg font-medium text-base sm:text-lg bg-violet-400 text-white hover:bg-violet-500 transition-colors"
            >
                Reset Password
            </button>
        </form>
    );

    return renderPageLayout(
        "Reset Password",
        "Create a new password for your account.",
        formContent
    );
};
   // เลือกหน้าที่จะแสดงตาม step
   const renderStepContent = () => {
       switch (step) {
           case 1:
               return renderEnterUsername();
           case 2:
               return renderVerifyCode();
           case 3:
               return renderResetPassword();
           default:
               return renderEnterUsername();
       }
   };

   return renderStepContent();
}