"use client";
import Image from "next/image";
import { useState } from "react";
type prop = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function AddEvent({ isOpen, setIsOpen }: prop) {
  return (
    <div className="flex fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
      <div className="" onClick={() => setIsOpen(!isOpen)}>
        <Image
          src="/x.svg"
          alt="Add Event"
          width={30}
          height={30}
          className="object-cover rounded-[10px] transition-transform duration-500 ease-in-out transform hover:scale-110"
        />
      </div>
    </div>
  );
}
