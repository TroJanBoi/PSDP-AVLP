"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Link as LinkIcon, 
  Palette, 
  Bell, 
  Edit2, 
  Sun,
  Moon,
  X  
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import ProfileNavbar from '../../components/ProfileNavbar';
import Image from 'next/image';

const UserProfilePage: React.FC = () => {
  // สถานะเก็บแท็บที่กำลังเปิดอยู่
  const [activeTab, setActiveTab] = useState('Profile');
  // สถานะธีมปัจจุบัน
  const [theme, setTheme] = useState('light');
  
  // ดึงข้อมูล session
  const { data: session, status } = useSession();

  // สถานะเก็บข้อมูลผู้ใช้
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    email: '',
    image: session?.user?.image || '/images/unknown.png'
  });

  // อัพเดทข้อมูลผู้ใช้เมื่อ session เปลี่ยน
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // แยกชื่อและนามสกุลจากชื่อผู้ใช้
      const nameParts = session.user.name?.split(' ') || [];
      setUserProfile(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: session.user?.email || '',
        image: session.user?.image || prev.image
      }));
    }
  }, [session, status]);

  const renderContent = () => {
    switch(activeTab) {
      // เนื้อหาแท็บ Profile
      case 'Profile':
        return (
          <div className="bg-[#cdc1ff] rounded-lg p-4 md:p-6 shadow-md text-black">
            <h2 className="text-xl md:text-2xl font-bold text-black border-b-2 border-black pb-2 mb-4">Profile</h2>
            {/* เลย์เอาต์กริดสำหรับกรอกชื่อและนามสกุล */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ช่องกรอกชื่อ */}
              <div>
                <label htmlFor="firstName" className="block text-xs md:text-sm font-medium text-black mb-2">First Name :</label>
                <input 
                  id="firstName"
                  type="text" 
                  value={userProfile.firstName}
                  onChange={(e) => setUserProfile(prev => ({...prev, firstName: e.target.value}))}
                  placeholder="Enter first name" 
                  className="w-full rounded-md p-1 md:p-2 text-sm"
                />
              </div>
              {/* ช่องกรอกนามสกุล */}
              <div>
                <label htmlFor="lastName" className="block text-xs md:text-sm font-medium text-black mb-2">Last Name :</label>
                <input 
                  id="lastName"
                  type="text" 
                  value={userProfile.lastName}
                  onChange={(e) => setUserProfile(prev => ({...prev, lastName: e.target.value}))}
                  placeholder="Enter last name" 
                  className="w-full rounded-md p-1 md:p-2 text-sm"
                />
              </div>
            </div>
            {/* ช่องกรอกประวัติส่วนตัวพร้อมจำกัดความยาว */}
            <div className="mt-4">
              <label htmlFor="bio" className="block text-xs md:text-sm font-medium text-black mb-2">Bio :</label>
              <textarea 
                id="bio"
                maxLength={138} 
                value={userProfile.bio}
                onChange={(e) => setUserProfile(prev => ({...prev, bio: e.target.value}))}
                placeholder="Write your bio (138 characters max)" 
                className="w-full rounded-md p-1 md:p-2 text-sm"
              />
            </div>
          </div>
        );
      
      // เนื้อหาแท็บ Account
      case 'Account':
        return (
          <div className="bg-[#cdc1ff] rounded-lg p-4 md:p-6 shadow-md text-black">
            <h2 className="text-xl md:text-2xl font-bold text-black border-b-2 border-black pb-2 mb-4">Account</h2>
            {/* ช่องกรอกอีเมลพร้อมปุ่มแก้ไข */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-xs md:text-sm font-medium text-black mb-2">Email :</label>
              <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                <input 
                  id="email"
                  type="email" 
                  value={userProfile.email}
                  onChange={(e) => setUserProfile(prev => ({...prev, email: e.target.value}))}
                  placeholder="Enter your email" 
                  className="rounded-md p-1 md:p-2 w-full md:mr-4 text-sm"
                />
                <button className="flex items-center text-white bg-[#a593f5] rounded-md p-1 md:p-2 hover:opacity-90 text-sm">
                  <Edit2 className="mr-1" size={16} />
                  Edit
                </button>
              </div>
            </div>
            {/* ช่องกรอกรหัสผ่านพร้อมปุ่มแก้ไข */}
            <div>
              <label htmlFor="password" className="block text-xs md:text-sm font-medium text-black mb-2">Password :</label>
              <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                <input 
                  id="password"
                  type="password" 
                  placeholder="Enter your password" 
                  className="rounded-md p-1 md:p-2 w-full md:mr-4 text-sm"
                />
                <button className="flex items-center text-white bg-[#a593f5] rounded-md p-1 md:p-2 hover:opacity-90 text-sm">
                  <Edit2 className="mr-1" size={16} />
                  Edit
                </button>
              </div>
            </div>
          </div>
        );
      
      // เนื้อหาแท็บ Link
      case 'Link':
        return (
          <div className="bg-[#cdc1ff] rounded-lg p-4 md:p-6 shadow-md text-black">
            <h2 className="text-xl md:text-2xl font-bold text-black border-b-2 border-black pb-2 mb-4">Link</h2>
            <div className="space-y-4">
              {/* วนลูปแสดงแพลตฟอร์มโซเชียลต่างๆ */}
              {[
                { name: 'Youtube', status: 'Connect', connectIcon: LinkIcon },
                { name: 'Github',  status: 'Disconnect', connectIcon: X },
                { name: 'Linkedin',  status: 'Connect', connectIcon: LinkIcon },
                { name: 'Discord', status: 'Connect', connectIcon: LinkIcon }
              ].map((platform) => (
                <div key={platform.name} className="flex items-center">
                  <div className="w-full">
                    <label 
                      htmlFor={platform.name.toLowerCase()} 
                      className="block text-xs md:text-sm font-medium text-black mb-2"
                    >
                      {platform.name} :
                    </label>
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                      {/* ช่องกรอก URL สำหรับแต่ละแพลตฟอร์ม */}
                      <input 
                        id={platform.name.toLowerCase()}
                        type="url" 
                        placeholder={`Enter ${platform.name} url`} 
                        className="w-full rounded-md p-1 md:p-2 text-sm mb-2 md:mb-0"
                      />
                      {/* ปุ่มเชื่อมต่อ/ยกเลิกการเชื่อมต่อแบบไดนามิก */}
                      <button 
                        className={`flex items-center w-full md:w-36 justify-center text-white text-sm ${
                          platform.status === 'Connect' 
                            ? 'bg-[#a593f5]' 
                            : 'bg-[#979594]'
                        } rounded-md p-1 md:p-2`}
                      >
                        {React.createElement(platform.connectIcon, { className: "mr-2", size: 16, color: "white" })}
                        {platform.status}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      // เนื้อหาแท็บ Theme
      case 'Themes':
        return (
          <div className="bg-[#cdc1ff] rounded-lg p-4 md:p-6 shadow-md text-black">
            <h2 className="text-xl md:text-2xl font-bold text-black border-b-2 border-black pb-2 mb-4">Themes</h2>
            <div>
              <label className="block text-xs md:text-sm font-medium text-black mb-2">Theme Selection :</label>
              <div className="flex space-x-2 md:space-x-4">
                {/* ปุ่มสลับไปธีมสว่าง */}
                <button 
                  onClick={() => setTheme('light')}
                  className={`flex items-center px-2 md:px-4 py-1 md:py-2 rounded-md text-sm ${
                    theme === 'light' ? 'bg-black text-white' : 'bg-gray-200'
                  }`}
                >
                  <Sun className="mr-1 md:mr-2" size={16} />
                  Light
                </button>
                {/* ปุ่มสลับไปธีมมืด */}
                <button 
                  onClick={() => setTheme('dark')}
                  className={`flex items-center px-2 md:px-4 py-1 md:py-2 rounded-md text-sm ${
                    theme === 'dark' ? 'bg-black text-white' : 'bg-gray-200'
                  }`}
                >
                  <Moon className="mr-1 md:mr-2" size={16} />
                  Dark
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  // หากยังไม่ได้ login ให้แสดงข้อความแทน
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex flex-col">
        <ProfileNavbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-2xl">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  // หากกำลัง load session ให้แสดง loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col">
        <ProfileNavbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-2xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    // ภาพพื้นหลัง
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat" 
      style={{ 
        backgroundImage: `url('https://img2.pic.in.th/pic/Account1ad5696c4f9aa6cb.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Navbar */}
      <ProfileNavbar />

      <div className="mt-4 md:mt-16 w-full px-2 md:px-4">
        <div className="flex flex-col md:flex-row w-full">
          {/* แถบด้านข้างซ้ายแสดงข้อมูลโปรไฟล์ */}
          <div className="w-full md:w-1/3 mb-4 md:mb-0 md:pr-8 flex justify-center md:justify-end">
            <div className="flex flex-col items-center w-full md:w-64">
              {/* รูปโปรไฟล์ */}
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full">
                <Image
                  src={userProfile.image || '/images/unknown.png'}
                  alt="Profile" 
                  width={96}
                  height={96}
                  className="rounded-full w-full h-full object-cover"
                />
              </div>
              {/* ชื่อผู้ใช้และสถานะ */}
              <h2 className="text-base md:text-xl font-bold mt-2 md:mt-3">
                {userProfile.firstName} {userProfile.lastName}
              </h2>
              <p className="text-xs md:text-sm text-gray-500 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Online
              </p>

              {/* แท็บนำทางในแถบข้างซ้าย */}
              <div className="w-full bg-[#a394f9] p-4 md:p-6 shadow-md mt-4 md:mt-6 rounded-xl">
                <div className="space-y-2">
                  {/* วนลูปสร้างปุ่มแท็บต่างๆ */}
                  {[
                    { name: 'Profile', icon: User },
                    { name: 'Account', icon: Settings },
                    { name: 'Link', icon: LinkIcon },
                    { name: 'Themes', icon: Palette }
                  ].map((tab) => (
                    <button 
                      key={tab.name}
                      onClick={() => setActiveTab(tab.name)}
                      className={`flex items-center w-full p-2 md:p-3 rounded-md text-sm ${
                        activeTab === tab.name 
                          ? 'bg-white text-black' 
                          : 'bg-[#a394f9] text-white hover:opacity-80'
                      }`}
                    >
                      <tab.icon 
                        className="mr-2 md:mr-3" 
                        size={16}
                        color={activeTab === tab.name ? 'black' : 'white'} 
                      />
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* พื้นที่เนื้อหาหลัก */}
          <div className="w-full md:w-1/2 md:pl-8 md:pr-8">
            {/* แสดงเนื้อหาตามแท็บที่เลือก */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;