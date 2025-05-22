"use client";
import Image from "next/image";
import { useState } from "react";
import AddEvent from "./AddEvent";
import SearchBox from "./SearchBox";

export default function TopSection() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleAdd = () => {
    setIsAddOpen((prev) => {
      if (!prev) setIsSearchOpen(false);
      return !prev;
    });
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => {
      if (!prev) setIsAddOpen(false);
      return !prev;
    });
  };

  return (
    <div className="flex justify-between items-center h-17 bg-white/5 w-full border-b border-b-white/10 px-4 min-w-[400px]">
      <div onClick={toggleAdd} className="cursor-pointer">
        <Image
          src="/calendar-plus.svg"
          alt="Add Event"
          width={30}
          height={30}
          className="object-cover rounded-[10px] transition-transform duration-500 ease-in-out transform hover:scale-110"
        />
      </div>
      <div onClick={toggleSearch} className="cursor-pointer">
        <Image
          src="/calendar-search.svg"
          alt="Search Events"
          width={30}
          height={30}
          className="object-cover rounded-[10px] transition-transform duration-500 ease-in-out transform hover:scale-110"
        />
      </div>

      {isAddOpen && <AddEvent isOpen={isAddOpen} setIsOpen={setIsAddOpen} />}
      {isSearchOpen && (
        <SearchBox isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
      )}
    </div>
  );
}
