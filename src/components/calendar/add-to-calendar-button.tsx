/**
 * @module components/calendar/add-to-calendar-button
 * Dropdown button for adding events to various calendar applications.
 * Supports Google Calendar, Apple Calendar, Outlook, and ICS download.
 */

"use client";

import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { downloadICS } from "@/lib/calendar/ics-generator";
import {
  generateGoogleCalendarUrl,
  generateOutlookUrl,
  openCalendarUrl,
} from "@/lib/calendar/calendar-links";
import type { EventEntry } from "@/lib/registries/types";

interface AddToCalendarButtonProps {
  /** The event to add to calendar. */
  event: EventEntry;
  /** Optional variant for button styling. */
  variant?: "default" | "outline" | "secondary" | "ghost";
  /** Optional size for button styling. */
  size?: "default" | "sm" | "lg" | "icon";
  /** Optional className for additional styling. */
  className?: string;
}

/**
 * Dropdown button component for adding events to calendars.
 * Provides options for Google Calendar, Apple Calendar (ICS),
 * Outlook, and direct ICS download.
 */
export function AddToCalendarButton({
  event,
  variant = "outline",
  size = "sm",
  className,
}: AddToCalendarButtonProps) {
  const handleGoogleCalendar = () => {
    openCalendarUrl(generateGoogleCalendarUrl(event));
  };

  const handleOutlook = () => {
    openCalendarUrl(generateOutlookUrl(event));
  };

  const handleAppleCalendar = () => {
    downloadICS(event);
  };

  const handleDownloadICS = () => {
    downloadICS(event);
  };

  const isIconMode = size === "icon";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className} title="Add to Calendar">
          <Calendar className={isIconMode ? "h-4 w-4" : "mr-1.5 h-4 w-4"} />
          {!isIconMode && (
            <>
              Add to Calendar
              <ChevronDown className="ml-1.5 h-3 w-3" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        style={{
          background: "var(--chat-bg)",
          borderColor: "var(--border-color)",
        }}
      >
        <DropdownMenuItem onClick={handleGoogleCalendar} className="cursor-pointer">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="#4285F4" fillOpacity="0.2" />
            <path d="M12 6v6l4 2" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
          Google Calendar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAppleCalendar} className="cursor-pointer">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Apple Calendar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOutlook} className="cursor-pointer">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.16.154-.354.233-.584.24l-8.501.003v-6.73l1.07 1.07a.5.5 0 00.707-.707l-1.924-1.924a.5.5 0 00-.707 0l-1.924 1.924a.5.5 0 10.707.707l1.07-1.07v6.73H7.5V6.5h7.176V4.844l-8.498-.003c-.23-.007-.424-.086-.584-.24A.78.78 0 015.356 4V3.387l8.501.003V1.5a.5.5 0 01.5-.5h9a.5.5 0 01.5.5v5.887z" fill="#0078D4" fillOpacity="0.8" />
            <path d="M0 7.5v9a.5.5 0 00.5.5h8a.5.5 0 00.5-.5v-9a.5.5 0 00-.5-.5h-8a.5.5 0 00-.5.5zm4.5 2a2 2 0 110 4 2 2 0 010-4z" fill="#0078D4" />
          </svg>
          Outlook
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDownloadICS} className="cursor-pointer">
          <Calendar className="mr-2 h-4 w-4" />
          Download .ics File
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
