// Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="flex items-center mx-auto w-full p-5">
        <div className="border-r-2 p-4">
          <h2 className="font-medium text-xl text-accent">ติดต่อเรา</h2>
          <div className="space-y-1 text-white text-lg">
            <p>66015145@kmitl.ac.th</p>
            <p>66015116@kmitl.ac.th</p>
          </div>
        </div>
      </div>
      <div className="bg-secondary text-white w-full p-2">
        © สงวนลิขสิทธิ์ สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง
      </div>
    </footer>
  );
};

export default Footer;
