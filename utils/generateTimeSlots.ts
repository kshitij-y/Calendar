export const generateTimeSlots = (
  startHour = 0,
  endHour = 12,
  interval = 60
) => {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += interval) {
      const h = (hour % 12 === 0 ? 12 : hour % 12).toString().padStart(2, "0");
      const m = min.toString().padStart(2, "0");
      const suffix = hour < 12 ? "AM" : "PM";
      slots.push(`${h}:${m} ${suffix}`);
    }
  }
  return slots;
};
