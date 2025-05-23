"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import moment from "moment";
import { CalendarEvent } from "@/lib/store/Slice/calendarSlice";

type Props = {
  event: CalendarEvent;
  onClose: () => void;
  onDelete: () => void;
  onUpdate: (updatedEvent: CalendarEvent) => void;
};

const categories = ["default", "birthday", "holiday", "reminder", "meeting"];
const recurrences = ["none", "daily", "weekly", "monthly", "yearly", "custom"];

export default function EventDetailModal({
  event,
  onClose,
  onDelete,
  onUpdate,
}: Props) {
  const [title, setTitle] = useState(event.title);
  const [start, setStart] = useState(
    moment(event.start).format("YYYY-MM-DDTHH:mm")
  );
  const [end, setEnd] = useState(moment(event.end).format("YYYY-MM-DDTHH:mm"));
  const [description, setDescription] = useState(event.description || "");
  const [category, setCategory] = useState(event.category);
  const [recurrence, setRecurrence] = useState(event.recurrence);

  useEffect(() => {
    setTitle(event.title);
    setStart(moment(event.start).format("YYYY-MM-DDTHH:mm"));
    setEnd(moment(event.end).format("YYYY-MM-DDTHH:mm"));
    setDescription(event.description || "");
    setCategory(event.category);
    setRecurrence(event.recurrence);
  }, [event]);

  const handleSave = () => {
    onUpdate({
      ...event,
      title,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      description,
      category,
      recurrence,
    });
  };

  const inputClass =
    "w-full rounded border border-gray-600 bg-transparent px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="relative w-full max-w-md rounded-lg bg-black p-6 shadow-lg border border-white/25">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
          aria-label="Close">
          <Image
            src="/x.svg"
            alt="Close"
            width={20}
            height={20}
            className="cursor-pointer"
          />
        </button>

        <h2 className="mb-6 text-2xl font-semibold text-white">Edit Event</h2>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium mb-1 text-gray-300">
              Event Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              className={inputClass}
              required
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="start"
              className="block text-sm font-medium mb-1 text-gray-300">
              Start Date & Time
            </label>
            <div className="relative">
              <input
                id="start"
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className={`${inputClass} pl-2`}
                required
              />
              <div className="pointer-events-none absolute top-3 right-3 flex items-center opacity-60">
                <Image
                  src="/calendar.svg"
                  alt="Calendar"
                  width={18}
                  height={18}
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="end"
              className="block text-sm font-medium mb-1 text-gray-300">
              End Date & Time
            </label>
            <div className="relative">
              <input
                id="end"
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className={`${inputClass} pl-2`}
                required
              />
              <div className="pointer-events-none absolute top-3 right-3 flex items-center opacity-60">
                <Image
                  src="/calendar.svg"
                  alt="Calendar"
                  width={18}
                  height={18}
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1 text-gray-300">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about your event"
              className={`${inputClass} resize-none h-20`}
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-1 text-gray-300">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as CalendarEvent["category"])
              }
              className={`${inputClass} bg-black`}>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-black">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="recurrence"
              className="block text-sm font-medium mb-1 text-gray-300">
              Recurrence
            </label>
            <select
              id="recurrence"
              value={recurrence}
              onChange={(e) =>
                setRecurrence(e.target.value as CalendarEvent["recurrence"])
              }
              className={inputClass}>
              {recurrences.map((rec) => (
                <option key={rec} value={rec} className="bg-black">
                  {rec.charAt(0).toUpperCase() + rec.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={handleSave}
              className="w-full rounded bg-blue-600 py-2 text-white transition hover:bg-blue-700 mr-2">
              Save Changes
            </button>

            <button
              onClick={onDelete}
              className="w-full rounded bg-red-900 py-2 text-white transition hover:bg-red-800 ml-2">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
