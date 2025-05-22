"use client";

import React, { useState, useEffect } from "react";
import moment from "moment";

type Props = {
  event: any;
  onClose: () => void;
  onDelete: () => void;
  onUpdate: (updatedEvent: any) => void;
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
  const [category, setCategory] = useState(event.category || "default");
  const [recurrence, setRecurrence] = useState(event.recurrence || "none");

  // Optional: Sync when event changes externally
  useEffect(() => {
    setTitle(event.title);
    setStart(moment(event.start).format("YYYY-MM-DDTHH:mm"));
    setEnd(moment(event.end).format("YYYY-MM-DDTHH:mm"));
    setDescription(event.description || "");
    setCategory(event.category || "default");
    setRecurrence(event.recurrence || "none");
  }, [event]);

  const handleSave = () => {
    // Basic validation could be added here
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded shadow-md w-96 space-y-4">
        <h2 className="text-lg font-semibold">Edit Event</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Title"
        />

        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full border p-2 rounded resize-none"
          rows={3}
        />

        <label className="block">
          <span className="text-sm font-semibold">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded">
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold">Recurrence</span>
          <select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
            className="w-full border p-2 rounded">
            {recurrences.map((rec) => (
              <option key={rec} value={rec}>
                {rec.charAt(0).toUpperCase() + rec.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <div className="flex justify-between">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded">
            Save
          </button>

          <button
            onClick={onDelete}
            className="bg-red-600 text-white px-4 py-2 rounded">
            Delete
          </button>

          <button onClick={onClose} className="text-gray-600 px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
