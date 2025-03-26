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
<<<<<<< HEAD
               <OverviewSection />
                <BenefitSection />
                <PopularClassesSection />
=======
                <div id='home-main'>
                    <OverviewSection />
                </div>
                <div id='home-benefit'>
                    <BenefitSection />
                </div>
                <div id='home-class'>
                    <PopularClassesSection />
                </div>
>>>>>>> c5b1836e7cce8517160374f0b9c2cdfab200a509
            </form>
        </div>
    );
}
