"use client";
import SplashScreen from "@/components/SplashScreen";
import React, { useEffect, useState } from "react";

type SplashWrapperProps = {
  children: React.ReactNode;
};

export default function SplashWrapper({ children }: SplashWrapperProps) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return <>{showSplash ? <SplashScreen /> : children}</>;
}