/**
 * @module lib/calendar/ics-generator
 * Generates ICS (iCalendar) format files for event calendar integration.
 * Supports Apple Calendar, Outlook, and other calendar applications.
 */

import type { EventEntry } from "@/lib/registries/types";

/**
 * Formats a Date object to ICS date-time format (YYYYMMDDTHHMMSSZ).
 * @param date - The date to format.
 * @returns ICS-formatted date string.
 */
function formatICSDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

/**
 * Escapes special characters for ICS format.
 * ICS spec requires escaping commas, semicolons, and backslashes.
 * @param text - The text to escape.
 * @returns Escaped text safe for ICS.
 */
function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Generates a unique identifier for an event.
 * @param eventId - The event's internal ID.
 * @returns A unique UID for the ICS event.
 */
function generateUID(eventId: string): string {
  return `${eventId}@moonshotsandmagic.com`;
}

/**
 * Generates an ICS calendar file string for an event.
 * @param event - The event to convert to ICS format.
 * @returns ICS file content as a string.
 */
export function generateICS(event: EventEntry): string {
  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours
  const now = new Date();

  const location = [event.venue, event.address, event.city].filter(Boolean).join(", ");

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Moonshots & Magic//Event Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${generateUID(event.id)}`,
    `DTSTAMP:${formatICSDate(now)}`,
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `DESCRIPTION:${escapeICS(event.description)}`,
    `LOCATION:${escapeICS(location)}`,
    event.url ? `URL:${event.url}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return icsContent;
}

/**
 * Triggers a download of an ICS file for the given event.
 * @param event - The event to download as ICS.
 */
export function downloadICS(event: EventEntry): void {
  const icsContent = generateICS(event);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
