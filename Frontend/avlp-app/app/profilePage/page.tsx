import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#a394f9] p-4 flex justify-between items-center">
        <div className="text-2xl font-bold">Logo</div>
        <nav className="space-x-4 flex items-center">
          <a href="#" className="text-black">Home</a>
          <a href="#" className="text-black">Class</a>
          <a href="#" className="text-black">Contact</a>
          <div className="w-10 h-10 rounded-full bg-gray-300 ml-4"></div>
        </nav>
      </header>
      <div className="flex flex-col items-center p-6">
        <div className="w-full max-w-4xl flex space-x-6">
          <div className="w-1/2 bg-transparent p-6">
            <div className="relative">
              <div className="h-40 bg-gradient-to-r from-green-400 to-blue-500 rounded-t-lg"></div>
              <div className="absolute -bottom-12 left-6 w-24 h-24 rounded-full bg-gray-300 border-4 border-white"></div>
              <div className="absolute -bottom-12 left-36 flex items-center justify-end w-3/5">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-gray-600 mr-4">Online</span>
                <button className="bg-purple-200 text-black py-2 px-4 rounded">Edit</button>
              </div>
            </div>
            <div className="mt-16 ml-6">
              <h1 className="text-2xl font-bold">Peerapol Srisawat</h1>
              <p className="text-gray-600">KMITL eng 32</p>
            </div>
            <div className="flex flex-col space-y-2 mt-6 ml-6">
              <a href="#" className="text-black">Github</a>
              <a href="#" className="text-black">Youtube</a>
            </div>
          </div>
          <div className="w-1/2">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">My Class</h2>
              <ul className="space-y-4">
                <li className="flex justify-between p-4 bg-white rounded-lg shadow-md">
                  <span>Topic 3</span>
                  <span className="text-red-500">254</span>
                </li>
                <li className="flex justify-between p-4 bg-white rounded-lg shadow-md">
                  <span>Topic 2</span>
                  <span className="text-red-500">2.4K</span>
                </li>
                <li className="flex justify-between p-4 bg-white rounded-lg shadow-md">
                  <span>Topic 1</span>
                  <span className="text-red-500">18</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">History</h2>
              <ul className="space-y-4">
                <li className="flex justify-between p-4 bg-white rounded-lg shadow-md">
                  <span>Topic 3</span>
                  <span className="text-red-500">3</span>
                </li>
                <li className="flex justify-between p-4 bg-white rounded-lg shadow-md">
                  <span>Topic 2</span>
                  <span className="text-red-500">74</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

// "use client";

// import React, { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// interface Class {
//   id: string;
//   name: string;
//   likes: number;
// }

// const ProfilePage: React.FC = () => {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [attendedClasses, setAttendedClasses] = useState<Class[]>([]);
//   const [viewedClasses, setViewedClasses] = useState<Class[]>([]);

//   useEffect(() => {
//     if (session) {
//       // Fetch attended classes
//       fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes/attended`, {
//         headers: {
//           Authorization: `Bearer ${session.accessToken}`,
//         },
//       })
//         .then((res) => res.json())
//         .then((data) => setAttendedClasses(data.classes));

//       // Fetch viewed classes
//       fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes/viewed`, {
//         headers: {
//           Authorization: `Bearer ${session.accessToken}`,
//         },
//       })
//         .then((res) => res.json())
//         .then((data) => setViewedClasses(data.classes));
//     }
//   }, [session]);

//   if (status === 'loading') {
//     return <div>Loading...</div>;
//   }

//   if (!session) {
//     router.push('/login');
//     return null;
//   }

//   return (
//     <div className="font-sans">
//       <header className="flex justify-between items-center bg-purple-300 p-4">
//         <img src="your-image-link-here" alt="Logo" className="h-10" />
//         <nav className="flex items-center space-x-4">
//           <a href="#" className="text-white">Home</a>
//           <a href="#" className="text-white">Class</a>
//           <a href="#" className="text-white">Contact</a>
//           <div className="w-8 h-8">
//             <img src="notification-icon.png" alt="Notifications" className="rounded-full" />
//           </div>
//           <div className="w-8 h-8">
//             <img src={session?.user?.image} alt="Profile" className="rounded-full" />
//           </div>
//         </nav>
//       </header>
//       <main className="flex justify-between p-8">
//         <div className="w-2/3 bg-white rounded-lg shadow-lg p-6">
//           <div className="h-40 bg-gray-200 rounded-t-lg"></div>
//           <div className="text-center mt-4">
//             <div className="w-24 h-24 mx-auto rounded-full border-4 border-white -mt-12">
//               <img src={session?.user?.image} alt="Profile" className="rounded-full" />
//             </div>
//             <div className="flex justify-center items-center mt-2">
//               <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span> Online
//             </div>
//             <button className="bg-purple-300 text-white px-4 py-2 rounded mt-2">Edit</button>
//             <h1 className="text-xl font-bold mt-2">{session?.user?.name}</h1>
//             <p className="text-gray-600">KMITL eng 32</p>
//             <div className="flex justify-center space-x-4 mt-4">
//               <a href="#" className="text-black">Github</a>
//               <a href="#" className="text-black">Youtube</a>
//             </div>
//           </div>
//         </div>
//         <div className="w-1/3 space-y-6">
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-lg font-bold mb-4">My Class</h2>
//             <ul className="space-y-2">
//               {attendedClasses.map((cls) => (
//                 <li key={cls.id} className="flex justify-between border-b pb-2">
//                   <a href="#">{cls.name}</a> <span className="text-red-500">{cls.likes}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-lg font-bold mb-4">History</h2>
//             <ul className="space-y-2">
//               {viewedClasses.map((cls) => (
//                 <li key={cls.id} className="flex justify-between border-b pb-2">
//                   <a href="#">{cls.name}</a> <span className="text-red-500">{cls.likes}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ProfilePage;