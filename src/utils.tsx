/**
 * Formats a date-time string into a human-readable date and time.
 *
 * @param dateTimeString - The ISO date-time string to format.
 * @returns A string representing the formatted date and time, using the user's locale.
 */
export function formatDateTime(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

export function isWithinDateRange(
  date: Date | undefined,
  values?: [string, string]
): boolean {
  if (!date) {
    return true; // If no date, don't filter it out
  }

  const [start, end] = values ?? []; // value => two date input values
  const startDate = start ? new Date(start) : undefined;
  const endDate = end ? new Date(end) : undefined;

  if (
    !(startDate instanceof Date || startDate === undefined) ||
    !(endDate instanceof Date || endDate === undefined)
  ) {
    console.error(
      `Filter is expected to be an array of two dates, but got ${values}`
    );
    return false;
  }

  // If one filter defined and date is undefined, filter it
  if ((startDate || endDate) && !date) {
    return false;
  }

  if (startDate && !endDate) {
    return date.getTime() >= startDate.getTime();
  } else if (!startDate && endDate) {
    return date.getTime() <= endDate.getTime();
  } else if (startDate && endDate) {
    return (
      date.getTime() >= startDate.getTime() &&
      date.getTime() <= endDate.getTime()
    );
  }

  return true;
}
