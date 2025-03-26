"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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

interface ProblemType {
  id: number;
  title: string;
  likes: number;
  difficulty?: string;
  status?: "Not Started" | "In Progress" | "Completed";
}

// Mock class data
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
            img: "/images/patipan.jpg"
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

// Mock problems data
const mockProblems: { [key: string]: ProblemType[] } = {
    "1": [
        { id: 1, title: "Add Two Numbers", likes: 10, difficulty: "Easy", status: "Not Started" },
        { id: 2, title: "Loop Counter", likes: 5, difficulty: "Medium", status: "Not Started" },
        { id: 3, title: "Register Swap", likes: 8, difficulty: "Easy", status: "In Progress" }
    ],
    "2": [
        { id: 4, title: "Multiply Two Numbers", likes: 12, difficulty: "Medium", status: "Not Started" },
        { id: 5, title: "Divide with Remainder", likes: 7, difficulty: "Hard", status: "Not Started" },
        { id: 6, title: "Subtract and Compare", likes: 3, difficulty: "Easy", status: "Completed" }
    ],
    "3": [
        { id: 7, title: "Conditional Branching", likes: 15, difficulty: "Medium", status: "Not Started" },
        { id: 8, title: "Loop with Jumps", likes: 9, difficulty: "Hard", status: "In Progress" },
        { id: 9, title: "Nested Loops", likes: 4, difficulty: "Hard", status: "Not Started" }
    ],
    "4": [
        { id: 10, title: "Stack Push/Pop", likes: 6, difficulty: "Medium", status: "Not Started" },
        { id: 11, title: "Memory Addressing", likes: 8, difficulty: "Hard", status: "Not Started" },
        { id: 12, title: "Pointer Operations", likes: 5, difficulty: "Medium", status: "Completed" }
    ],
    "5": [
        { id: 13, title: "System Call Example", likes: 20, difficulty: "Hard", status: "Not Started" },
        { id: 14, title: "Interrupt Handling", likes: 15, difficulty: "Hard", status: "In Progress" },
        { id: 15, title: "Optimization Challenge", likes: 10, difficulty: "Expert", status: "Not Started" }
    ],
    "6": [
        { id: 16, title: "Hello World in Assembly", likes: 3, difficulty: "Easy", status: "Not Started" },
        { id: 17, title: "Basic Register Use", likes: 2, difficulty: "Easy", status: "Not Started" },
        { id: 18, title: "Simple Loop", likes: 1, difficulty: "Easy", status: "Completed" }
    ],
    "7": [
        { id: 19, title: "Jump Table", likes: 7, difficulty: "Medium", status: "Not Started" },
        { id: 20, title: "Conditional Loop", likes: 5, difficulty: "Medium", status: "In Progress" },
        { id: 21, title: "Switch Statement", likes: 4, difficulty: "Hard", status: "Not Started" }
    ],
    "8": [
        { id: 22, title: "LED Control", likes: 12, difficulty: "Hard", status: "Not Started" },
        { id: 23, title: "Timer Interrupt", likes: 8, difficulty: "Hard", status: "Not Started" },
        { id: 24, title: "GPIO Programming", likes: 6, difficulty: "Medium", status: "In Progress" }
    ]
};

// Mock createProblemAttempt function
const mockCreateProblemAttempt = async (problemId: number, userId: number) => {
    console.log(`Mock: Created problem attempt for problem ${problemId} by user ${userId}`);
    return { success: true }; // Simulate a successful response
};

export default function ClassDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [classData, setClassData] = useState<ClassType | null>(null);
    const [problems, setProblems] = useState<ProblemType[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Mock fetch class data
        const fetchData = () => {
            const found = mockClasses.find((cls) => String(cls.id) === String(id));
            if (!found) {
                setError("Class not found");
                return;
            }
            setClassData(found);
        };

        // Mock fetch problems data
        const fetchProblems = () => {
            if (!session) {
                setError("Please log in to view problems");
                return;
            }

            const classProblems = mockProblems[id as string] || [];
            setProblems(classProblems);
        };

        fetchData();
        fetchProblems();
    }, [id, session]);

    if (!classData) return null;

    return (
        <div className="flex flex-col items-center min-h-screen w-full bg-[url('/images/bg-showClass.png')] bg-cover bg-center bg-no-repeat text-black">
            <Navbar classId={classData.id} Topic={classData.topic} />
            <div className="flex flex-col items-center w-full px-6 mt-8 space-y-10">
                <div className="w-full max-w-4xl space-y-6">
                    <div className="overflow-hidden rounded-lg w-full h-[350px] shadow-lg">
                        <Image
                            src={classData.img} // Use static path from mock data
                            width={800}
                            height={400}
                            alt={classData.topic}
                            className="rounded-lg object-cover w-full h-full object-center"
                        />
                    </div>
                    <h1 className="text-4xl font-bold text-black">{classData.topic}</h1>
                    <p className="text-black text-lg">{classData.description}</p>
                </div>
                <div className="w-full max-w-4xl text-left">
                    <h2 className="text-2xl font-semibold text-black mb-4">Problems</h2>
                    {problems.length === 0 ? (
                        <p className="text-gray-500">No problems available for this class</p>
                    ) : (
                        <div className="space-y-3">
                            {problems.map((problem) => (
                                <button
                                    key={problem.id}
                                    onClick={async () => {
                                        try {
                                            const userId = Number(session?.user?.id) || 1; // Mock userId if session is unavailable
                                            if (!userId) {
                                                alert("กรุณาเข้าสู่ระบบก่อน");
                                                return;
                                            }

                                            await mockCreateProblemAttempt(problem.id, userId);
                                            router.push(`/AssemblyFlow/${problem.id}`);
                                        } catch (error: any) {
                                            alert("เริ่มโจทย์ไม่สำเร็จ: " + error);
                                        }
                                    }}
                                    className="w-full flex flex-col sm:flex-row justify-between sm:items-center border border-gray-300 rounded-lg p-4 bg-white hover:bg-gray-50 transition text-left"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-red-500 text-xl">❓</span>
                                        <div>
                                            <p className="font-medium text-lg">{problem.title}</p>
                                            <p className="text-sm text-gray-500">{problem.difficulty || "Easy"} ・ {problem.status || "Not Started"}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}