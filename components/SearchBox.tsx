"use client";

import Image from "next/image";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { searchEvents } from "@/utils/search";
import {
  CalendarEvent,
  updateEvent,
  removeEvent,
} from "@/lib/store/Slice/calendarSlice";
import EventDetailModal from "@/components/EventDetails";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function SearchBox({ isOpen, setIsOpen }: Props) {
  const [query, setQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const events = useSelector((state: RootState) => state.calendar.events);
  const dispatch = useDispatch();

  const results = searchEvents(events, query);

  const handleUpdate = (updatedEvent: CalendarEvent) => {
    dispatch(updateEvent(updatedEvent));
    setSelectedEvent(null);
  };

  const handleDelete = () => {
    if (selectedEvent) {
      dispatch(removeEvent(selectedEvent.id));
      setSelectedEvent(null);
    }
  };

  return (
    <div className="flex flex-col items-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-md bg-black text-white p-4 rounded shadow-lg space-y-4 border border-white/10">
      <div className="flex justify-between w-full items-center">
        <input
          type="text"
          placeholder="Search events..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 bg-gray-800 text-white border border-white/20 rounded mr-4"
        />
        <div onClick={() => setIsOpen(false)} className="cursor-pointer">
          <Image
            src="/x.svg"
            alt="Close"
            width={30}
            height={30}
            className="object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
      </div>

      <div className="w-full max-h-64 overflow-y-auto space-y-2">
        {results.length === 0 ? (
          <div className="text-center text-sm text-white/50">
            No results found.
          </div>
        ) : (
          results.map((event: CalendarEvent) => (
            <div
              key={event.id}
              className="p-2 rounded bg-white/10 hover:bg-white/20 transition text-sm cursor-pointer"
              onClick={() => setSelectedEvent(event)}>
              <div className="font-semibold">{event.title}</div>
              <div className="text-xs text-white/60">
                {event.description || "No description"}
              </div>
              <div className="text-xs italic text-white/40">
                Category: {event.category}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
