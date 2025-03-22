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

export default function PopularClassesSection() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(2);

    useEffect(() => {
        const handleResize = () => {
            const widowWidth = window.innerWidth;
            if (typeof window !== "undefined") {
                if (widowWidth > 1080) {
                    setPageSize(3);
                } else
                    setPageSize(2);
            }
        }

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("resize", handleResize);
            }
        }
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

    const visibleCards = cards.slice(page * pageSize, (page + 1) * pageSize);

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
