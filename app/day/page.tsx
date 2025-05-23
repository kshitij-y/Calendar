"use client";

import React, { useState } from "react";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import Day from "@/components/Day";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DayPage() {
  const searchParams = useSearchParams();
  const dayParam = searchParams.get("day");

  const initialDate = moment(dayParam, "YYYY-MM-DD", true).isValid()
    ? moment(dayParam)
    : moment();

  const [selectedDate, setSelectedDate] = useState(initialDate);

  const handleLeft = () => {
    setSelectedDate((prev) => prev.clone().subtract(1, "day"));
  };

  const handleRight = () => {
    setSelectedDate((prev) => prev.clone().add(1, "day"));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = moment(e.target.value);
    if (chosen.isValid()) setSelectedDate(chosen);
  };

  return (
    <div className="flex flex-col min-h-screen h-full pb-12 items-center min-w-[420px] bg-black text-white px-4">
      <div className="flex flex-col w-full sm:max-w-3xl max-w-[600px] pt-4">
        <div className="flex items-center gap-2 py-3 text-2xl font-semibold text-white">
          <button className="bg-white/10 p-2 rounded-md" onClick={handleLeft}>
            <ChevronLeft />
          </button>

          <button
            className="bg-white/10 p-2 rounded-md text-sm"
            onClick={() => setSelectedDate(moment())}>
            Today
          </button>

          <label className="relative cursor-pointer">
            <input
              type="date"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              value={selectedDate.format("YYYY-MM-DD")}
              onChange={handleDateChange}
            />
            <div className="bg-white/10 p-2 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </label>

          <div className="flex-grow text-center text-sm sm:text-base">
            {selectedDate.format("dddd, MMMM D, YYYY")}
          </div>

          <button className="bg-white/10 p-2 rounded-md" onClick={handleRight}>
            <ChevronRight />
          </button>
        </div>

        <div>
          <Day selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
}
