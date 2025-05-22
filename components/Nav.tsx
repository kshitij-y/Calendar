"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = "day" | "week" | "month" | "year";

export default function Nav({
  direction = "row",
}: {
  direction?: "row" | "col";
}) {
  const pathname = usePathname();
  const current = pathname.split("/")[1] as Tab;

  const tabs: Tab[] = ["day", "week", "month", "year"];

  return (
    <div className="inline-block bg-white/10 rounded-full p-2 shadow-inner">
      <ul
        className={`flex ${
          direction === "col" ? "flex-col space-y-1" : "space-x-1"
        }`}>
        {tabs.map((tab) => {
          const isActive = current === tab;
          return (
            <li key={tab}>
              <Link
                href={`/${tab}`}
                className={`cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-300
                  ${
                    isActive
                      ? "bg-white/30 text-black shadow"
                      : "text-white/80 hover:bg-white/10"
                  }`}>
                {tab}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
