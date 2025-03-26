"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
<<<<<<< HEAD
=======
import { BookOpen, Link } from "lucide-react";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
>>>>>>> c5b1836e7cce8517160374f0b9c2cdfab200a509

const cards = [
    {
        image: "/images/topic-class-1.png",
        title: "Assembly Tutorial 1",
        description:
            "Learn the fundamentals of assembly language step by step. This tutorial covers syntax, registers and memory management examples 🚀💻"
    },
    {
        image: "/images/topic-class-2.png",
        title: "Assembly Tutorial 2",
        description:
            "Master low-level programming with interactive exercises. Dive into control flow, instructions, and more!"
    },
    {
        image: "/images/topic-class-3.png",
        title: "Assembly Tutorial 3",
        description:
            "Explore memory management, registers, and syntax. Build confidence with step-by-step examples!"
    },
    {
        image: "/images/topic-class-2.png",
        title: "Assembly Tutorial 4",
        description:
            "Advance your skills with real-world assembly code. Debug, optimize, and run programs live!"
    }
];

// Static JSON data based on the provided API response
const mockClasses: ClassType[] = [
    {
        id: 1,
        topic: "Introduction to Assembly Language",
        description: "Learn the basics of Assembly language, including syntax, registers, and basic instructions.",
        img: "/images/topic-class-1.png",
        max_player: 20,
        owner: {
            name: "Administrator",
            email: "admin@example.com",
            img: "/images/unknown.png" // profile_picture is ""
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
            img: "/images/unknown.png" // Adjusted from "http://example.com/patipan.jpg"
        }
    },
    {
        id: 2,
        topic: "Assembly Arithmetic Operations",
        description: "Explore arithmetic operations in Assembly, such as ADD, SUB, MUL, and DIV, with practical examples.",
        img: "/images/topic-class-2.png",
        max_player: 15,
        owner: {
            name: "Administrator",
            email: "admin@example.com",
            img: "/images/unknown.png"
        }
    },
    {
        id: 7,
        topic: "Control Flow in Assembly",
        description: "Understand jumps, loops, and conditionals",
        img: "/images/topic-class-2.png",
        max_player: 30,
        owner: {
            name: "Administrator",
            email: "admin@example.com",
            img: "/images/unknown.png"
        }
    },
    {
        id: 4,
        topic: "Assembly Memory Management",
        description: "Learn how to manage memory in Assembly, including stack operations and memory addressing modes.",
        img: "/images/topic-class-1.png",
        max_player: 18,
        owner: {
            name: "Administrator",
            email: "admin@example.com",
            img: "/images/unknown.png"
        }
    },
    {
        id: 8,
        topic: "Interfacing Assembly with Hardware",
        description: "Explore low-level hardware programming",
        img: "/images/topic-class-1.png",
        max_player: 20,
        owner: {
            name: "Administrator",
            email: "admin@example.com",
            img: "/images/unknown.png"
        }
    }
];

