"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getAllClass, getProblemsByClassId } from "@/services/api";
import { createProblemAttempt } from "@/services/api";

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

export default function ClassDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [classData, setClassData] = useState<ClassType | null>(null);
  const [problems, setProblems] = useState<ProblemType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allClasses = await getAllClass();
        const found = allClasses.find((cls: ClassType) => String(cls.id) === String(id));
        if (!found) {
          setError("Class not found");
        }
        setClassData(found || null);
      } catch (err) {
        setError("Failed to load class data");
      }
    };

    const fetchProblems = async () => {
      const token = session?.accessToken;
      if (!token || !id) {
        setError("Please log in to view problems");
        return;
      }

      try {
        const data = await getProblemsByClassId(id as string, token);
        // ปรับข้อมูลให้ตรงกับ ProblemType
        const formattedProblems = data.map((problem: any) => ({
          id: problem.id,
          title: problem.title,
          likes: problem.likes || 0, // กำหนด default ถ้าไม่มี likes
          difficulty: problem.difficulty || "Easy", // กำหนด default
          status: problem.status || "Not Started", // กำหนด default
        }));
        setProblems(formattedProblems);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setProblems([]); // ถ้า 404 ให้แสดงว่าไม่มีโจทย์
        } else {
          setError("Failed to load problems");
        }
      }
    };

    fetchData();
    fetchProblems();
  }, [id, session]);

  if (!classData) return null;

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-[url('/images/bg-showClass.png')] bg-cover bg-center bg-no-repeat text-black">
      <Navbar Topic={true} />
      <div className="flex flex-col items-center w-full px-6 mt-8 space-y-10">
        <div className="w-full max-w-4xl space-y-6">
          <div className="overflow-hidden rounded-lg w-full h-[350px] shadow-lg">
            <Image
              src={`http://localhost:9898${classData.img}`}
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
                    const userId = Number(session?.user?.id); // Convert user.id to a number
                    console.log("userId", userId);
                    if (!userId) {
                      alert("กรุณาเข้าสู่ระบบก่อน");
                      return;
                    }
            
                    await createProblemAttempt(problem.id, userId);
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