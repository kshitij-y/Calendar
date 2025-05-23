"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import moment from "moment";
import { getVisibleEvents, groupAndPositionEvents } from "@/utils/events";
import EventItem from "./EventItem";
import { updateEvent, removeEvent, CalendarEvent } from "@/lib/store/Slice/calendarSlice";

const PIXELS_PER_MINUTE = 2 / 3;
const EVENT_PADDING = 2;
const COLUMN_WIDTH = 100;

export default function Week({
  selectedDate,
}: {
  selectedDate: moment.Moment;
}) {
  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => state.calendar.events);
  const handleUpdate = (updatedEvent: CalendarEvent) => {
    dispatch(updateEvent(updatedEvent));
  };

  const handleDelete = (eventId: string) => {
    dispatch(removeEvent(eventId));
  };

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
        })}
      </div>
    </div>
  );
}
