"use client";

import { forgotPassword, resetPassword } from "@/services/api";
import { User, Lock, Code, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
    
export default function ForgotPasswordPage() {
    const [username, setUsername] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [status, setStatus] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [timeleft, setTimeleft] = useState<string>("03:20");
    const [countdown, setCountdown] = useState<number | null>(null);
    const [step, setStep] = useState<number>(1);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

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

    // ตัวจับเวลาเป็น นาที:วินาที
    const updateTimer = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        setTimeleft(`${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`);
    };
    
    // ส่งรหัสยืนยันไปยังอีเมล
    const handleSendEmail = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (isDisabled) {
            return;
        }
        
        try {
            Swal.fire({
                title: "กำลังส่งรหัสยืนยัน",
                text: "กรุณารอสักครู่...",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            const data = await forgotPassword(username);
            
            Swal.close();
            
            if (!data) {
                Swal.fire({
                    icon: "error",
                    title: "ไม่พบชื่อผู้ใช้",
                    text: "กรุณาตรวจสอบชื่อผู้ใช้ของคุณ",
                });
                return;
            }
            
            setEmail(data.email);
            setStatus(true);
            setIsDisabled(true);
            setCountdown(200);
            setStep(2); // เปลี่ยนไปยังหน้าจอการยืนยันและรีเซ็ตรหัสผ่านแบบรวม
            
            // แสดงการแจ้งเตือนสำเร็จ
            Swal.fire({
                icon: "success",
                title: "ส่งรหัสยืนยันแล้ว",
                text: `รหัสยืนยันได้ถูกส่งไปยัง ${data.email}`,
            });
        } catch (error: any) {
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "ไม่สามารถส่งรหัสยืนยันได้",
                text: error.response?.data?.message || "เกิดข้อผิดพลาดบางอย่าง",
            });
        }
    };
    
    // รีเซ็ตรหัสผ่านด้วยรหัสยืนยัน
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // ตรวจสอบว่ารหัสหมดอายุหรือไม่
        if (!status || countdown === null || countdown <= 0) {
            Swal.fire({
                icon: "error",
                title: "รหัสหมดอายุ",
                text: "กรุณาขอรหัสใหม่",
            });
            setStatus(false);
            return;
        }
        
        // ตรวจสอบว่ามีการใส่รหัสหรือไม่
        if (code.trim() === '') {
            Swal.fire({
                icon: "error",
                title: "รหัสไม่ถูกต้อง",
                text: "กรุณาใส่รหัสยืนยัน",
            });
            return; 
        }
        
        // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
        if (password !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "รหัสผ่านไม่ตรงกัน",
                text: "กรุณาตรวจสอบรหัสผ่านของคุณ",
            });
            return;
        }
        
        // ตรวจสอบความปลอดภัยของรหัสผ่าน
        if (password.length < 6) {
            Swal.fire({
                icon: "error",
                title: "รหัสผ่านไม่ปลอดภัย",
                text: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
            });
            return;
        }
        
        let timerInterval: any;
        try {
            // แสดงตัวบ่งชี้การโหลด
            await Swal.fire({
                title: "กำลังรีเซ็ตรหัสผ่าน",
                html: 'กำลังประมวลผลในอีก <b></b> มิลลิวินาที',
                timer: 2000,
                timerProgressBar: true,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                    const b = Swal.getHtmlContainer()?.querySelector('b');
                    if (b) {
                        timerInterval = setInterval(() => {
                            b.textContent = Swal.getTimerLeft()?.toString() || '';
                        }, 100);
                    }
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            });
            
            // เรียก API เพื่อรีเซ็ตรหัสผ่าน
            const result = await resetPassword(email, password, code);
            
            // แสดงข้อความสำเร็จและเปลี่ยนเส้นทาง
            Swal.fire({
                icon: "success",
                title: "เปลี่ยนรหัสผ่านสำเร็จ",
                text: "กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่ของคุณ",
            }).then(() => {
                window.location.href = "/login"; 
            });
            
        } catch (error: any) {
            console.error("รายละเอียดข้อผิดพลาดการรีเซ็ตรหัสผ่าน:", error);
            
            // แสดงข้อความผิดพลาด
            let errorMessage = "เกิดข้อผิดพลาดกับการรีเซ็ตรหัสผ่าน";
            
            if (error.message) {
                errorMessage = error.message;
            } else if (error.details?.error) {
                errorMessage = error.details.error;
            }
            
            Swal.fire({
                icon: "error",
                title: "ไม่สามารถเปลี่ยนรหัสผ่านได้",
                text: errorMessage,
                footer: `<p class="text-xs">รหัสข้อผิดพลาด: ${error.status || 'ไม่ทราบ'}</p>`
            });
        }
    };

    // จัดการการส่งรหัสยืนยันอีกครั้ง
    const handleResendCode = async () => {
        if (isDisabled) {
            return;
        }
    
        try {
            Swal.fire({
                title: "กำลังส่งรหัสยืนยันอีกครั้ง",
                text: "กรุณารอสักครู่...",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
    
            const data = await forgotPassword(username);
    
            Swal.close();
    
            if (!data) {
                Swal.fire({
                    icon: "error",
                    title: "ไม่พบชื่อผู้ใช้",
                    text: "กรุณาตรวจสอบชื่อผู้ใช้ของคุณ",
                });
                return;
            }
    
            setEmail(data.email);
            setStatus(true);
            setIsDisabled(true);
            setCountdown(200);
    
            Swal.fire({
                icon: "success",
                title: "ส่งรหัสยืนยันอีกครั้งแล้ว",
                text: `รหัสยืนยันได้ถูกส่งไปยัง ${data.email} อีกครั้ง`,
            });
        } catch (error: any) {
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "ไม่สามารถส่งรหัสยืนยันอีกครั้งได้",
                text: error.response?.data?.message || "เกิดข้อผิดพลาดบางอย่าง",
            });
        }
    };

    // เค้าโครงพื้นฐานสำหรับทุกหน้า
    const renderPageLayout = (title: string, subtitle: string, formContent: React.ReactNode) => {
        return (
            <div className="flex justify-center items-center min-h-screen w-full bg-white py-4 px-2 sm:px-4 md:py-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col lg:flex-row w-full justify-center items-center">
                        {/* เนื้อหาด้านซ้าย */}
                        <div className="w-full lg:w-2/5 flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:pr-8">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">{title}</h1>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6">{subtitle}</p>
                            
                            <Link href="/login" className="flex items-center text-blue-500 mb-4 sm:mb-6 w-fit text-sm sm:text-base md:text-lg">
                                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-1" />
                                <span>กลับไปยังหน้าเข้าสู่ระบบ</span>
                            </Link>
                            
                            {formContent}
                        </div>
                        
                        {/* รูปภาพด้านขวา */}
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

    // หน้า 1: แบบฟอร์มการป้อนชื่อผู้ใช้
    const renderEnterUsername = () => {
        const formContent = (
            <form onSubmit={handleSendEmail} className="w-full">
                <div className="mb-4">
                    <label className="block text-base sm:text-lg font-medium text-gray-600 mb-2">ชื่อผู้ใช้</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg"
                            placeholder="ใส่ชื่อผู้ใช้ของคุณ"
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isDisabled}
                    className={`w-full py-3 sm:py-4 rounded-lg font-medium text-base sm:text-lg ${
                        isDisabled 
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                        : "bg-violet-400 text-white hover:bg-violet-500 transition-colors"
                    }`}
                >
                    ส่งรหัสยืนยัน
                </button>
            </form>
        );

        return renderPageLayout(
            "ลืมรหัสผ่านใช่ไหม?", 
            "ป้อนชื่อผู้ใช้ของคุณเพื่อรับรหัสยืนยัน",
            formContent
        );
    };

    // หน้า 2: แบบฟอร์มการยืนยันและรีเซ็ตรหัสผ่านแบบรวม
    const renderVerifyAndReset = () => {
        const formContent = (
            <form onSubmit={handleResetPassword} className="w-full">
                <div className="mb-4">
                    <label className="block text-base sm:text-lg font-medium text-gray-600 mb-2">ชื่อผู้ใช้</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={username}
                            className="w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-3 border border-gray-300 rounded-lg bg-gray-100 text-base sm:text-lg"
                            readOnly
                        />
                    </div>
                </div>
                
                <div className="mb-4">
                    <label className="block text-base sm:text-lg font-medium text-gray-600 mb-2">รหัสยืนยัน</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Code className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg"
                            placeholder="ใส่รหัสยืนยัน"
                            required
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-base sm:text-lg font-medium text-gray-600 mb-2">รหัสผ่านใหม่</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg"
                            placeholder="ใส่รหัสผ่านใหม่"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
                
                <div className="mb-4">
                    <label className="block text-base sm:text-lg font-medium text-gray-600 mb-2">ยืนยันรหัสผ่าน</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400" />
                        </div>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg"
                            placeholder="ยืนยันรหัสผ่านใหม่"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                        >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm sm:text-base text-gray-600">
                            เวลาที่เหลือ: <span className="font-semibold">{timeleft}</span>
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
                            ส่งรหัสอีกครั้ง
                        </button>
                    </div>
                </div>
                
                <button
                    type="submit"
                    className="w-full py-3 sm:py-4 rounded-lg font-medium text-base sm:text-lg bg-violet-400 text-white hover:bg-violet-500 transition-colors"
                >
                    รีเซ็ตรหัสผ่าน
                </button>
            </form>
        );

        return renderPageLayout(
            "รีเซ็ตรหัสผ่าน",
            "ป้อนรหัสยืนยันและสร้างรหัสผ่านใหม่",
            formContent
        );
    };

    // เปลี่ยนหน้า
    return step === 1 ? renderEnterUsername() : renderVerifyAndReset();
}