export default function PopularClassesSection() {
<<<<<<< HEAD
=======
    const router = useRouter();
    const [classes, setClasses] = useState<ClassType[]>([]);
>>>>>>> c5b1836e7cce8517160374f0b9c2cdfab200a509
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(2);
    const { data: session, status } = useSession();

    const handleClick = (id: number) => {
        if (!session) {
            Swal.fire({
                icon: "warning",
                title: "กรุณาเข้าสู่ระบบ",
                text: "คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถเข้าชั้นเรียนได้",
                confirmButtonText: "ตกลง"
            }).then(() => {
                router.push("/login");
            });
            return;
        }
       router.push(`/classes/${id}`);
    };

    useEffect(() => {
<<<<<<< HEAD
=======
        // Use static mock data instead of fetching from API
        const fetchClasses = () => {
            setClasses(mockClasses);
            console.log("Mock data loaded: ", mockClasses);
        };

>>>>>>> c5b1836e7cce8517160374f0b9c2cdfab200a509
        const handleResize = () => {
            const windowWidth = window.innerWidth;
            if (typeof window !== "undefined") {
                if (windowWidth > 1080) {
                    setPageSize(3);
                } else {
                    setPageSize(2);
                }
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("resize", handleResize);
            }
        };
    }, []);

    const nextPage = () => {
        if ((page + 1) * pageSize < cards.length) {
            setPage(page + 1);
        }
    };

    const prevPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

<<<<<<< HEAD
    const visibleCards = cards.slice(page * pageSize, (page + 1) * pageSize);

=======
    const visibleCards = classes.slice(page * pageSize, (page + 1) * pageSize);
    if (status === "loading") return null;
    console.log("images: ", classes);
>>>>>>> c5b1836e7cce8517160374f0b9c2cdfab200a509
    return (
        <section className="flex flex-col justify-center items-center w-full h-[100vh] bg-no-repeat bg-center bg-cover bg-[#A179DC] xl:bg-[url('/images/bg-populaClass.png')] px-4 py-12 pt-24">
            <div className="flex flex-col justify-center items-center space-y-3 text-center max-w-7xl w-full">
                <h1 className="text-3xl sm:text-4xl font-semibold text-white">
                    Our Popular Classes
                </h1>

                <div className="text-sm sm:text-base text-gray-200 max-w-xl hidden xl:block ">
                    <p>
                        Discover our most sought-after classes, carefully curated to meet
                        the demands of today's learner. Dive into engaging content crafted
                        for success in every step of your education journey.
                    </p>
                </div>

                <div className="w-full flex flex-wrap justify-center items-stretch gap-6">
<<<<<<< HEAD
                    {visibleCards.map((card, index) => (
                        <Card
                            key={index}
                            className="w-full sm:w-[22rem] flex flex-col justify-between"
                        >
                            <CardHeader>
                                <div className="flex justify-center items-center">
                                    <Image
                                        src={card.image}
                                        width={350}
                                        height={350}
                                        alt={card.title}
                                        className="rounded-md object-cover max-h-60 w-full"
                                    />
                                </div>
                            </CardHeader>

                            <CardContent className="text-left flex-grow">
                                <CardTitle className="text-primary text-xl sm:text-2xl">
                                    {card.title}
                                </CardTitle>
                                <CardDescription className="text-sm sm:text-base text-gray-600 mt-2">
                                    {card.description}
                                </CardDescription>
                            </CardContent>

                            <CardFooter className="pt-4 text-black font-semibold">
                                Peerapol Srisawat
                            </CardFooter>
                        </Card>
=======
                    {visibleCards.map((cls) => (
                        <div onClick={() => handleClick(cls.id)} key={cls.id} className="cursor-pointer">
                            <Card
                                key={cls.id}
                                className="w-full sm:w-[22rem] flex flex-col justify-between h-full"
                            >
                                <CardHeader>
                                    <div className="flex justify-center items-center">
                                        <Image
                                            src={cls.img}
                                            width={350}
                                            height={350}
                                            alt={cls.topic}
                                            className="rounded-md object-cover max-h-60 w-full"
                                        />
                                    </div>
                                </CardHeader>

                                <CardContent className="text-left flex-grow">
                                    <CardTitle className="text-primary text-xl sm:text-2xl">
                                        {cls.topic}
                                    </CardTitle>
                                    <CardDescription className="text-sm sm:text-base text-gray-600 mt-2">
                                        <div>
                                            {cls.description}
                                        </div>
                                    </CardDescription>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center pt-4 text-black font-semibold">
                                    <div className="flex items-center gap-2">
                                        <BookOpen />
                                        {cls.max_player} Students
                                    </div>
                                    <div className="flex items-center gap-2 truncate">
                                        <Image
                                            className="w-7 h-7 rounded-full cursor-pointer bg-gray-200"
                                            src={cls.owner.img ?? "/images/unknown.png"}
                                            width={7}
                                            height={7}
                                            alt="User"
                                        />
                                        {cls.owner.name}
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
>>>>>>> c5b1836e7cce8517160374f0b9c2cdfab200a509
                    ))}
                </div>

                <div className="flex space-x-4 mt-6">
                    <button
                        onClick={prevPage}
                        disabled={page === 0}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        onClick={nextPage}
                        disabled={(page + 1) * pageSize >= cards.length}
                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                    >
                        ถัดไป
                    </button>
                </div>
            </div>
        </section>
    );
}