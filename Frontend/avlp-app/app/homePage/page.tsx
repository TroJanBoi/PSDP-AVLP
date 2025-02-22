import SubNavbar from "@/components/subnavbar";
import NavbarComponent from "../../components/navbar";
import Footer from "@/components/footer";
import Image from 'next/image';
import OneMainPicture from "/images/1-main.jpg";
import TwoMainPicture from "/images/2-main.png";
import ThreeMainPicture from "/images/3-main.png";
import AllClass from "./_components/AllClass";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarComponent />
      <SubNavbar />
      <main className="flex flex-col flex-grow justify-center">
        <div>
          <h1 className="text-4xl font-bold text-center">Welcome to Assembly Virtual Learing</h1>
          <p className="text-center">This is the homepage of AVLP is an online platform for learning assembly language with interactive exercises. It helps users understand low-level programming</p>
        </div>
        <div className="flex flex-row justify-center mt-12 gap-4 mb-12 p-4">
          <div className="w-96 h-w-96">
            <Image
              src={OneMainPicture}
              className="object-cover w-full h-full bg-center bg-no-repeat shadow-xl"
              alt="img"
            />
          </div>
          <div className="w-96 h-w-96">
            <Image
              src={TwoMainPicture}
              className="object-cover w-full h-full bg-center bg-no-repeat shadow-xl"
              alt="img"
            />
          </div>
          <div className="w-96 h-w-96">
            <Image
              src={ThreeMainPicture}
              className="object-cover w-full h-full bg-center bg-no-repeat shadow-xl"
              alt="img"
            />
          </div>
        </div>
        <div className="px-4">
          <AllClass />
        </div>
      </main>
      <Footer />
    </div>
  );
}
