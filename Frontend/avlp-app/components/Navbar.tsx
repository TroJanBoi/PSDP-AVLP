"use client";
import { MenuType, useMenuStore } from "@/lib/store/menu-store";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { Bell, LogOutIcon, Settings, User2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getClassById } from "@/services/api"; // เพิ่มที่ด้านบน

interface ClassInfoType {
    description: string;
    max_player: number;
    owner: {
        img: string;
        name: string;
        email: string;
    };
}

interface NavbarProps {
    classId?: number;
    Topic?: string;
    btnRun?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ classId, Topic, btnRun = false }) => {

    const setMenu = useMenuStore((state) => state.setMenu);
    const [scrollY, setScrollY] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const { data: session, status } = useSession();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLImageElement>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isBellOpen, setIsBellOpen] = useState(false);
    const bellRef = useRef<HTMLDivElement>(null);
    const [isTopicOpen, setIsTopicOpen] = useState(false);
    const topicRef = useRef<HTMLDivElement>(null);
    const [classInfo, setClassInfo] = useState<ClassInfoType | null>(null);

    console.log("classId: ", classId);
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
        console.log("menu: ", menu);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isDropdownOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                avatarRef.current &&
                !avatarRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("scroll", controlNavbar);
            return () => {
                window.removeEventListener("scroll", controlNavbar);
            };
        }
    }, [lastScrollY]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isBellOpen &&
                bellRef.current &&
                !bellRef.current.contains(event.target as Node)
            ) {
                setIsBellOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isBellOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isTopicOpen &&
                topicRef.current &&
                !topicRef.current.contains(event.target as Node)
            ) {
                setIsTopicOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isTopicOpen]);


    useEffect(() => {
        const fetchClassInfo = async () => {
            if (!classId) return;
            try {
                const data = await getClassById(classId);
                setClassInfo(data);
            } catch (error) {
                console.error("ไม่สามารถโหลดข้อมูลคลาสได้", error);
            }
        };
        fetchClassInfo();
    }, [classId]);


    // console.log("session email: ", session?.user?.email);
    console.log("classInfo: ", classInfo);
    console.log("Topic:", Topic);

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
                                <Link href={"/signUpPage"} className="text-textbase bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg font-semibold rounded-lg text-xl px-5 py-2.5 text-center me-2 mb-2 ">
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
            ) : (
                <nav className={`${Topic || btnRun ? "static" : "fixed"} w-full top-0 z-50 ${scrollY || Topic || btnRun ? "bg-primary shadow-lg" : ""}`}>
                    <div className="mx-auto px-4 max-w-full">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4 top">
                                <Link href={"/homePage"} className="flex items-center shrink-0" onClick={() => handleSelect("home-main")}>
                                    <div className="bg-[url('/images/logo.png')] w-20 h-20 bg-cover bg-center bg-no-repeat">
                                    </div>
                                </Link>
                                { Topic && (
                                    <div ref={topicRef} className="relative">
                                        <button className="text-white font-semibold text-xl" onClick={() => setIsTopicOpen(!isTopicOpen)}>
                                            {Topic}
                                        </button>
                                    </div>
                                )}
                                {isTopicOpen && classInfo && (
                                // absolute right-0 mt-2 bg-white rounded-md shadow-lg w-60 p-4 z-50
                                    <div className="absolute left-0 mt-80 w-[550px] bg-white text-black rounded-xl shadow-xl p-6 z-50">
                                        <h2 className="text-2xl font-bold mb-4">{Topic}</h2>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={classInfo.owner?.img || "/images/unknown.png"}
                                                    alt="Owner"
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full w-12 h-12 object-cover"
                                                />
                                                <span className="text-lg font-semibold">{classInfo.owner?.name}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-1">Description</h3>
                                            <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded-lg leading-relaxed">
                                                {classInfo.description || "ไม่มีคำอธิบาย"}
                                            </p>
                                        </div>
                                    </div>
                                )}

                            </div>
                            {btnRun && (
                                <div className="flex items-center gap-4 ">
                                    <div>
                                        <Button className="text-primary bg-white text-xl font-semibold rounded-lg px-5 py-3 text-center shadow-xl hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800">
                                            Run
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-4">

                                {btnRun || Topic ? (
                                    <>
                                        <Link href={"/"} className="font-semibold text-xl text-white cursor-pointer" onClick={() => handleSelect("home-main")}>
                                            Home
                                        </Link>
                                        <Link href={"/"} className="font-semibold text-xl text-white cursor-pointer" onClick={() => handleSelect("class")}>
                                            Class
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <div
                                            onClick={() => {
                                                const el = document.getElementById("home-main");
                                                if (el) {
                                                    el.scrollIntoView({ behavior: "smooth" });
                                                }
                                                handleSelect("home-main");
                                            }}
                                            className="font-semibold text-xl text-white cursor-pointer">
                                            Home
                                        </div>
                                        <div
                                            onClick={() => {
                                                const el = document.getElementById("home-class");
                                                if (el) {
                                                    el.scrollIntoView({ behavior: "smooth" });
                                                }
                                                handleSelect("class");
                                            }}
                                            className="font-semibold text-xl text-white cursor-pointer">
                                            Class
                                        </div>
                                    </>
                                )}
                                <div>
                                    <div ref={bellRef} className="relative">
                                        <Bell
                                            className="text-white cursor-pointer"
                                            size={24}
                                            onClick={() => setIsBellOpen(!isBellOpen)}
                                        />
                                        {isBellOpen && (
                                            <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg w-60 p-4 z-50">
                                                <div className="text-sm text-gray-700">🔔 ไม่มีการแจ้งเตือนใหม่</div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                                <div>
                                    <Image
                                        ref={avatarRef}
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="w-10 h-10 rounded-full cursor-pointer bg-gray-200"
                                        src={`${session?.user?.image ?? "/images/unknown.png"}`}
                                        width={40}
                                        height={40}
                                        alt="User"
                                    />
                                    {isDropdownOpen && (
                                        <div ref={dropdownRef} className="absolute right-0 mt-2 bg-white rounded-md shadow-lg w-48">
                                            <div className="px-4 py-2 text-sm text-gray-900">{session.user?.email}</div>
                                            <div className="border-t">
                                                <a href="#" className="flex px-4 py-2 text-sm hover:bg-gray-100">
                                                    <User2 className="mr-3" /> Profile
                                                </a>
                                                <a href="#" className="flex px-4 py-2 text-sm hover:bg-gray-100">
                                                    <Settings className="mr-3" /> Settings
                                                </a>
                                                <a href="#" onClick={() => { signOut({ callbackUrl: '/' }) }} className="flex text-center px-4 py-2 text-sm hover:bg-gray-100">
                                                    <LogOutIcon className="mr-3" /> Sign out
                                                </a>
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
