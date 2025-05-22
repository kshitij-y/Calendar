"use client";

import React, { useState } from "react";
import moment from "moment";
import EventDetailModal from "./EventDetails";

type EventItemProps = {
  event: any;
  top: number;
  height: number;
  left: number;
  width: number;
  onUpdate: (updatedEvent: any) => void;
  onDelete: (eventId: string) => void;
};

export default function EventItem({
  event,
  top,
  height,
  left,
  width,
  onUpdate,
  onDelete,
}: EventItemProps) {
  const [showModal, setShowModal] = useState(false);

  const handleUpdate = (updatedEvent: any) => {
    onUpdate(updatedEvent);
    setShowModal(false);
  };

  const handleDelete = () => {
    onDelete(event.id);
    setShowModal(false);
  };

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="absolute bg-blue-600 text-white text-xs p-2 rounded shadow-md cursor-pointer"
        style={{
          top: `${top}px`,
          height: `${height}px`,
          left: `${left}px`,
          width: `${width}px`,
        }}>
        <div className="font-semibold">{event.title}</div>
        <div className="text-[10px] opacity-80">
          {moment(event.start).format(" h:mm A")} -{" "}
          {moment(event.end).format(" h:mm A")}
        </div>
        <div className="text-[10px] opacity-60 mt-1">
          Category: {event.category || "default"} | Recurrence:{" "}
          {event.recurrence || "none"}
        </div>
      </div>

      {showModal && (
        <EventDetailModal
          event={event}
          onClose={() => setShowModal(false)}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}
