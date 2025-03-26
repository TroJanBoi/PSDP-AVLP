"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Class {
  id: string;
  name: string;
  likes: number;
}

const ProfilePage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [attendedClasses, setAttendedClasses] = useState<Class[]>([]);
  const [viewedClasses, setViewedClasses] = useState<Class[]>([]);
  const [showAlert, setShowAlert] = useState<{ platform: 'github' | 'youtube'; message: string } | null>(null);

  useEffect(() => {
    if (session && session.accessToken) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes/attended`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setAttendedClasses(data.classes || []))
        .catch(() => setAttendedClasses([]));

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes/viewed`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setViewedClasses(data.classes || []))
        .catch(() => setViewedClasses([]));
    }
  }, [session]);

  const handleAlert = (platform: 'github' | 'youtube') => {
    if (session?.user) {
      if (platform === 'github' && !session.user.github) {
        setShowAlert({ platform, message: 'User has not added Github link!' });
      } else if (platform === 'youtube' && !session.user.youtube) {
        setShowAlert({ platform, message: 'User has not added Youtube link!' });
      }
      
      // Hide the alert after 2 seconds (2000 milliseconds)
      setTimeout(() => {
        setShowAlert(null);
      }, 2000);
    }
  };

  const handleEdit = () => {
    router.push('/edit-profile');
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (!session || !session.user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#a394f9] p-4 flex justify-between items-center">
        <div className="text-2xl font-bold">Logo</div>
        <nav className="space-x-4 flex items-center">
          <a href="/" className="text-black">Home</a>
          <a href="#" className="text-black">Class</a>
          <a href="#" className="text-black">Contact</a>
          <img src={session?.user?.image || "/default-profile.png"} alt="Profile" className="w-10 h-10 rounded-full ml-4" />
        </nav>
      </header>
      <div className="flex flex-col items-center p-6">
        <div className="w-full max-w-4xl flex space-x-6">
          <div className="w-1/2 bg-transparent p-6">
            <div className="relative">
              <div className="h-40 bg-gradient-to-r from-green-400 to-blue-500 rounded-t-lg"></div>
              <img src={session?.user?.image || "/default-profile.png"} alt="Profile" className="absolute -bottom-12 left-6 w-24 h-24 rounded-full bg-gray-300 border-4 border-white" />
              <div className="absolute -bottom-12 left-36 flex items-center justify-end w-3/5">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-gray-600 mr-4">Online</span>
                <button onClick={handleEdit} className="bg-purple-200 text-black py-2 px-4 rounded">Edit</button>
              </div>
            </div>
            <div className="mt-16 ml-6">
              <h1 className="text-2xl font-bold">{session?.user?.name || "Guest"}</h1>
              <p className="text-gray-600">{session?.user?.bio || "No bio available"}</p>
            </div>
            <div className="flex flex-col space-y-2 mt-6 ml-6">
              <a
                href={session?.user?.github || "#"}
                className="text-black"
                onClick={(e) => {
                  if (!session?.user?.github) {
                    e.preventDefault();
                    handleAlert("github");
                  }
                }}
              >
                Github
              </a>
              <a
                href={session?.user?.youtube || "#"}
                className="text-black"
                onClick={(e) => {
                  if (!session?.user?.youtube) {
                    e.preventDefault();
                    handleAlert("youtube");
                  }
                }}
              >
                Youtube
              </a>
            </div>
            {showAlert && (
              <div className="mt-4 p-2 bg-red-400 text-white rounded">
                {showAlert.message}
              </div>
            )}
          </div>
          <div className="w-1/2">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 mt-10">My Class</h2>
              <ul className="space-y-4">
                {attendedClasses.length > 0 ? attendedClasses.map((cls) => (
                  <li key={cls.id} className="flex justify-between p-4 bg-white rounded-lg shadow-md">
                    <span>{cls.name}</span>
                    <span className="text-red-500">{cls.likes}</span>
                  </li>
                )) : <li className="text-gray-500">No classes attended</li>}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">History</h2>
              <ul className="space-y-4">
                {viewedClasses.length > 0 ? viewedClasses.map((cls) => (
                  <li key={cls.id} className="flex justify-between p-4 bg-white rounded-lg shadow-md">
                    <span>{cls.name}</span>
                    <span className="text-red-500">{cls.likes}</span>
                  </li>
                )) : <li className="text-gray-500">No history available</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
