"use client";
import Navbar from '../../components/Navbar';
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <form action="">
                <section className="flex justify-center xl:justify-around items-center w-full h-[100vh] xl:px-48 bg-center bg-no-repeat bg-cover bg-[url('/images/background-homePage.png')]">
                    <div className="flex flex-col justify-center items-base w-1/2 ">
                        <div className="space-y-4">
                            <h1 className="text-black text-7xl font-bold">
                                Assembly Virtual
                                Learning
                            </h1>
                            <p className="text-black text-2xl">
                                is an online platform for learning assembly language with
                                interactive exercises. It helps users understand low-level
                                programming
                            </p>
                        </div>
                        <div className="flex mt-10">
                            <Link href="/" className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                                <span className="text-2xl relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                    Get Started !
                                </span>
                            </Link>
                        </div>
                    </div>
                    <div className="hidden xl:flex flex-col justify-center items-center">
                        <Image src="/images/homePage.png" alt="image home-page" width={924} height={924} />
                    </div>
                </section>
                {/* section */}
                <section className="flex flex-col justify-center items-center bg-background w-screen h-screen">
                    <div className="space-y-12 text-center">
                        <h1 className="text-5xl font-bold text-primary">Why Assembly Virtual Learning Platform?</h1>
                        <div className="flex justify-center items-center space-x-4">
                            <input type="text" className="text-xl w-1/2 p-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block  ps-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for over 100+ Classes" />
                            <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                                <span className="sr-only">Search</span>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="hidden xl:flex flex-col justify-center items-center">
                            <Image src="/images/search.png" alt="image home-page" width={660} height={660} />
                        </div>
                        <div className="grid grid-cols-1 grid-rows-4 justify-center items-center">
                            <div className='text-5xl font-semibold'>
                                <span className='text-primary'> Benefit </span> From Our Online Learning
                            </div>
                            <div className="flex">
                                <div>
                                    a
                                </div>
                                <div className='flex flex-col'>
                                    <div>
                                        a1
                                    </div>
                                    <div>
                                        a2
                                    </div>
                                </div>
                            </div>
                            <div>
                                2
                            </div>
                            <div>
                                3
                            </div>
                        </div>
                    </div>
                </section>
            </form>
        </div>
    );
}
