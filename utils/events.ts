import moment from "moment";

export const PIXELS_PER_MINUTE = 2 / 3;
export const EVENT_PADDING = 2;

const RECURRENCE_UNITS: Record<string, moment.unitOfTime.DurationConstructor> =
  {
    daily: "days",
    weekly: "weeks",
    monthly: "months",
    yearly: "years",
  };

export function expandRecurringEvents(
  events: any[],
  rangeStart: moment.Moment,
  rangeEnd: moment.Moment
) {
  const results: any[] = [];

  for (const event of events) {
    const start = moment(event.start);
    const end = moment(event.end);

    if (!event.recurrence || event.recurrence === "none") {
      if (end.isBefore(rangeStart) || start.isAfter(rangeEnd)) continue;

      results.push({
        ...event,
        start: moment.max(start, rangeStart).toISOString(),
        end: moment.min(end, rangeEnd).toISOString(),
      });
      continue;
    }

    if (event.recurrence === "custom") {
      console.warn(`Custom recurrence not supported yet: ${event.title}`);
      continue;
    }

    const unit = RECURRENCE_UNITS[event.recurrence];
    if (!unit) continue;

    let currentStart = start.clone();
    let currentEnd = end.clone();
    let safety = 0;

    while (currentStart.isSameOrBefore(rangeEnd)) {
      if (currentEnd.isAfter(rangeStart)) {
        results.push({
          ...event,
          id: `${event.id}`,
          start: moment.max(currentStart, rangeStart).toISOString(),
          end: moment.min(currentEnd, rangeEnd).toISOString(),
        });
      }
      currentStart.add(1, unit);
      currentEnd.add(1, unit);

      if (++safety > 500) break;
    }
  }

  return results;
}

export function getVisibleEvents(events: any[], selectedDate: moment.Moment) {
  const dayStart = selectedDate.clone().startOf("day");
  const dayEnd = selectedDate.clone().endOf("day");
  return expandRecurringEvents(events, dayStart, dayEnd);
}

export function groupAndPositionEvents(
  events: any[],
  selectedDate: moment.Moment
) {
  const positioned: any[] = [];
  let group: any[] = [];
  let groupEnd: moment.Moment | null = null;

  events.sort((a, b) => moment(a.start).diff(moment(b.start)));

  for (const ev of events) {
    const start = moment(ev.start);
    const end = moment(ev.end);

    if (!groupEnd || start.isBefore(groupEnd)) {
      group.push(ev);
      groupEnd = moment.max(groupEnd ?? end, end);
    } else {
      assignColumns(group);
      positioned.push(...group);
      group = [ev];
      groupEnd = end;
    }
  }

  if (group.length) {
    assignColumns(group);
    positioned.push(...group);
  }

  return positioned;
}

function assignColumns(events: any[]) {
  const columns: any[][] = [];

  for (const ev of events) {
    let placed = false;

    for (let i = 0; i < columns.length; i++) {
      const lastEvent = columns[i][columns[i].length - 1];
      if (moment(ev.start).isSameOrAfter(moment(lastEvent.end))) {
        columns[i].push(ev);
        ev.columnIndex = i;
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([ev]);
      ev.columnIndex = columns.length - 1;
    }
  }

  events.forEach((ev) => (ev.totalColumns = columns.length));
}
