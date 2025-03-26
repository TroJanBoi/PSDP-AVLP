"use client";
import { MenuType, useMenuStore } from "@/lib/store/menu-store";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { Bell, LogOutIcon, Settings, User2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ClassInfoType {
  id: number;
  topic: string;
  description: string;
  img: string;
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

// ✅ Mock class data
const mockClasses: ClassInfoType[] = [
  {
    id: 1,
    topic: "Introduction to Assembly Language",
    description: "Learn the basics of Assembly language, including syntax, registers, and basic instructions.",
    img: "/images/topic-class-1.png",
    max_player: 20,
    owner: {
      name: "Administrator",
      email: "admin@example.com",
      img: "/images/unknown.png"
    }
  },
  {
    id: 6,
    topic: "Introduction to Assembly Language",
    description: "Learn the basics of Assembly programming",
    img: "/images/topic-class-3.png",
    max_player: 40,
    owner: {
      name: "Patipan",
      email: "ddpatipan@gmail.com",
      img: "/images/unknown.png"
    }
  },
  {
    id: 3,
    topic: "Assembly Control Flow",
    description: "Understand control flow in Assembly using jumps, loops, and conditional statements.",
    img: "/images/topic-class-3.png",
    max_player: 25,
    owner: {
      name: "Administrator",
      email: "admin@example.com",
      img: "/images/unknown.png"
    }
  },
  {
    id: 5,
    topic: "Advanced Assembly Techniques",
    description: "Dive into advanced Assembly topics like interrupts, system calls, and optimization techniques.",
    img: "/images/topic-class-2.png",
    max_player: 10,
    owner: {
      name: "Administrator",
      email: "admin@example.com",
      img: "/images/unknown.png"
    }
  }
];

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
    if (!classId) return;
    const found = mockClasses.find((cls) => cls.id === classId);
    if (found) {
      setClassInfo(found);
    } else {
      console.warn("Class not found in mock data");
    }
  }, [classId]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => window.removeEventListener("scroll", controlNavbar);
    }
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isBellOpen && bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isBellOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isTopicOpen && topicRef.current && !topicRef.current.contains(event.target as Node)) {
        setIsTopicOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTopicOpen]);

  if (status === "loading") return null;

  return (
    <>
      {status !== "authenticated" ? (
        <nav className={`fixed w-full top-0 z-50 ${scrollY ? "bg-primary shadow-lg" : ""}`}>
          <div className="mx-auto px-4 max-w-full">
            <div className="flex justify-between items-center">
              <Link href={"/homePage"}>
                <div className="bg-[url('/images/logo.png')] w-20 h-20 bg-cover bg-center" />
              </Link>
              <Link href={"/signUpPage"} className="text-white bg-pink-600 px-5 py-2 rounded-lg text-xl font-semibold">
                Sign Up
              </Link>
            </div>
          </div>
        </nav>
      ) : (
        <nav className={`${Topic || btnRun ? "static" : "fixed"} w-full top-0 z-50 ${scrollY || Topic || btnRun ? "bg-primary shadow-lg" : ""}`}>
          <div className="mx-auto px-4 max-w-full">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Link href={"/homePage"}>
                  <div className="bg-[url('/images/logo.png')] w-20 h-20 bg-cover bg-center" />
                </Link>
                {Topic && (
                  <div ref={topicRef} className="relative">
                    <button className="text-white font-semibold text-xl" onClick={() => setIsTopicOpen(!isTopicOpen)}>
                      {Topic}
                    </button>
                    {isTopicOpen && classInfo && (
                      <div className="absolute left-0 w-[550px] bg-white text-black rounded-xl shadow-xl p-6 z-50">
                        <h2 className="text-2xl font-bold mb-4">{Topic}</h2>
                        <div className="flex items-center gap-3 mb-4">
                          <Image src={classInfo.owner.img || "/images/unknown.png"} alt="Owner" width={48} height={48} className="rounded-full w-12 h-12 object-cover" />
                          <span className="text-lg font-semibold">{classInfo.owner.name}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">Description</h3>
                        <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded-lg">{classInfo.description || "ไม่มีคำอธิบาย"}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {btnRun && (
                  <Button className="text-primary bg-white font-semibold px-5 py-3 rounded-lg shadow hover:bg-gray-200">Run</Button>
                )}
                <Link href="/" className="text-white font-semibold text-xl">Home</Link>
                <Link href="/" className="text-white font-semibold text-xl">Class</Link>
                <div ref={bellRef} className="relative">
                  <Bell className="text-white cursor-pointer" size={24} onClick={() => setIsBellOpen(!isBellOpen)} />
                  {isBellOpen && (
                    <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg w-60 p-4 z-50 text-sm text-gray-700">
                      🔔 ไม่มีการแจ้งเตือนใหม่
                    </div>
                  )}
                </div>
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
                  <div ref={dropdownRef} className="absolute right-0 mt-[220px] bg-white rounded-md shadow-lg w-60 p-4 z-50 text-sm text-gray-700">
                    <div className="px-4 py-2 text-sm text-gray-900">{session.user?.email}</div>
                    <div className="border-t">
                      <a href={"/account"} className="flex px-4 py-2 text-sm hover:bg-gray-100"><User2 className="mr-3" /> Profile</a>
                      <a href="#" className="flex px-4 py-2 text-sm hover:bg-gray-100"><Settings className="mr-3" /> Settings</a>
                      <a href="#" onClick={() => signOut({ callbackUrl: '/' })} className="flex px-4 py-2 text-sm hover:bg-gray-100"><LogOutIcon className="mr-3" /> Sign out</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
