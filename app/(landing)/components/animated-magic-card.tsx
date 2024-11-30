"use client"

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MagicCard } from "@/components/ui/magic-card";
import { CardContent } from "@/components/ui/card";

interface AnimatedMagicCardProps {
  children: React.ReactNode;
  delay?: number;
}

export function AnimatedMagicCard({ children, delay = 0 }: AnimatedMagicCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay }}
    >
      <MagicCard className="flex h-48 items-center justify-center">
        <CardContent>{children}</CardContent>
      </MagicCard>
    </motion.div>
  );
} 