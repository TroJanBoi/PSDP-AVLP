import Image from "next/image";
import { BookOpen, Code2, GraduationCap } from 'lucide-react';

export default function BenefitSection() {
    return (
        <section className="flex flex-col justify-center items-center bg-background w-screen h-[100vh]">
            <div className="flex flex-col justify-center items-center space-y-5 text-center">
                <h1 className="text-4xl xl:text-5xl font-bold text-primary">Why Assembly Virtual Learning Platform?</h1>
                <div className="flex justify-center items-center space-x-4 w-1/2">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                            <span className="sr-only">Search</span>
                        </div>
                        <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-lg" placeholder="Search for over 100+ Classes" />
                    </div>
                    <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-purple-400 rounded-lg border border-purple-400 hover:bg-purple-500 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 shadow-xl">
                        Search
                    </button>
                </div>
            </div>
            <div className="flex flex-col xl:grid xl:grid-cols-2 gap-4">
                <div className="hidden xl:flex flex-col justify-center items-center">
                    <Image src="/images/search.png" alt="image home-page" width={660} height={660} />
                </div>
                <div className="grid grid-cols-1 grid-rows-4 justify-center items-center xl:space-y-0 space-y-5">
                    <div className='text-4xl xl:text-5xl font-semibold'>
                        <span className='text-[#FF8DA6]'> Benefit </span> From Our Online Learning
                    </div>
                    <div className="flex space-x-10">
                        <div className="flex flex-col justify-center items-center">
                            <div className="w-20 h-20 xl:w-24 xl:h-24 bg-primary rounded-full flex items-center justify-center">
                                <GraduationCap className="text-white w-12 h-12 xl:w-14 xl:h-14" />
                            </div>
                        </div>
                        <div className='flex flex-col space-y-2'>
                            <div className='text-2xl xl:text-4xl font-semibold'>
                                <h1>Online Learning</h1>
                            </div>
                            <div className='text-md lg:text-lg text-gray-500'>
                                <h1>Learn anytime, anywhere with interactive <br /> courses and virtual classrooms. 🚀🎓</h1>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-10">
                        <div className="flex flex-col justify-center items-center">
                            <div className="w-20 xl:w-24 h-20 xl:h-24 bg-[#FF8DA6] rounded-full flex items-center justify-center">
                                <BookOpen className="text-white w-10 h-10 xl:w-12 xl:h-12" />
                            </div>
                        </div>
                        <div className='flex flex-col space-y-2'>
                            <div className='text-2xl xl:text-4xl font-semibold'>
                                <h1>Drag-and-Drop Blocks</h1>
                            </div>
                            <div className='text-md lg:text-lg text-gray-500'>
                                <h1>Easily grasp programming using a visual, block-based  <br /> approach. No coding experience needed—just drag, drop, and build! 🚀💻</h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-10">
                        <div className="flex flex-col justify-center items-center">
                            <div className="w-20 h-20 xl:w-24 xl:h-24 bg-primary rounded-full flex items-center justify-center">
                                <Code2 className="text-white w-12 h-12 xl:w-14 xl:h-14" />
                            </div>
                        </div>
                        <div className='flex flex-col space-y-2'>
                            <div className='text-2xl xl:text-4xl font-semibold'>
                                <h1>Real-Time Code Execution</h1>
                            </div>
                            <div className='text-md xl:text-lg text-gray-500'>
                                <h1>See instant results as you build and run assembly code with live feedback.  <br /> Learn by doing in an interactive coding environment! 🚀💻</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

}