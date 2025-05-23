"use client";

import { useState } from "react";
import moment from "moment";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Week from "@/components/Week";

export default function WeekPage() {
  const [selectedDate, setSelectedDate] = useState(moment());

  const handlePrev = () => {
    setSelectedDate((prev) => prev.clone().subtract(1, "week"));
  };

  const handleNext = () => {
    setSelectedDate((prev) => prev.clone().add(1, "week"));
  };

  const handleToday = () => {
    setSelectedDate(moment());
  };


  const weekStart = selectedDate.clone().startOf("week");
  const weekEnd = selectedDate.clone().endOf("week");

  return (
    <div className="flex flex-col min-h-screen  bg-black text-white px-4 overflow-x-auto">
      <div className="flex flex-col max-w-5xl mx-auto w-full pt-4">
        <div className="flex items-center gap-2 py-3 text-2xl font-semibold text-white">
          <button className="bg-white/10 p-2 rounded-md" onClick={handlePrev}>
            <ChevronLeft />
          </button>

          <button
            className="bg-white/10 px-3 py-2 rounded-md text-sm"
            onClick={handleToday}>
            Today
          </button>

          <div className="flex-grow text-center text-sm sm:text-base">
            {weekStart.format("MMM D")} – {weekEnd.format("MMM D, YYYY")}
          </div>

          <button className="bg-white/10 p-2 rounded-md" onClick={handleNext}>
            <ChevronRight />
          </button>
        </div>

        <div className="overflow-x-auto">
          <Week selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
}
