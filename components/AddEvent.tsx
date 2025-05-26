"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addEvent, CalendarEvent } from "@/lib/store/Slice/calendarSlice";
import { v4 as uuidv4 } from "uuid";
import { validateEvent, checkTimeConflicts } from "@/utils/validateEvent";
import { RootState } from "@/lib/store/store";

type AddEventProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddEvent({ isOpen, setIsOpen }: AddEventProps) {
  const dispatch = useDispatch();
  const existingEvents = useSelector(
    (state: RootState) => state.calendar.events
  );

  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CalendarEvent["category"]>("default");
  const [recurrence, setRecurrence] =  useState<CalendarEvent["recurrence"]>("none");
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [customRule, setCustomRule] = useState<{ daysOfWeek: string[]}>({daysOfWeek: []});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent: CalendarEvent = {
      id: uuidv4(),
      title,
      start,
      end,
      description,
      category,
      recurrence,
      ...(recurrence === "custom" && {
        customRule: { daysOfWeek: customRule.daysOfWeek },
      }),
    };

    const resetForm = () => {
      setTitle("");
      setStart("");
      setEnd("");
      setDescription("");
      setCategory("default");
      setRecurrence("none");
      setErrors([]);
      setWarnings([]);
    };

    const validationErrors = validateEvent(newEvent);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setWarnings([]);
      return;
    }
    setErrors([]);

    const conflictWarnings = checkTimeConflicts(newEvent, existingEvents);

    if (conflictWarnings.length > 0) {
      const confirmMsg = `Warning: Your event conflicts with existing events:\n\n${conflictWarnings
        .map((w) => `- ${w}`)
        .join("\n")}\n\nDo you want to add this event anyway?`;

      if (!window.confirm(confirmMsg)) {
        setWarnings(conflictWarnings);
        return;
      }
    }
    setWarnings([]);

    dispatch(addEvent(newEvent));
    setIsOpen(false);
    resetForm();
  };

  function toggleItem<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
  }

  if (!isOpen) return null;

  const inputClass =
    "w-full rounded border border-gray-600 bg-transparent px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="relative w-full max-w-md rounded-lg bg-black p-6 shadow-lg border border-white/25">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={() => setIsOpen(false)}
          aria-label="Close">
          <Image
            src="/x.svg"
            alt="Close"
            width={20}
            height={20}
            className="cursor-pointer"
          />
        </button>

        <h2 className="mb-6 text-2xl font-semibold text-white">
          Add New Event
        </h2>

        {errors.length > 0 && (
          <div className="mb-4 rounded bg-red-700 p-3 text-red-100">
            {errors.map((err, i) => (
              <p key={i}>⚠️ {err}</p>
            ))}
          </div>
        )}

        {warnings.length > 0 && (
          <div className="mb-4 rounded bg-yellow-700 p-3 text-yellow-100">
            {warnings.map((warn, i) => (
              <p key={i}>⚠️ {warn}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
              <option value="default" className="bg-black">
                Default
              </option>
              <option value="birthday" className="bg-black">
                Birthday
              </option>
              <option value="holiday" className="bg-black">
                Holiday
              </option>
              <option value="reminder" className="bg-black">
                Reminder
              </option>
              <option value="meeting" className="bg-black">
                Meeting
              </option>
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
              <option value="none" className="bg-black">
                None
              </option>
              <option value="daily" className="bg-black">
                Daily
              </option>
              <option value="weekly" className="bg-black">
                Weekly
              </option>
              <option value="monthly" className="bg-black">
                Monthly
              </option>
              <option value="yearly" className="bg-black">
                Yearly
              </option>
              <option value="custom" className="bg-black">
                Custom
              </option>
            </select>
          </div>
          {recurrence === "custom" && (
            <div className="mt-4 text-sm text-gray-700">
              <label className="font-medium mb-2 block">Repeat on:</label>
              <div className="flex flex-wrap justify-between w-full">
                {["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map((day) => (
                  <button
                    type="button"
                    key={day}
                    className={`px-2 py-1 border rounded ${
                      customRule.daysOfWeek.includes(day)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                    onClick={() =>
                      setCustomRule((prev) => ({
                        daysOfWeek: toggleItem(prev.daysOfWeek, day),
                      }))
                    }>
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}
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

          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 text-white transition hover:bg-blue-700">
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
}
