"use client";
import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const SubNavbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollTop && window.scrollY > 200) {
        setIsVisible(false);
      } else if (window.scrollY < lastScrollTop) {
        setIsVisible(true);
      }
      setLastScrollTop(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollTop]);

  return (
    <>
      <div className={`w-full h-[250px] mt-14 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex justify-center items-center bg-primary w-full h-1/2">
          <div className="flex items-center text-xl bg-white shadow-md hover:border-2 hover:border-primary text-primary px-4 py-2 rounded-lg w-1/2">
            <Search className='mr-2 w-6 h-6 text-primary' />
            <input
              type="text"
              name="search"
              className="bg-transparent outline-none text-primary w-full h-8 placeholder-secondary"
              placeholder="Search"
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default SubNavbar;