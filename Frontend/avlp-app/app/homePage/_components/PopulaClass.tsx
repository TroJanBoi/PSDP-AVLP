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
import { BookOpen } from "lucide-react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface ClassType {
    id: number;
    topic: string;
    description: string;
    img: string;
    max_player: number;
    owner: {
        name: string;
        email: string;
        img: string;
    };
}

export default function PopularClassesSection() {
    const router = useRouter();
    const [classes, setClasses] = useState<ClassType[]>([]);
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
        const fetchClasses = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes`);
                const data = await res.json();
                const classesData = Array.isArray(data) ? data : data.classes || [];
                setClasses(classesData);
                console.log("API data loaded: ", classesData);
            } catch (error) {
                console.error("Failed to load classes from API:", error);
            }
        };

        const handleResize = () => {
            const windowWidth = window.innerWidth;
            if (windowWidth > 1080) {
                setPageSize(3);
            } else {
                setPageSize(2);
            }
        };

        fetchClasses();
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const nextPage = () => {
        if ((page + 1) * pageSize < classes.length) {
            setPage(page + 1);
        }
    };

    const prevPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const visibleCards = classes.slice(page * pageSize, (page + 1) * pageSize);
    if (status === "loading") return null;
    // console.log("Session data:", session);
    console.log("visibleCards:", visibleCards);
    return (
        <section className="flex flex-col justify-center items-center w-full min-h-screen bg-no-repeat bg-center bg-cover bg-[#A179DC] xl:bg-[url('/images/bg-populaClass.png')] px-4 py-12 pt-24">
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
                    {visibleCards.length === 0 ? (
                        <p className="text-white text-lg mt-10">ไม่พบชั้นเรียน</p>
                    ) : (
                        visibleCards.map((cls) => (
                            console.log("cls:", cls),
                            <div onClick={() => handleClick(cls.id)} key={cls.id} className="cursor-pointer">
                                <Card className="w-full sm:w-[22rem] flex flex-col justify-between h-full">
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
                                            <div>{cls.description}</div>
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
                                                src={cls.owner.img || "/images/unknown.png"}
                                                width={28}
                                                height={28}
                                                alt="User"
                                            />
                                            {cls.owner.name}
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={prevPage}
                        disabled={page === 0}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        type="button"
                        onClick={nextPage}
                        disabled={(page + 1) * pageSize >= classes.length}
                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                    >
                        ถัดไป
                    </button>
                </div>
            </div>
        </section>
    );
}
