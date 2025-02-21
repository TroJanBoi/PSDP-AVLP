"use client";

import { forgotPassword } from "@/services/api";
import { resetPassword } from "@/services/api";
import { count } from "console";
import { set } from "date-fns";
import { stat } from "fs";
import { User, Lock, Code } from "lucide-react";
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
    const [timeleft, setTimeleft] = useState<string>("02:00");
    const [countdown, setCountdown] = useState<number | null>(null);

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

    const updateTimer = (seconds: number) => {
        const miniutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        setTimeleft(`${miniutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`);
    };

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isDisabled) {
            return;
        }
        try {
            const data = await forgotPassword(username);
            if (data === undefined) {
                Swal.fire({
                    icon: "error",
                    title: "username not found",
                    text: "Please check your username",
                });
                try {
                    const data = await forgotPassword(username);
                    if (data === undefined) {
                        Swal.fire({
                            icon: "error",
                            title: "username not found",
                            text: "Please check your username",
                        });
                        setStatus(false);
                        return;
                    }
                    console.log("new password sent");
                    setStatus(true);
                }
                catch (error: any) {
                    Swal.fire({
                        icon: "error",
                        title: "Forgot password failed",
                        text: error.response.data.message,
                    });
                }
                return;
            }
            setEmail(data.email);
            console.log("new password sent");
            setStatus(true);
            setIsDisabled(true);
            setCountdown(120);
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "Forgot password failed",
                text: error.response.data.message || "Something went wrong",
            });
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
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
                title: "Password do not match",
            });
            return;
        }
        const data_mail = await resetPassword(email, password, code);
        console.log("data_mail: ", data_mail);
        if (data_mail === undefined) {
            Swal.fire({
                icon: "error",
                title: "Reset password failed",
                text: "Please check your code",
            });
            return;
        }
        console.log("password changed");
        Swal.fire({
            icon: "success",
            title: "Password changed",
            text: "Please login to continue",
        }).then(() => {
            window.location.href = "/login";
        });

    }

    return (
        <div className="flex justify-center items-center h-screen w-screen bg-primary">
            <div className="relative bg-cover bg-center lg:w-1/2 h-full ">

            </div>
            <div className="relative flex w-1/2 mr-auto space-y-3 min-h-screen bg-gray-100 p-14 shadow-lg rounded-l-3xl flex-col justify-center items-center
                        md:w-1/2 md:rounded-l-3xl
                        portrait:w-full portrait:rounded-none portrait:min-h-screen">
                <div className="rounded-full bg-secondary mb-5 w-40 h-40 flex justify-center items-center">
                    <h1 className="text-textbase">LOGO</h1>
                </div>
                <div className="flex flex-col gap-5 justify-center items-center w-3/4 space-y-3">
                    <div className="flex flex-col items-center border-b-2 w-4/5 text-center border-primary">
                        <h1 className="text-xl xl:text-4xl font-bold text-accent">Forgot your password ?</h1>
                    </div>
                    <form onSubmit={status ? handleSubmit : handleSendEmail} className="flex flex-col w-3/4 gap-4">
                        <div className="flex items-center text-xl bg-white shadow-md hover:border-2 hover:border-primary text-primary px-4 py-2 rounded-lg w-full">
                            <User className="mr-2 w-6 h-6 text-primary" />
                            <input type="text" placeholder="Username" className="bg-transparent outline-none text-primary w-full h-8 placeholder-secondary" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        {status &&
                            <>
                                <div className="flex items-center text-xl bg-white shadow-md hover:border-2 hover:border-primary text-primary px-4 py-2 rounded-lg w-full">
                                    <Lock className="mr-2 w-6 h-6 text-primary" />
                                    <input type="password" placeholder="password" name="password" className="bg-transparent outline-none text-primary w-full h-8 placeholder-secondary" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="flex items-center text-xl bg-white shadow-md hover:border-2 hover:border-primary text-primary px-4 py-2 rounded-lg w-full">
                                    <Lock className="mr-2 w-6 h-6 text-primary" />
                                    <input type="password" placeholder="Confirm password" name="confpassword" className="bg-transparent outline-none text-primary w-full h-8 placeholder-secondary" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>
                                <div className="flex items-center text-xl bg-white shadow-md hover:border-2 hover:border-primary text-primary px-4 py-2 rounded-lg w-full">
                                    <Code className="mr-2 w-6 h-6 text-primary" />
                                    <input type="text" placeholder="Code" name="code" className="bg-transparent outline-none text-primary w-full h-8 placeholder-secondary" value={code} onChange={(e) => setCode(e.target.value)} />
                                </div>
                            </>
                        }
                        <div className="flex flex-row justify-center items-center h-fit w-full shadow-lg">
                            <button className="flex mx-auto justify-center w-full rounded-l-lg bg-primary py-3 text-md xl:text-lg font-medium text-white shadow-md hover:bg-secondary" disabled={isDisabled && !status} type="submit">
                                {status ? (countdown ? `Submit` : "Send Again") : "Send Email"}
                            </button>
                            <Link href={"/login"} className="bg-accent text-md xl:text-lg py-3 px-3 text-center w-full rounded-r-lg">Back to log in</Link>
                        </div>
                        <div className="flex flex-row justify-center items-center w-full">
                            <h1 className="text-xl text-primary">{status ? (countdown ? `${timeleft}` : "") : ""}</h1>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}