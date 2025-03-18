"use client";
import { MenuType, useMenuStore } from "@/lib/store/menu-store";
import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {

    const setMenu = useMenuStore((state) => state.setMenu);
    const [scrollY, setScrollY] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

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

    console.log("scrollY: ", scrollY);
    console.log("lastScrollY: ", lastScrollY);
    return (
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
                        <Link href={"/"} className="text-textbase bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg font-semibold rounded-lg text-xl px-5 py-2.5 text-center me-2 mb-2 ">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
