import { generateICS } from "@/lib/calendar/ics-generator";
import { createTestEvent } from "../../fixtures/events";

describe("generateICS", () => {
  it("output contains BEGIN:VCALENDAR and END:VCALENDAR", () => {
    const ics = generateICS(createTestEvent());
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
  });

  it("output contains BEGIN:VEVENT and END:VEVENT", () => {
    const ics = generateICS(createTestEvent());
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
  });

  it("output contains DTSTART with formatted date", () => {
    const event = createTestEvent({ startDate: "2026-03-15T19:00:00Z" });
    const ics = generateICS(event);
    // ICS format removes dashes and colons: 20260315T190000Z
    expect(ics).toContain("DTSTART:20260315T190000Z");
  });

  it("output contains SUMMARY with event title", () => {
    const event = createTestEvent({ title: "Jazz in the Park" });
    const ics = generateICS(event);
    expect(ics).toContain("SUMMARY:Jazz in the Park");
  });

  it("SUMMARY escapes commas and semicolons", () => {
    const event = createTestEvent({ title: "Food, Fun; Games" });
    const ics = generateICS(event);
    expect(ics).toContain("SUMMARY:Food\\, Fun\\; Games");
  });

  it("default end date is 2 hours after start when no endDate", () => {
    const event = createTestEvent({
      startDate: "2026-03-15T19:00:00Z",
      endDate: undefined,
    });
    const ics = generateICS(event);
    // 19:00 + 2 hours = 21:00 => 20260315T210000Z
    expect(ics).toContain("DTEND:20260315T210000Z");
  });

  it("custom endDate is used when provided", () => {
    const event = createTestEvent({
      startDate: "2026-03-15T19:00:00Z",
      endDate: "2026-03-15T23:00:00Z",
    });
    const ics = generateICS(event);
    expect(ics).toContain("DTEND:20260315T230000Z");
  });

  it("LOCATION includes venue, address, city", () => {
    const event = createTestEvent({
      venue: "Lake Eola Amphitheater",
      address: "512 E Washington St",
      city: "Orlando",
    });
    const ics = generateICS(event);
    expect(ics).toContain("LOCATION:Lake Eola Amphitheater\\, 512 E Washington St\\, Orlando");
  });

  it("output contains VERSION:2.0", () => {
    const ics = generateICS(createTestEvent());
    expect(ics).toContain("VERSION:2.0");
  });

  it("output contains PRODID", () => {
    const ics = generateICS(createTestEvent());
    expect(ics).toContain("PRODID:");
  });
});
