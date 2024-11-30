"use client"

import { useEffect, useState } from "react";

interface ClientMediaQueryProps {
  children: (matches: boolean) => React.ReactNode;
}

export function ClientMediaQuery({ children }: ClientMediaQueryProps) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const updateMatches = () => setMatches(media.matches);
    
    updateMatches();
    media.addEventListener('change', updateMatches);
    
    return () => media.removeEventListener('change', updateMatches);
  }, []);

  return <>{children(matches)}</>;
} 