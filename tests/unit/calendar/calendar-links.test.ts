import { generateGoogleCalendarUrl, generateOutlookUrl } from "@/lib/calendar/calendar-links";
import { createTestEvent } from "../../fixtures/events";

describe("generateGoogleCalendarUrl", () => {
  it('starts with "https://calendar.google.com/calendar/render?"', () => {
    const url = generateGoogleCalendarUrl(createTestEvent());
    expect(url).toMatch(/^https:\/\/calendar\.google\.com\/calendar\/render\?/);
  });

  it("contains action=TEMPLATE", () => {
    const url = generateGoogleCalendarUrl(createTestEvent());
    expect(url).toContain("action=TEMPLATE");
  });

  it("contains text= with event title", () => {
    const event = createTestEvent({ title: "Jazz in the Park" });
    const url = generateGoogleCalendarUrl(event);
    expect(url).toContain("text=Jazz");
  });

  it("contains dates= parameter with start/end", () => {
    const event = createTestEvent({ startDate: "2026-03-15T19:00:00Z" });
    const url = generateGoogleCalendarUrl(event);
    expect(url).toContain("dates=");
    // Start date should be present in URL-encoded ICS format
    expect(url).toContain("20260315T190000Z");
  });

  it("contains location= with venue, address, city", () => {
    const event = createTestEvent({
      venue: "Lake Eola Amphitheater",
      address: "512 E Washington St",
      city: "Orlando",
    });
    const url = generateGoogleCalendarUrl(event);
    expect(url).toContain("location=");
    // URLSearchParams encodes spaces as +, so replace + with space before checking
    const decoded = decodeURIComponent(url.replace(/\+/g, " "));
    expect(decoded).toContain("Lake Eola Amphitheater");
    expect(decoded).toContain("512 E Washington St");
    expect(decoded).toContain("Orlando");
  });

  it("default 2hr end date when no endDate", () => {
    const event = createTestEvent({
      startDate: "2026-03-15T19:00:00Z",
      endDate: undefined,
    });
    const url = generateGoogleCalendarUrl(event);
    // 19:00 + 2 hours = 21:00
    expect(url).toContain("20260315T210000Z");
  });

  it("custom endDate used when provided", () => {
    const event = createTestEvent({
      startDate: "2026-03-15T19:00:00Z",
      endDate: "2026-03-15T23:00:00Z",
    });
    const url = generateGoogleCalendarUrl(event);
    expect(url).toContain("20260315T230000Z");
  });
});

describe("generateOutlookUrl", () => {
  it('starts with "https://outlook.live.com/calendar/0/deeplink/compose?"', () => {
    const url = generateOutlookUrl(createTestEvent());
    expect(url).toMatch(/^https:\/\/outlook\.live\.com\/calendar\/0\/deeplink\/compose\?/);
  });

  it("contains subject= with event title", () => {
    const event = createTestEvent({ title: "Jazz in the Park" });
    const url = generateOutlookUrl(event);
    expect(url).toContain("subject=Jazz");
  });

  it("contains startdt= and enddt= parameters", () => {
    const url = generateOutlookUrl(createTestEvent());
    expect(url).toContain("startdt=");
    expect(url).toContain("enddt=");
  });

  it("contains location=", () => {
    const event = createTestEvent({
      venue: "Lake Eola Amphitheater",
      address: "512 E Washington St",
      city: "Orlando",
    });
    const url = generateOutlookUrl(event);
    expect(url).toContain("location=");
    const decoded = decodeURIComponent(url.replace(/\+/g, " "));
    expect(decoded).toContain("Lake Eola Amphitheater");
    expect(decoded).toContain("Orlando");
  });
});
