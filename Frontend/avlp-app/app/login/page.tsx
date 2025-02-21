"use client";

import Link from "next/link";
import BtnSignIn from "./_components/BtnSignIn";
import { User, Lock } from "lucide-react";
import { useState } from "react";
import { api, login } from "@/services/api";
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

        try 
        {
            const data = await login(username, password);
            if (data === undefined) {
                Swal.fire({
                    icon: "error",
                    title: "Login failed",
                    text: "Please check your username and password",
                });
                return;
            }
            console.log("login success: ", data);
            Swal.fire({
                icon: "success",
                title: "Login success",
                text: "Welcome to AVLP",
            }).then (() => {
                window.location.href = "/homePage";    
            });
        }
        catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "Login failed",
                text: error.response.data.message,
            });
        }
        finally
        {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen w-screen bg-primary">
            <div className="relative bg-cover bg-center lg:w-1/2 h-full ">

            </div>
            <div className="relative flex flex-col justify-center items-center bg-background w-full lg:w-1/2 h-full lg:rounded-l-3xl drop-shadow-lg gap-5">
                <div className="mb-16 lg:mb-0">
                    <div className="rounded-full bg-secondary w-40 h-40 flex justify-center items-center">
                        <h1 className="text-textbase">LOGO</h1>
                    </div>
                </div>
                <div className="flex flex-col gap-5 justify-center items-center w-3/4">
                    <div className="border-b-2 w-4/5 text-center border-primary">
                        <h1 className="text-3xl font-bold text-accent">Sign In</h1>
                    </div>
                    <div className="w-3/4 mt-4">
                        <form onSubmit={handleSubmit} method="POST" className="flex flex-col gap-4">
                            <div className="flex items-center text-xl bg-white shadow-md hover:border-2 hover:border-primary text-primary px-4 py-2 rounded-lg w-full">
                                <User className="mr-2 w-6 h-6 text-primary" />
                                <input type="text" placeholder="Username" value={username} className="bg-transparent outline-none text-primary w-full h-8 placeholder-secondary" onChange={(error) => setUsername(error.target.value)} />
                            </div>
                            <div className="w-full mt-4">
                                <div className="flex items-center text-xl bg-white shadow-md hover:border-2 hover:border-primary text-white px-4 py-2 rounded-lg w-full">
                                    <Lock className="mr-2 w-6 h-6 text-primary" />
                                    <input type="password" placeholder="Password" value={password} className="bg-transparent outline-none text-primary w-full h-8 placeholder-primary" onChange={(error) => setPassword(error.target.value)} />
                                </div>
                                <div className="flex justify-between items-center mt-2 text-xl">
                                    <label className="flex items-center text-gray-500">
                                        <input type="checkbox" className="mr-1 accent-teal-500" />
                                        <span className="text-accent cursor-pointer">remember</span>
                                    </label>
                                    <Link href="login/forgot" className="text-accent hover:underline hover:font-semibold">forgot password?</Link>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center w-full mt-10">
                                <BtnSignIn />
                                <div className="text-xl text-accent mt-2">
                                    <h1>
                                        Don't have an account?
                                        <Link href={"../register/"} className="hover:underline hover:font-semibold">
                                           Sign Up
                                        </Link>
                                    </h1>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2 w-4/5">
                        <div className="w-full border-b-2 border-primary">
                        </div>
                        <div>
                            <h1 className="text-xl text-accent font-semibold">OR</h1>
                        </div>
                        <div className="w-full border-b-2 border-primary">
                        </div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2 w-3/4">
                        <button className="bg-primary text-textbase w-full rounded-md py-2 px-4 text-center hover:bg-secondary">
                            <h1 className="flex font-semibold items-center justify-center gap-2 text-xl">
                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 12.5C5.99856 13.9165 6.49829 15.2877 7.41074 16.3712C8.32318 17.4546 9.58951 18.1802 10.9856 18.4197C12.3816 18.6592 13.8174 18.397 15.0388 17.6797C16.2601 16.9623 17.1883 15.836 17.659 14.5H12V10.5H21.805V14.5H21.8C20.873 19.064 16.838 22.5 12 22.5C6.477 22.5 2 18.023 2 12.5C2 6.977 6.477 2.5 12 2.5C13.6345 2.49884 15.2444 2.89875 16.6883 3.66467C18.1323 4.43058 19.3662 5.5391 20.282 6.893L17.004 9.188C16.2924 8.11241 15.2532 7.29473 14.0404 6.85617C12.8275 6.4176 11.5057 6.38149 10.2707 6.75319C9.03579 7.12488 7.95347 7.88461 7.18421 8.91974C6.41495 9.95487 5.9997 11.2103 6 12.5Z" fill="#EEEEEE" />
                                </svg>
                                Continue with Google
                            </h1>
                        </button>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2 w-3/4">
                        <button className="bg-primary text-textbase w-full rounded-md py-2 px-4 text-center hover:bg-secondary">
                            <h1 className="flex font-semibold items-center justify-center gap-2 text-xl">
                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 0.5C8.68678 0.5 7.38642 0.758658 6.17317 1.2612C4.95991 1.76375 3.85752 2.50035 2.92893 3.42893C1.05357 5.3043 0 7.84784 0 10.5C0 14.92 2.87 18.67 6.84 20C7.34 20.08 7.5 19.77 7.5 19.5V17.81C4.73 18.41 4.14 16.47 4.14 16.47C3.68 15.31 3.03 15 3.03 15C2.12 14.38 3.1 14.4 3.1 14.4C4.1 14.47 4.63 15.43 4.63 15.43C5.5 16.95 6.97 16.5 7.54 16.26C7.63 15.61 7.89 15.17 8.17 14.92C5.95 14.67 3.62 13.81 3.62 10C3.62 8.89 4 8 4.65 7.29C4.55 7.04 4.2 6 4.75 4.65C4.75 4.65 5.59 4.38 7.5 5.67C8.29 5.45 9.15 5.34 10 5.34C10.85 5.34 11.71 5.45 12.5 5.67C14.41 4.38 15.25 4.65 15.25 4.65C15.8 6 15.45 7.04 15.35 7.29C16 8 16.38 8.89 16.38 10C16.38 13.82 14.04 14.66 11.81 14.91C12.17 15.22 12.5 15.83 12.5 16.76V19.5C12.5 19.77 12.66 20.09 13.17 20C17.14 18.66 20 14.92 20 10.5C20 9.18678 19.7413 7.88642 19.2388 6.67317C18.7362 5.45991 17.9997 4.35752 17.0711 3.42893C16.1425 2.50035 15.0401 1.76375 13.8268 1.2612C12.6136 0.758658 11.3132 0.5 10 0.5Z" fill="#EEEEEE" />
                                </svg>
                                Continue with Github
                            </h1>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}