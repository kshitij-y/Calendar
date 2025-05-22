"use client";

import { useState, useEffect } from "react";
import moment from "moment";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Month from "@/components/Month";

export default function MonthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramDate = searchParams.get("date");
  const [selectedDate, setSelectedDate] = useState(
    paramDate && moment(paramDate).isValid() ? moment(paramDate) : moment()
  );

  useEffect(() => {
    if (paramDate && moment(paramDate).isValid()) {
      setSelectedDate(moment(paramDate));
    }
  }, [paramDate]);

  const updateDate = (date: moment.Moment) => {
    setSelectedDate(date);
    router.push(`/month?date=${date.format("YYYY-MM-DD")}`, { scroll: false });
  };

  const handlePrev = () =>
    updateDate(selectedDate.clone().subtract(1, "month"));
  const handleNext = () => updateDate(selectedDate.clone().add(1, "month"));
  const handleToday = () => updateDate(moment());
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = moment(e.target.value);
    if (newDate.isValid()) updateDate(newDate);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-4">
      <div className="flex flex-col max-w-5xl mx-auto w-full pt-4">
        <div className="flex items-center gap-2 py-3 text-2xl font-semibold">
          <button className="bg-white/10 p-2 rounded-md" onClick={handlePrev}>
            <ChevronLeft />
          </button>

          <button
            className="bg-white/10 px-3 py-2 rounded-md text-sm"
            onClick={handleToday}>
            Today
          </button>

          <input
            type="date"
            className="bg-white/10 text-white text-sm rounded-md p-2 outline-none"
            value={selectedDate.format("YYYY-MM-DD")}
            onChange={handleDateChange}
          />

          <div className="flex-grow text-center text-sm sm:text-base">
            {selectedDate.format("MMMM YYYY")}
          </div>

          <button className="bg-white/10 p-2 rounded-md" onClick={handleNext}>
            <ChevronRight />
          </button>
        </div>

        <Month selectedDate={selectedDate} />
      </div>
    </div>
  );
}
