"use client"

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollContainerProps {
  children: (
    scrollRef: React.RefObject<HTMLDivElement>,
    y: MotionValue<number>,
    scrollOpacity: MotionValue<number>,
    scrollY2: MotionValue<number>
  ) => ReactNode;
  isMobile: boolean;
}

export function ScrollContainer({ children, isMobile }: ScrollContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.25"]
  });

  const y = useTransform(scrollY, [0, !isMobile ? 500 : 0], [0, !isMobile ? -250 : -50]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scrollY2 = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <motion.div 
      ref={containerRef} 
      className="min-h-full px-2 sm:px-0 mb-24 w-full flex flex-col sm:gap-30 overflow-hidden sm:overflow-visible"
    >
      {children(scrollRef, y, scrollOpacity, scrollY2)}
    </motion.div>
  );
} 