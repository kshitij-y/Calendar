"use client";
import React, { useState } from "react";

export default function Nav() {
  const [selected, setSelected] = useState<"day" | "week" | "month" | "year">(
    "day"
  );
  const tabs: Array<typeof selected> = ["day", "week", "month", "year"];

  return (
    <div className="inline-block bg-white/10 rounded-full p-1 shadow-inner">
      <ul className="flex space-x-1">
        {tabs.map((tab) => {
          const isActive = selected === tab;
          return (
            <li
              key={tab}
              onClick={() => setTimeout(() => setSelected(tab), 100)}
              className={`cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-300 
                ${
                  isActive
                    ? "bg-white/30 text-black shadow"
                    : "text-white/80 hover:bg-white/10"
                      }`}
              id={tab}
              >
              {tab}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
