import Link from "next/link";
import BtnSignIn from "./_components/BtnSignIn";


export default function Login() {

    return (
        <div className="flex justify-center items-center h-screen w-screen bg-primary">
            <div className="relative bg-cover bg-center w-1/2 h-full">

            </div>
            <div className="relative flex flex-col justify-center items-center bg-background w-1/2 h-full rounded-l-3xl drop-shadow-lg gap-5">
                <div className="mb-16">
                    <div className="rounded-full bg-secondary w-40 h-40 flex justify-center items-center">
                        <h1 className="text-textbase">LOGO</h1>
                    </div>
                </div>
                <div className="flex flex-col gap-5 justify-center items-center w-3/4">
                    <div className="border-b-2 w-4/5 text-center border-primary">
                        <h1 className="text-3xl font-bold text-accent">Sign In</h1>
                    </div>
                    <div className="w-3/4 mt-4">
                        <form action="">
                            <div className="flex items-center text-xl bg-gray-800 text-white px-4 py-2 rounded-lg w-full">
                                <svg className="mr-4" width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 8.5C6.9 8.5 5.95833 8.10833 5.175 7.325C4.39167 6.54167 4 5.6 4 4.5C4 3.4 4.39167 2.45833 5.175 1.675C5.95833 0.891667 6.9 0.5 8 0.5C9.1 0.5 10.0417 0.891667 10.825 1.675C11.6083 2.45833 12 3.4 12 4.5C12 5.6 11.6083 6.54167 10.825 7.325C10.0417 8.10833 9.1 8.5 8 8.5ZM0 16.5V13.7C0 13.1333 0.146 12.6127 0.438 12.138C0.73 11.6633 1.11733 11.3007 1.6 11.05C2.63333 10.5333 3.68333 10.146 4.75 9.888C5.81667 9.63 6.9 9.50067 8 9.5C9.1 9.49933 10.1833 9.62867 11.25 9.888C12.3167 10.1473 13.3667 10.5347 14.4 11.05C14.8833 11.3 15.271 11.6627 15.563 12.138C15.855 12.6133 16.0007 13.134 16 13.7V16.5H0ZM2 14.5H14V13.7C14 13.5167 13.9543 13.35 13.863 13.2C13.7717 13.05 13.6507 12.9333 13.5 12.85C12.6 12.4 11.6917 12.0627 10.775 11.838C9.85833 11.6133 8.93333 11.5007 8 11.5C7.06667 11.4993 6.14167 11.612 5.225 11.838C4.30833 12.064 3.4 12.4013 2.5 12.85C2.35 12.9333 2.229 13.05 2.137 13.2C2.045 13.35 1.99933 13.5167 2 13.7V14.5ZM8 6.5C8.55 6.5 9.021 6.30433 9.413 5.913C9.805 5.52167 10.0007 5.05067 10 4.5C9.99933 3.94933 9.80367 3.47867 9.413 3.088C9.02233 2.69733 8.55133 2.50133 8 2.5C7.44867 2.49867 6.978 2.69467 6.588 3.088C6.198 3.48133 6.002 3.952 6 4.5C5.998 5.048 6.194 5.519 6.588 5.913C6.982 6.307 7.45267 6.50267 8 6.5Z" fill="#EEEEEE" />
                                </svg>
                                <input type="text" placeholder="Username" className="bg-transparent outline-none text-white w-full h-8 placeholder-white" />
                            </div>
                            <div className="w-full mt-4">
                                <div className="flex items-center text-xl bg-gray-800 text-white px-4 py-2 rounded-lg w-full">
                                    <svg className="mr-3" width="22" height="13" viewBox="0 0 22 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 9.5C6.83333 9.5 7.54167 9.20833 8.125 8.625C8.70833 8.04167 9 7.33333 9 6.5C9 5.66667 8.70833 4.95833 8.125 4.375C7.54167 3.79167 6.83333 3.5 6 3.5C5.16667 3.5 4.45833 3.79167 3.875 4.375C3.29167 4.95833 3 5.66667 3 6.5C3 7.33333 3.29167 8.04167 3.875 8.625C4.45833 9.20833 5.16667 9.5 6 9.5ZM6 12.5C4.33333 12.5 2.91667 11.9167 1.75 10.75C0.583333 9.58333 0 8.16667 0 6.5C0 4.83333 0.583333 3.41667 1.75 2.25C2.91667 1.08333 4.33333 0.5 6 0.5C7.35 0.5 8.52933 0.883333 9.538 1.65C10.5467 2.41667 11.2507 3.36667 11.65 4.5H20.025L22 6.475L18.5 10.475L16 8.5L14 10.5L12 8.5H11.65C11.2333 9.7 10.5083 10.6667 9.475 11.4C8.44167 12.1333 7.28333 12.5 6 12.5Z" fill="#EEEEEE" />
                                    </svg>

                                    <input type="password" placeholder="Password" className="bg-transparent outline-none text-white w-full h-8 placeholder-white" />
                                </div>
                                <div className="flex justify-between items-center mt-2 text-xl">
                                    <label className="flex items-center text-gray-500">
                                        <input type="checkbox" className="mr-1 accent-teal-500" />
                                        <span className="text-accent cursor-pointer">remember</span>
                                    </label>
                                    <Link href="#" className="text-accent hover:underline">forgot password?</Link>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center w-full mt-10">
                                <BtnSignIn />
                                <div className="text-xl text-accent mt-2">
                                    <h1>Don't have an account? <Link href={"#"} className="hover:underline">Sign Up</Link></h1>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2 w-4/5">
                        <div className="w-full border-b-2 border-primary">
                        </div>
                        <div>
                            <h1 className="text-xl text-accent">or</h1>
                        </div>
                        <div className="w-full border-b-2 border-primary">
                        </div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2 w-3/4">
                        <button className="bg-primary text-textbase w-full rounded-md py-2 px-4 text-center">
                            <h1 className="flex items-center justify-center gap-2 text-xl">
                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 12.5C5.99856 13.9165 6.49829 15.2877 7.41074 16.3712C8.32318 17.4546 9.58951 18.1802 10.9856 18.4197C12.3816 18.6592 13.8174 18.397 15.0388 17.6797C16.2601 16.9623 17.1883 15.836 17.659 14.5H12V10.5H21.805V14.5H21.8C20.873 19.064 16.838 22.5 12 22.5C6.477 22.5 2 18.023 2 12.5C2 6.977 6.477 2.5 12 2.5C13.6345 2.49884 15.2444 2.89875 16.6883 3.66467C18.1323 4.43058 19.3662 5.5391 20.282 6.893L17.004 9.188C16.2924 8.11241 15.2532 7.29473 14.0404 6.85617C12.8275 6.4176 11.5057 6.38149 10.2707 6.75319C9.03579 7.12488 7.95347 7.88461 7.18421 8.91974C6.41495 9.95487 5.9997 11.2103 6 12.5Z" fill="#EEEEEE" />
                                </svg>
                                Continue with Google
                            </h1>
                        </button>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2 w-3/4">
                        <button className="bg-primary text-textbase w-full rounded-md py-2 px-4 text-center">
                            <h1 className="flex items-center justify-center gap-2 text-xl">
                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 0.5C8.68678 0.5 7.38642 0.758658 6.17317 1.2612C4.95991 1.76375 3.85752 2.50035 2.92893 3.42893C1.05357 5.3043 0 7.84784 0 10.5C0 14.92 2.87 18.67 6.84 20C7.34 20.08 7.5 19.77 7.5 19.5V17.81C4.73 18.41 4.14 16.47 4.14 16.47C3.68 15.31 3.03 15 3.03 15C2.12 14.38 3.1 14.4 3.1 14.4C4.1 14.47 4.63 15.43 4.63 15.43C5.5 16.95 6.97 16.5 7.54 16.26C7.63 15.61 7.89 15.17 8.17 14.92C5.95 14.67 3.62 13.81 3.62 10C3.62 8.89 4 8 4.65 7.29C4.55 7.04 4.2 6 4.75 4.65C4.75 4.65 5.59 4.38 7.5 5.67C8.29 5.45 9.15 5.34 10 5.34C10.85 5.34 11.71 5.45 12.5 5.67C14.41 4.38 15.25 4.65 15.25 4.65C15.8 6 15.45 7.04 15.35 7.29C16 8 16.38 8.89 16.38 10C16.38 13.82 14.04 14.66 11.81 14.91C12.17 15.22 12.5 15.83 12.5 16.76V19.5C12.5 19.77 12.66 20.09 13.17 20C17.14 18.66 20 14.92 20 10.5C20 9.18678 19.7413 7.88642 19.2388 6.67317C18.7362 5.45991 17.9997 4.35752 17.0711 3.42893C16.1425 2.50035 15.0401 1.76375 13.8268 1.2612C12.6136 0.758658 11.3132 0.5 10 0.5Z" fill="#EEEEEE" />
                                </svg>
                                Continue with Github
                            </h1>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}