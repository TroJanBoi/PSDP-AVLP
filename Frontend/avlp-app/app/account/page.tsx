"use client";

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { 
  User, 
  Settings,   
  Link as LinkIcon, 
  Palette, 
  Bell, 
  Edit2, 
  Sun,
  Moon,
  X,
  Save  
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getUserProfile, updateUserProfile, changePassword, login } from '../../services/api';
import ProfileNavbar from '../../components/ProfileNavbar';
import api from '../../services/api';  

// Interface for extended user information
interface ExtendedUser {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  youtube?: string | null;
  github?: string | null;
  linkedin?: string | null;
  discord?: string | null;
  createdAt?: string | Date;
}

// Main User Profile Page Component
const UserProfilePage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Profile');
  const [theme, setTheme] = useState('light');
  const [isPasswordEditMode, setIsPasswordEditMode] = useState(false);

  // Session and authentication management
  const { data: session, status, update } = useSession();
  const user = session?.user as ExtendedUser;

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // User profile state with default values
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    email: '',
    image: user?.image || '/images/unknown.png',
    youtube: user?.youtube || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    discord: user?.discord || ''
  });
  
  // Handle password change logic
  const handlePasswordChange = async () => {
  // Input validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    Swal.fire({
      icon: "error",
      title: "ข้อมูลไม่ครบ",
      text: "กรุณากรอกรหัสผ่านทั้ง 3 ช่อง"
    });
    return;
  }

  // Password complexity checks
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (!passwordRegex.test(newPassword)) {
    Swal.fire({
      icon: "error",
      title: "รหัสผ่านไม่ถูกต้อง",
      text: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร และประกอบด้วยตัวอักษรและตัวเลข"
    });
    return;
  }

  // Confirm password match
  if (newPassword !== confirmPassword) {
    Swal.fire({
      icon: "error",
      title: "รหัสผ่านไม่ตรงกัน",
      text: "กรุณากรอกรหัสผ่านใหม่ให้ตรงกัน"
    });
    return;
  }

  try {
    // Ensure username exists
    if (!session?.user?.name) {
      throw new Error("ไม่พบข้อมูลผู้ใช้");
    }

    // Call changePassword with username
    await changePassword(
      session.user.name, 
      currentPassword, 
      newPassword
    );

    Swal.fire({
      icon: "success",
      title: "เปลี่ยนรหัสผ่านสำเร็จ",
      text: "รหัสผ่านของคุณได้รับการอัปเดตแล้ว"
    });

    // Reset states
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsPasswordEditMode(false);

  } catch (error: any) {
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน";

    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: errorMessage
    });
  }
};

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/users');
        const userData = response.data.find((user: any) => user.username === session?.user?.name);

        if (userData) {
          const nameParts = userData.name.split(' ');
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(' ');

          setUserProfile({
            firstName: firstName,
            lastName: lastName,
            bio: userData.bio || '',
            email: userData.email || '',
            image: userData.profile_picture || '/images/unknown.png',
            youtube: userData.youtube || '',
            github: userData.github || '',
            linkedin: userData.linkedin || '',
            discord: userData.discord || ''
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (status === 'authenticated') {
      fetchUserProfile();
    }
  }, [session, status]);

  // Handle connecting social media links
  const handleConnect = async (platform: 'youtube' | 'github' | 'linkedin' | 'discord') => {
    try {
      if (!userProfile[platform]) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: `กรุณาใส่ ${platform} URL ก่อนกดเชื่อมต่อ!`
        });
        return;
      }
  
      const updateData = { [platform]: userProfile[platform] };
  
      if (user?.id) {
        const updatedUser = await updateUserProfile(user.id, updateData);
  
        await update({
          user: { ...session?.user, [platform]: updatedUser[platform] },
        });
  
        setUserProfile((prev) => ({ ...prev, [platform]: updatedUser[platform] }));
        
        Swal.fire({
          icon: "success",
          title: "เชื่อมต่อสำเร็จ",
          text: `เชื่อมต่อ ${platform} สำเร็จ!`
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: `เกิดข้อผิดพลาดในการเชื่อมต่อ ${platform}`
      });
    }
  };

  // Handle disconnecting social media links
  const handleDisconnect = async (platform: 'youtube' | 'github' | 'linkedin' | 'discord') => {
    try {
      if (user?.id) {
        await updateUserProfile(user.id, { [platform]: null });
  
        await update({
          user: { ...session?.user, [platform]: null },
        });
  
        setUserProfile((prev) => ({ ...prev, [platform]: '' }));
        
        Swal.fire({
          icon: "warning",
          title: "ยกเลิกการเชื่อมต่อ",
          text: `ยกเลิกการเชื่อมต่อ ${platform} สำเร็จ!`
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: `ยกเลิกการเชื่อมต่อ ${platform} ไม่สำเร็จ!`
      });
    }
  };
  
  // Sanitize name input to allow only letters
  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>, field: 'firstName' | 'lastName') => {
    const sanitizedValue = e.target.value
      .replace(/[^a-zA-Z]/g, '')
      .trim()
      .slice(0, 50);

    setUserProfile(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
  };

  // Save profile information
  const handleSaveProfile = async () => {
    try {
      const fullName = `${userProfile.firstName} ${userProfile.lastName}`.trim();
  
      if (!user?.id) {
        throw new Error("ไม่พบข้อมูลผู้ใช้");
      }
  
      const updateData = {
        name: fullName,
        bio: userProfile.bio,
        email: userProfile.email,
        youtube: userProfile.youtube,
        github: userProfile.github,
        linkedin: userProfile.linkedin,
        discord: userProfile.discord,
        profile_picture: userProfile.image
      };
  
      const updatedUser = await updateUserProfile(user.id, updateData);
  
      setUserProfile(prev => ({
        ...prev,
        firstName: updatedUser.name?.split(" ")[0] || "",
        lastName: updatedUser.name?.split(" ").slice(1).join(" ") || "",
        bio: updatedUser.bio || "",
        email: updatedUser.email || "",
        youtube: updatedUser.youtube || "",
        github: updatedUser.github || "",
        linkedin: updatedUser.linkedin || "",
        discord: updatedUser.discord || "",
        image: updatedUser.profile_picture || '/images/unknown.png'
      }));
  
      Swal.fire({
        icon: "success",
        title: "บันทึกสำเร็จ",
        text: "ข้อมูลของคุณได้รับการอัปเดต"
      });
    } catch (error) {
      console.error("Save error:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล"
      });
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'Profile':
        return (
          <div className="bg-[#cdc1ff] rounded-lg p-4 md:p-6 shadow-md text-black">
            <h2 className="text-xl md:text-2xl font-bold text-black border-b-2 border-black pb-2 mb-4">Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-xs md:text-sm font-medium text-black mb-2">First Name :</label>
                <input 
                  id="firstName"
                  type="text" 
                  value={userProfile.firstName}
                  onChange={(e) => handleNameInput(e, 'firstName')}
                  placeholder="Enter first name" 
                  className="w-full rounded-md p-1 md:p-2 text-sm"
                /> 
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs md:text-sm font-medium text-black mb-2">Last Name :</label>
                <input 
                  id="lastName"
                  type="text" 
                  value={userProfile.lastName}
                  onChange={(e) => handleNameInput(e, 'lastName')}
                  placeholder="Enter last name" 
                  className="w-full rounded-md p-1 md:p-2 text-sm"
                />
              </div>
            </div>
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
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleSaveProfile}
                className="flex items-center bg-[#a593f5] text-white rounded-md p-2 hover:opacity-90"
              >
                <Save className="mr-2" size={16} />
                Save Profile
              </button>
            </div>
          </div>  
        );
      
      case 'Account':
        return (
          <div className="bg-[#cdc1ff] rounded-lg p-4 md:p-6 shadow-md text-black">
            <h2 className="text-xl md:text-2xl font-bold text-black border-b-2 border-black pb-2 mb-4">Account</h2>
            
            <div className="space-y-4">
              {/* Email Section */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Email</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="email"
                    value={userProfile.email || ''}
                    readOnly
                    className="w-full p-2 bg-gray-100 rounded-md text-gray-600"
                  />
                  <button 
                    className="bg-[#a593f5] text-white p-2 rounded-md hover:opacity-90"
                    onClick={() => {
                      Swal.fire({
                        icon: "warning",
                        title: "การเปลี่ยนอีเมล",
                        text: "การเปลี่ยนอีเมลยังไม่สามารถทำได้"
                      });
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>

              {/* Username Section */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Username</label>
                <input 
                  type="text"
                  value={session?.user?.name || ''}
                  readOnly
                  className="w-full p-2 bg-gray-100 rounded-md text-gray-600"
                />
              </div>

              {/* Enhanced Password Section */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Password</label>
                {!isPasswordEditMode ? (
                  <div className="flex items-center space-x-2">
                    <input 
                      type="password"
                      value="********"
                      readOnly
                      className="w-full p-2 bg-gray-100 rounded-md text-gray-600"
                    />
                    <button 
                      onClick={() => setIsPasswordEditMode(true)}
                      className="bg-[#a593f5] text-white p-2 rounded-md hover:opacity-90"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
              <label className="block text-xs mb-1">Current Password</label>
              <input 
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full p-2 rounded-md"
                minLength={6}
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1">New Password</label>
              <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full p-2 rounded-md"
                minLength={6}
                pattern="(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}"
                title="Password must be at least 6 characters long and contain letters and numbers"
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Confirm New Password</label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full p-2 rounded-md"
                minLength={6}
                required
              />
            </div>
                   
                    <div className="flex space-x-2">
                      <button 
                        onClick={handlePasswordChange}
                        className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 flex-grow"
                      >
                        <Save className="mr-2 inline" size={16} />
                        Save New Password
                      </button>
                      <button 
                        onClick={() => {
                          setIsPasswordEditMode(false);
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                        }}
                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'Link':
        return (
          <div className="bg-[#cdc1ff] rounded-lg p-4 md:p-6 shadow-md text-black">
            <h2 className="text-xl md:text-2xl font-bold text-black border-b-2 border-black pb-2 mb-4">Link</h2>
            <div className="space-y-4">
              {(['youtube', 'github', 'linkedin', 'discord'] as const).map((platform) => {
                const hasUrlInDatabase = user?.[platform] && user?.[platform] !== '';

                // URL validation function
                const isValidUrl = (url: string) => {
                  try {
                    const validUrl = new URL(url);
                    // Additional platform-specific validation
                    switch(platform) {
                      case 'youtube':
                        return validUrl.hostname.includes('youtube.com') || validUrl.hostname.includes('youtu.be');
                      case 'github':
                        return validUrl.hostname.includes('github.com');
                      case 'linkedin':
                        return validUrl.hostname.includes('linkedin.com');
                      case 'discord':
                        return validUrl.hostname.includes('discord.gg') || validUrl.hostname.includes('discord.com');
                      default:
                        return true;
                    }
                  } catch {
                    return false;
                  }
                };

                return (
                  <div key={platform} className="flex items-center">
                    <div className="w-full">
                      <label className="block text-xs md:text-sm font-medium text-black mb-2 capitalize">
                        {platform} :
                      </label>
                      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                        <div className="w-full relative">
                          <input
                            type="url"
                            placeholder={`Enter ${platform} URL`}
                            value={userProfile[platform]}
                            onChange={(e) =>
                              setUserProfile((prev) => ({ 
                                ...prev, 
                                [platform]: e.target.value 
                              }))
                            }
                            className={`w-full rounded-md p-1 md:p-2 text-sm mb-2 md:mb-0 ${
                              userProfile[platform] && !isValidUrl(userProfile[platform]) 
                                ? 'border-2 border-red-500' 
                                : ''
                            }`}
                          />
                          {userProfile[platform] && !isValidUrl(userProfile[platform]) && (
                            <p className="text-red-500 text-xs absolute -bottom-4 left-0">
                              Please enter a valid {platform} URL
                            </p>
                          )}
                        </div>
                        {!hasUrlInDatabase ? (
                          <button
                            onClick={() => handleConnect(platform)}
                            disabled={!userProfile[platform] || !isValidUrl(userProfile[platform])}
                            className={`flex items-center px-3 py-2 rounded-md ${
                              userProfile[platform] && isValidUrl(userProfile[platform])
                                ? 'bg-[#a394fa] text-white hover:opacity-90' 
                                : 'bg-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <LinkIcon className="mr-2" size={16} />
                            Connect
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDisconnect(platform)}
                            className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                          >
                            Disconnect
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
        
      case 'Themes':
        return (
          <div className="bg-[#cdc1ff] rounded-lg p-4 md:p-6 shadow-md text-black">
            <h2 className="text-xl md:text-2xl font-bold text-black border-b-2 border-black pb-2 mb-4">Themes</h2>
            <div>
              <label className="block text-xs md:text-sm font-medium text-black mb-2">Theme Selection :</label>
              <div className="flex space-x-2 md:space-x-4">
                <button 
                  onClick={() => setTheme('light')}
                  className={`flex items-center px-2 md:px-4 py-1 md:py-2 rounded-md text-sm ${
                    theme === 'light' ? 'bg-black text-white' : 'bg-gray-200'
                  }`}
                >
                  <Sun className="mr-1 md:mr-2" size={16} />
                  Light
                </button>
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

  // Render unauthenticated state
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

  // Render loading state
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

  // Main render for authenticated user
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat" 
      style={{ 
        backgroundImage: `url('https://img2.pic.in.th/pic/Account1ad5696c4f9aa6cb.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <ProfileNavbar />

      <div className="mt-4 md:mt-16 w-full px-2 md:px-4">
        <div className="flex flex-col md:flex-row w-full">
          <div className="w-full md:w-1/3 mb-4 md:mb-0 md:pr-8 flex justify-center md:justify-end">
            <div className="flex flex-col items-center w-full md:w-64">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full">
                <Image
                  src={userProfile.image || '/images/unknown.png'}
                  alt="Profile" 
                  width={96}
                  height={96}
                  className="rounded-full w-full h-full object-cover"
                />
              </div>
              <h2 className="text-base md:text-xl font-bold mt-2 md:mt-3">
                {userProfile.firstName} {userProfile.lastName}
              </h2>
              <p className="text-xs md:text-sm text-gray-500 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Online
              </p>

              <div className="w-full bg-[#a394f9] p-4 md:p-6 shadow-md mt-4 md:mt-6 rounded-xl">
                <div className="space-y-2">
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

          <div className="w-full md:w-1/2 md:pl-8 md:pr-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;