/**
 * @module lib/calendar/calendar-links
 * Generates URLs for adding events to Google Calendar and Outlook.
 */

import type { EventEntry } from "@/lib/registries/types";

/**
 * Formats a date for Google Calendar URL (YYYYMMDDTHHMMSSZ format).
 * @param date - The date to format.
 * @returns Formatted date string.
 */
function formatGoogleDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

/**
 * Formats a date for Outlook URL (ISO 8601 format).
 * @param date - The date to format.
 * @returns Formatted date string.
 */
function formatOutlookDate(date: Date): string {
  return date.toISOString().replace(/\.\d{3}/, "");
}

/**
 * Generates a Google Calendar "Add Event" URL.
 * Opens Google Calendar with event details pre-filled.
 * @param event - The event to add.
 * @returns Google Calendar URL.
 */
export function generateGoogleCalendarUrl(event: EventEntry): string {
  const startDate = new Date(event.startDate);
  const endDate = event.endDate
    ? new Date(event.endDate)
    : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours

  const location = [event.venue, event.address, event.city].filter(Boolean).join(", ");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
    details: event.description + (event.url ? `\n\nMore info: ${event.url}` : ""),
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates an Outlook Web Calendar "Add Event" URL.
 * Opens Outlook Calendar with event details pre-filled.
 * @param event - The event to add.
 * @returns Outlook Calendar URL.
 */
export function generateOutlookUrl(event: EventEntry): string {
  const startDate = new Date(event.startDate);
  const endDate = event.endDate
    ? new Date(event.endDate)
    : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours

  const location = [event.venue, event.address, event.city].filter(Boolean).join(", ");

  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: formatOutlookDate(startDate),
    enddt: formatOutlookDate(endDate),
    body: event.description + (event.url ? `\n\nMore info: ${event.url}` : ""),
    location,
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Opens a calendar URL in a new window/tab.
 * @param url - The calendar URL to open.
 */
export function openCalendarUrl(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}
