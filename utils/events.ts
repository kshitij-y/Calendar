import moment from "moment";

export const PIXELS_PER_MINUTE = 2 / 3;
export const EVENT_PADDING = 2;

export function getVisibleEvents(events: any[], selectedDate: moment.Moment) {
  const dayStart = selectedDate.clone().startOf("day");
  const dayEnd = selectedDate.clone().endOf("day");

  return events
    .map((event) => {
      const start = moment(event.start);
      const end = moment(event.end);

      if (end.isBefore(dayStart) || start.isAfter(dayEnd)) return null;

      return {
        ...event,
        start: moment.max(start, dayStart).toISOString(),
        end: moment.min(end, dayEnd).toISOString(),
      };
    })
    .filter(Boolean) as typeof events;
}

export function groupAndPositionEvents(
  events: any[],
  selectedDate: moment.Moment
) {
  const positioned: any[] = [];
  let activeGroup: any[] = [];
  let lastEnd = null;

  events.sort((a, b) => moment(a.start).diff(moment(b.start)));

  for (let i = 0; i < events.length; i++) {
    const curr = events[i];
    const currStart = moment(curr.start);
    const currEnd = moment(curr.end);

    if (!lastEnd || currStart.isBefore(lastEnd)) {
      activeGroup.push(curr);
      lastEnd = moment.max(lastEnd ?? currEnd, currEnd);
    } else {
      assignColumns(activeGroup);
      positioned.push(...activeGroup);
      activeGroup = [curr];
      lastEnd = currEnd;
    }
  }

  if (activeGroup.length) {
    assignColumns(activeGroup);
    positioned.push(...activeGroup);
  }

  return positioned;
}

function assignColumns(group: any[]) {
  const columns: any[][] = [];

  for (let i = 0; i < group.length; i++) {
    const ev = group[i];
    let placed = false;

    for (let col = 0; col < columns.length; col++) {
      const last = columns[col][columns[col].length - 1];
      if (moment(ev.start).isSameOrAfter(moment(last.end))) {
        columns[col].push(ev);
        ev.columnIndex = col;
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([ev]);
      ev.columnIndex = columns.length - 1;
    }
  }

  group.forEach((ev) => (ev.totalColumns = columns.length));
}
