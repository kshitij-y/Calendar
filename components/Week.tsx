"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import moment from "moment";
import {
  getVisibleEvents,
  groupAndPositionEvents,
} from "@/utils/events";

const PIXELS_PER_MINUTE = 2 / 3;
const EVENT_PADDING = 2;
const COLUMN_WIDTH = 80;

export default function Week({
  selectedDate,
}: {
  selectedDate: moment.Moment;
}) {
  const events = useSelector((state: RootState) => state.calendar.events);

  const weekStart = selectedDate.clone().startOf("week");
  const days = Array.from({ length: 7 }, (_, i) =>
    weekStart.clone().add(i, "days")
  );

  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex">
      <div className="flex flex-col w-16 pr-1 text-right text-xs text-white/60">
        {timeSlots.map((hour) => (
          <div key={hour} className="h-[40px]">
            {moment({ hour }).format("h A")}
          </div>
        ))}
      </div>

      <div className="flex-grow grid grid-cols-7 border-l border-white/10 relative">
        {days.map((day) => {
          const dayEvents = getVisibleEvents(events, day);
          const positionedEvents = groupAndPositionEvents(dayEvents, day);

          return (
            <div
              key={day.format("YYYY-MM-DD")}
              className="relative border-r border-white/10">
              {timeSlots.map((hour) => (
                <div key={hour} className="h-[40px] border-b border-white/5" />
              ))}

              <div className="absolute top-0 left-0 right-0 text-center text-xs font-semibold py-1 bg-black/80 z-10">
                {day.format("ddd, MMM D")}
              </div>

              {positionedEvents.map((event) => {
                const minutesFromStart = moment(event.start).diff(
                  day.clone().startOf("day"),
                  "minutes"
                );
                const duration = moment(event.end).diff(
                  moment(event.start),
                  "minutes"
                );

                const width = COLUMN_WIDTH / event.totalColumns - EVENT_PADDING;
                const left = event.columnIndex * (width + EVENT_PADDING);

                return (
                  <div
                    key={event.id}
                    className="absolute bg-blue-600 text-white text-xs p-1 rounded shadow-md"
                    style={{
                      top: `${minutesFromStart * PIXELS_PER_MINUTE}px`,
                      height: `${Math.max(duration * PIXELS_PER_MINUTE, 20)}px`,
                      left: `${left}px`,
                      width: `${width}px`,
                    }}>
                    <div className="font-semibold truncate">{event.title}</div>
                    <div className="text-[10px] opacity-80 truncate">
                      {moment(event.start).format("h:mm A")} -{" "}
                      {moment(event.end).format("h:mm A")}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
