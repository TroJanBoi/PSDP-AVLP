"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Bell, Clock, Menu } from 'lucide-react';

const Navbar = () => {

    const [isVisible, setIsVisible] = useState(true);
    const [isLogin, setIsLogin] = useState(true);
    const [lastScrollTop, setLastScrollTop] = useState(0);

    const controlNavbar = () => {
        if (typeof window !== "undefined") {
            if (window.scrollY > lastScrollTop && window.scrollY > 200) {
                setIsVisible(false);
            } else if (window.scrollY < lastScrollTop) {
                setIsVisible(true);
            }
            setLastScrollTop(window.scrollY);
        }
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("scroll", controlNavbar);
            return () => {
                window.removeEventListener("scroll", controlNavbar);
            };
        }
    }, [lastScrollTop]);

    return (
        <nav className="w-full border-gray-200 bg-primary fixed top-0 z-50">
            <div className="mx-auto max-w-full px-4 py-2">
                <div className="flex items-center justify-between">
                    <div className="hidden md:flex items-center flex-grow gap-4">
                        <Link href={"/homePage"} className="flex items-center flex-shrink-0">
                            <div className="text-white px-4 py-2 bg-background rounded-full size-12 bg-cover bg-center bg-no-repeat">
                            </div>
                        </Link>
                        <div
                            className={`flex-grow max-w-xl
                            ${isVisible ? "hidden" : "static"}`}
                        >
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-1/2 p-2 rounded-md"
                            />
                        </div>
                    </div>
                    {isLogin ? (
                        <>
                            <div>
                                <Link href="/login" className="text-primary hover:text-secondary bg-background hover:bg-gray-200 translate-colors rounded-md p-2">
                                    เข้าสู่ระบบ
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="hidden md:flex items-center gap-4">
                                <div className="flex gap-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="text-white hover:text-gray-200">
                                                <Clock className="h-5 w-5" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[300px]">
                                            <h3 className="px-2 py-1.5 text-sm font-semibold">
                                                ประวัติการทำงาน
                                            </h3>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="text-white hover:text-gray-200">
                                                <Bell className="w-5 h-5" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[300px]">
                                            <h3 className="px-2 py-1.5 text-sm font-semibold">
                                                การแจ้งเตือน
                                            </h3>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <div className="hidden md:block">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="flex items-center">
                                                <div className="flex items-center">
                                                    true   </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[200px] mt-2">
                                                <DropdownMenuItem>
                                                    <div className="px-3 py-2 text-sm text-gray-600"></div>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link href="/profile" className="w-full">
                                                        โปรไฟล์
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link href="/settings" className="w-full">
                                                        ตั้งค่า
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>ออกจากระบบ</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                            <div className="flex md:hidden ml-2">
                                <Link href="/" className="flex items-center space-x-2 bg-background rounded-full p-4">

                                </Link>
                            </div>
                            <div className="flex md:hidden">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="text-white" size="icon">
                                            <Menu className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-[200px]">
                                        <DropdownMenuItem>
                                            <Link href="/">หน้าแรก</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Link href="/about">เกี่ยวกับเรา</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Link href="/contact">ติดต่อ</Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
export default Navbar;