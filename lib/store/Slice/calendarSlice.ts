import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Category =
  | "default"
  | "birthday"
  | "holiday"
  | "reminder"
  | "meeting";
export type Recurrence =
  | "none"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom";

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; 
  end: string; 
  description?: string;
  category: Category;
  recurrence?: Recurrence;
}

interface CalendarState {
  events: CalendarEvent[];
  selectedDate: string | null;
}

const initialState: CalendarState = {
  events: [],
  selectedDate: null,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    addEvent(state, action: PayloadAction<CalendarEvent>) {
      state.events.push(action.payload);
    },
    removeEvent(state, action: PayloadAction<string>) {
      state.events = state.events.filter(
        (event) => event.id !== action.payload
      );
    },
    updateEvent(state, action: PayloadAction<CalendarEvent>) {
      const index = state.events.findIndex(
        (event) => event.id === action.payload.id
      );
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    setSelectedDate(state, action: PayloadAction<string | null>) {
      state.selectedDate = action.payload;
    },
    clearEvents(state) {
      state.events = [];
    },
  },
});

export const {
  addEvent,
  removeEvent,
  updateEvent,
  setSelectedDate,
  clearEvents,
} = calendarSlice.actions;

export default calendarSlice.reducer;
