"use client";
import Navbar from '../../components/Navbar';
import React from 'react';
import PopularClassesSection from './_components/PopulaClass';
import OverviewSection from './_components/OverviewSection';
import BenefitSection from './_components/BenefitSection';
import { useSession } from 'next-auth/react';
export default function HomePage() {
    const { data: session, status } = useSession();
    console.log("session", session);
    console.log("status", status);
    if (status === "loading") {
        return <div>Loading...</div>;
    }
    if (status === "unauthenticated") {
        return <div>Unauthenticated</div>;
    }
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <form action="">
               <OverviewSection />
                <BenefitSection />
                <PopularClassesSection />
            </form>
        </div>
    );
}
