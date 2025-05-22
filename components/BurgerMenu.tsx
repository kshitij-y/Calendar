"use client";
import React, { useState } from "react";
import { Menu } from "lucide-react";
import Nav from "./Nav";

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="flex items-center justify-between w-full curser-pointer">
      <div className="flex items-center">
        <Menu className="w-6 h-6 text-white" onClick={toggleMenu} />
      </div>

      {isOpen && (
        <div className="">
          <Nav />
        </div>
      )}
    </div>
  );
}
