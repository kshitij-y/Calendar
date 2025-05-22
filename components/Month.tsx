"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import moment from "moment";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function Month({
  selectedDate,
}: {
  selectedDate: moment.Moment;
}) {
  const events = useSelector((state: RootState) => state.calendar.events);
  const router = useRouter();

  const startOfMonth = selectedDate.clone().startOf("month").startOf("week");
  const endOfMonth = selectedDate.clone().endOf("month").endOf("week");

  const days: moment.Moment[] = [];
  const day = startOfMonth.clone();

  while (day.isSameOrBefore(endOfMonth, "day")) {
    days.push(day.clone());
    day.add(1, "day");
  }

  const eventsByDay = groupEventsByDay(events);

  return (
    <div className="grid grid-cols-7 gap-px bg-white/10">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
        <div
          key={d}
          className="text-center text-sm sm:text-md md:text-lg text-white/60 py-1 bg-black">
          {d}
        </div>
      ))}

      {days.map((d) => {
        const dateKey = d.format("YYYY-MM-DD");
        const hasEvents = eventsByDay[dateKey]?.length > 0;

        return (
          <div
            key={d.toString()}
            onClick={() => router.push(`/day?day=${dateKey}`)}
            className={clsx(
              "aspect-square p-2 text-sm sm:text-md md:text-lg border border-white/10 relative cursor-pointer hover:bg-white/10 transition",
              d.isSame(selectedDate, "month") ? "bg-black" : "bg-black/50"
            )}>
            <div className="text-white/80">{d.date()}</div>

            {hasEvents && (
              <div className="absolute bottom-1 left-1 right-1 h-1 rounded bg-blue-500" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function groupEventsByDay(events: RootState["calendar"]["events"]) {
  const map: Record<string, typeof events> = {};

  events.forEach((event) => {
    const dayKey = moment(event.start).format("YYYY-MM-DD");
    if (!map[dayKey]) {
      map[dayKey] = [];
    }
    map[dayKey].push(event);
  });

  return map;
}
