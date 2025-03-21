"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import TopicOne from "/images/topic-1.jpg";
import TwoMainPicture from "/images/2-main.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

const classesData = [
    { id: 1, image: TopicOne, title: "Topic 1" },
    { id: 2, image: TwoMainPicture, title: "Topic 2" },
    { id: 3, image: TwoMainPicture, title: "Topic 3" },
    { id: 4, image: TwoMainPicture, title: "Topic 4" },
    { id: 5, image: TwoMainPicture, title: "Topic 5" },
    { id: 6, image: TwoMainPicture, title: "Topic 6" },
];

export default function AllClass() {

    const [startIndex, setStartIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(4);
    const total = classesData.length;

    useEffect(() => {
        const handleResize = () => {
            if (window.innerHeight > window.innerWidth) {
                setVisibleCount(2);
            } else {
                setVisibleCount(4);
            }
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlePrev = () => {
        setStartIndex((prev) => Math.max(prev - visibleCount, 0));
    };

    const handleNext = () => {
        setStartIndex((prev) =>
            Math.min(prev + visibleCount, total - visibleCount)
        );
    };

    const visibleCards = classesData.slice(startIndex, startIndex + visibleCount);
    return (
        <section className="my-12">
            <div className="flex flex-col items-center">
                <p className="text-4xl font-bold">All Class</p>
            </div>
            <div className="relative">
                <div className="flex flex-row w-full justify-around items-center gap-4 mt-12 mb-12">
                    {total > visibleCount && startIndex > 0 && (
                        <button
                            onClick={handlePrev}
                            className="absolute top-1/2 left-0 xl:ml-10 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-secondary"
                        >
                            <ChevronLeft className="h-10 w-10" /> Prev

                        </button>
                    )}
                </div>
                <div className="flex flex-row justify-around gap-4 mt-12 mb-12">
                    {total > visibleCount && startIndex + visibleCount < total && (
                        <button
                            onClick={handleNext}
                            className="absolute top-1/2 right-0 transform -translate-y-1/2 xl:-translate-x-12 bg-gray-800 text-white px-4 py-2 rounded hover:bg-secondary"
                        >
                            <ChevronRight className="h-10 w-10" />
                            Next
                        </button>
                    )}
                </div>
            </div>

            <div className="relative">
                <div className="flex flex-row justify-around gap-4 mt-12 mb-12">
                    {visibleCards.map((cls) => (
                        <Card key={cls.id} className="w-[400px] h-fit">
                            <CardHeader>
                                <Image
                                    src={cls.image}
                                    alt="img"
                                    className="object-cover w-full h-full"
                                />
                            </CardHeader>
                            <CardFooter>
                                <p className="text-4xl">{cls.title}</p>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

        </section>
    );
}
