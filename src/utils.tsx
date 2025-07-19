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
