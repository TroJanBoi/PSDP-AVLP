import Link from "next/link";
import Image from "next/image";

export default function OverviewSection() {
    return (
        <section className="flex flex-col-reverse lg:flex-row justify-center items-center w-full min-h-screen px-6 lg:px-20 xl:px-48 py-16 bg-center bg-no-repeat bg-cover bg-[url('/images/bg-homePage-respon.png')] xl:bg-[url('/images/background-homePage.png')]">
            
            {/* Left Content */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-6">
                <h1 className="text-black text-4xl md:text-5xl xl:text-7xl font-bold leading-tight">
                    Assembly Virtual Learning
                </h1>
                <p className="text-black text-lg md:text-xl xl:text-2xl">
                    is an online platform for learning assembly language with
                    interactive exercises. It helps users understand low-level programming.
                </p>
                <div className="mt-6">
                    <Link
                        href="/"
                        className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
                    >
                        <span className="text-lg md:text-xl px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                            Get Started!
                        </span>
                    </Link>
                </div>
            </div>

            {/* Right Image */}
            <div className="lg:flex hidden w-full lg:w-1/2 justify-center items-center mb-10 lg:mb-0">
                <Image
                    src="/images/homePage.png"
                    alt="image home-page"
                    width={600}
                    height={600}
                    className="w-full max-w-[400px] md:max-w-[500px] lg:max-w-[600px] h-auto"
                />
            </div>
        </section>
    );
}
