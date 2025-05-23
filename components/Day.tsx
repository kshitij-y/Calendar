"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import moment from "moment";
import {
  getVisibleEvents,
  groupAndPositionEvents,
  PIXELS_PER_MINUTE,
} from "@/utils/events";
import EventItem from "@/components/EventItem";
import {
  updateEvent,
  removeEvent,
  CalendarEvent,
} from "@/lib/store/Slice/calendarSlice";
import { useEffect, useState } from "react";

const EVENT_PADDING = 2;


export default function Day({ selectedDate }: { selectedDate: moment.Moment }) {
  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => state.calendar.events);

  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  const visibleEvents = getVisibleEvents(events, selectedDate);
  const positionedEvents = groupAndPositionEvents(visibleEvents, selectedDate);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Dynamic width calculation
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const EVENT_AREA_WIDTH = windowWidth * 0.6 - 50;

  const handleUpdate = (updatedEvent: CalendarEvent) => {
    dispatch(updateEvent(updatedEvent));
  };

  const handleDelete = (eventId: string) => {
    dispatch(removeEvent(eventId));
  };

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

        let width = EVENT_AREA_WIDTH / event.totalColumns - EVENT_PADDING;
        const left = event.columnIndex * (width + EVENT_PADDING);

        return (
          <EventItem
            key={event.id}
            event={event}
            top={minutesFromStart * PIXELS_PER_MINUTE}
            height={Math.max(duration * PIXELS_PER_MINUTE, 20)}
            left={left}
            width={width}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        );
      })}
    </div>
  );
}
