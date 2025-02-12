"use client";
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'


export default function BtnSignIn() {

  const btnRef = useRef<HTMLButtonElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hadleMouseMove = (e: MouseEvent) => {
      const { width } = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
      const offset = e.offsetX;
      const left = `${(offset / width) * 100}%`;

      if (spanRef.current) {
        spanRef.current.animate({ left }, { duration: 250, fill: 'forwards' });
      }
    };

    const handleMouseLeave = () => {
      if (spanRef.current) {
        spanRef.current.animate({ left: '50%' }, { duration: 100, fill: 'forwards' });
      }
    };

    btnRef.current?.addEventListener('mousemove', hadleMouseMove);
    btnRef.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btnRef.current?.removeEventListener('mousemove', hadleMouseMove);
      btnRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    }

  }, []);

  return (
    <motion.button
      whileTap={{ scale: 0.8, transition: { duration: 0.1 } }}
      ref={btnRef}
      className="relative w-full overflow-hidden rounded-lg bg-primary px-4 py-3 text-lg font-medium text-white"
    >
      <span className="pointer-events-none relative z-10 mix-blend-difference font-bold text-2xl">
        Sign In
      </span>
      <span
        ref={spanRef}
        className="pointer-events-none absolute left-[50%] top-[50%] h-32 w-32 -translate-x-[50%] -translate-y-[50%] rounded-full bg-background mix-blend-difference"
      />

    </motion.button>
  )
}