"use client";

import React from "react";
import moment from "moment";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const today = moment();

  const months = Array.from({ length: 12 }, (_, i) =>
    today.clone().month(i).startOf("month")
  );

  function daysInMonth(month: moment.Moment) {
    const daysCount = month.daysInMonth();
    return Array.from({ length: daysCount }, (_, i) =>
      month.clone().date(i + 1)
    );
  }

  const handleMonthClick = (month: moment.Moment) => {
    router.push(`/month?date=${month.format("YYYY-MM-DD")}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white p-4">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">{today.format("YYYY")}</h1>
        <p className="text-sm text-white/70 mt-1">
          Select a month to view details
        </p>
      </header>

      <main className="w-full max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {months.map((month) => {
            const days = daysInMonth(month);
            const startDay = month.day();

            return (
              <button
                key={month.month()}
                onClick={() => handleMonthClick(month)}
                className="rounded-lg p-4 bg-gray-900 hover:bg-gray-800 transition-colors duration-200 text-left border border-transparent"
                type="button">
                <h2 className="font-semibold mb-2 text-lg">
                  {month.format("MMMM")}
                </h2>

                <div className="grid grid-cols-7 gap-1 text-xs text-gray-400 select-none">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={i} className="text-center">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 mt-1 text-sm">
                  {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {days.map((day) => {
                    const isToday = day.isSame(today, "day");

                    return (
                      <div
                        key={day.date()}
                        className={`text-center py-1 rounded
                          ${
                            isToday ? "bg-blue-600 font-bold" : "bg-gray-700"
                          }`}>
                        {day.date()}
                      </div>
                    );
                  })}
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
