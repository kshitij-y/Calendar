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
const EVENT_AREA_WIDTH = 570;

export default function Day({
  selectedDate,
}: {
  selectedDate: moment.Moment;
}) {
  const events = useSelector((state: RootState) => state.calendar.events);
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  const visibleEvents = getVisibleEvents(events, selectedDate);
  const positionedEvents = groupAndPositionEvents(visibleEvents, selectedDate);

  return (
    <div className="relative border border-white/10 ml-16">
      {timeSlots.map((hour) => (
        <div key={hour} className="relative h-[40px] border-b border-white/10">
          <div className="absolute left-[-3.5rem] text-xs text-white/60">
            {moment({ hour }).format("h A")}
          </div>
        </div>
      ))}

      {positionedEvents.map((event) => {
        const minutesFromStart = moment(event.start).diff(
          selectedDate.clone().startOf("day"),
          "minutes"
        );
        const duration = moment(event.end).diff(moment(event.start), "minutes");

        const width = EVENT_AREA_WIDTH / event.totalColumns - EVENT_PADDING;
        const left = event.columnIndex * (width + EVENT_PADDING);

        return (
          <div
            key={event.id}
            className="absolute bg-blue-600 text-white text-xs p-2 rounded shadow-md"
            style={{
              top: `${minutesFromStart * PIXELS_PER_MINUTE}px`,
              height: `${Math.max(duration * PIXELS_PER_MINUTE, 20)}px`,
              left: `${left}px`,
              width: `${width}px`,
            }}>
            <div className="font-semibold">{event.title}</div>
            <div className="text-[10px] opacity-80">
              {moment(event.start).format(" h:mm A")} -{" "}
              {moment(event.end).format(" h:mm A")}
            </div>
          </div>
        );
      })}
    </div>
  );
}
