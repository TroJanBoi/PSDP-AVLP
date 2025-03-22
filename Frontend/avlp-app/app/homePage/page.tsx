"use client";
import Navbar from '../../components/Navbar';
import React from 'react';
import PopularClassesSection from './_components/PopulaClass';
import OverviewSection from './_components/OverviewSection';
import BenefitSection from './_components/BenefitSection';

export default function HomePage() {

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
