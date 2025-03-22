"use client";
import { MenuType, useMenuStore } from "@/lib/store/menu-store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";
import Image from "next/image";

const Navbar = () => {

    const setMenu = useMenuStore((state) => state.setMenu);
    const [scrollY, setScrollY] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const { data: session, status } = useSession();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const controlNavbar = () => {
        if (typeof window !== "undefined") {
            if (window.scrollY > lastScrollY && window.scrollY > 150) {
                setScrollY(true);
            } else if (window.scrollY < lastScrollY && window.scrollY < 150) {
                setScrollY(false);
            }
            setLastScrollY(window.scrollY);
        }
    };

    const handleSelect = (menu: MenuType) => {
        setMenu(menu);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("scroll", controlNavbar);
            return () => {
                window.removeEventListener("scroll", controlNavbar);
            };
        }
    }, [lastScrollY]);

    console.log("session email: ", session?.user?.email);
    // console.log("scrollY: ", scrollY);
    // console.log("lastScrollY: ", lastScrollY);
    if (status === "loading") return null;
    return (

        <>
            {status !== "authenticated" ? (
                <nav className={`fixed w-full top-0 z-50 ${scrollY ? "bg-primary shadow-lg" : ""}`}>
                    <div className="mx-auto px-4 max-w-full">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center flex-grow gap-4 top">
                                <Link href={"/homePage"} className="flex items-center shrink-0" onClick={() => handleSelect("home-main")}>
                                    <div className="bg-[url('/images/logo.png')] w-20 h-20 bg-cover bg-center bg-no-repeat">
                                    </div>
                                </Link>
                            </div>
                            <div className="flex items-center gap-4 pr-5">
                                <Link href={"/"} className="text-textbase bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg font-semibold rounded-lg text-xl px-5 py-2.5 text-center me-2 mb-2 ">
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
            ) : (
                <nav className={`fixed w-full top-0 z-50 ${scrollY ? "bg-primary shadow-lg" : ""}`}>
                    <div className="mx-auto px-4 max-w-full">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center flex-grow gap-4 top">
                                <Link href={"/homePage"} className="flex items-center shrink-0" onClick={() => handleSelect("home-main")}>
                                    <div className="bg-[url('/images/logo.png')] w-20 h-20 bg-cover bg-center bg-no-repeat">
                                    </div>
                                </Link>
                            </div>
                            <div className="flex items-center gap-4 pr-5">
                                <div className="font-semibold text-xl text-white">
                                    <h1 className="">Home</h1>
                                </div>
                                <div className="font-semibold text-xl text-white">
                                    Class
                                </div>
                                <div>
                                    <Bell className="text-white" size={24} />
                                </div>
                                <div>
                                    <Image
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="w-10 h-10 rounded-full cursor-pointer bg-gray-200"
                                        src={`${session?.user?.image ?? "/images/unknown.png"}`}
                                        width={40}
                                        height={40}
                                        alt="User"
                                    />
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg w-48">
                                            <div className="px-4 py-2 text-sm text-gray-900">{session.user?.email}</div>
                                            <div className="border-t">
                                                <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100">Dashboard</a>
                                                <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100">Settings</a>
                                                <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100">Sign out</a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            )}

        </>
    );
};

export default Navbar;
