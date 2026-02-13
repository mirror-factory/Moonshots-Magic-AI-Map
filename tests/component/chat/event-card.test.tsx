import { render, screen } from "@testing-library/react";
import { EventCard } from "@/components/chat/event-card";

const baseEvent = {
  id: "evt-1",
  title: "Jazz Night",
  description: "Live jazz music",
  category: "music" as const,
  venue: "Lake Eola",
  city: "Orlando",
  startDate: "2026-03-15T19:00:00Z",
  tags: ["jazz"],
};

describe("EventCard", () => {
  it("renders event title", () => {
    render(<EventCard event={baseEvent} />);
    expect(screen.getByText("Jazz Night")).toBeInTheDocument();
  });

  it("renders venue name", () => {
    render(<EventCard event={baseEvent} />);
    expect(screen.getByText("Lake Eola")).toBeInTheDocument();
  });

  it("renders formatted date and time with separator", () => {
    render(<EventCard event={baseEvent} />);
    const date = new Date("2026-03-15T19:00:00Z");
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    // Date and time are rendered in a single span with · separator
    expect(screen.getByText(`${dateStr} · ${timeStr}`)).toBeInTheDocument();
  });

  it("renders source label as blue link when url provided", () => {
    const event = {
      ...baseEvent,
      url: "https://example.com/event",
      source: { type: "ticketmaster" },
    };
    render(<EventCard event={event} />);
    const link = screen.getByText("Ticketmaster");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://example.com/event");
  });

  it("renders source label as plain text when no url", () => {
    const event = {
      ...baseEvent,
      source: { type: "ticketmaster" },
    };
    render(<EventCard event={event} />);
    const label = screen.getByText("Ticketmaster");
    expect(label.tagName).toBe("SPAN");
  });

  it("does NOT show category badge (compact card)", () => {
    render(<EventCard event={baseEvent} />);
    expect(screen.queryByText("Music")).not.toBeInTheDocument();
  });

  it('does NOT show "Featured" badge when featured is true (compact card)', () => {
    const event = { ...baseEvent, featured: true };
    render(<EventCard event={event} />);
    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
  });

  it('does NOT show "Featured" badge when featured is false', () => {
    const event = { ...baseEvent, featured: false };
    render(<EventCard event={event} />);
    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
  });

  it('does NOT show "Featured" badge when featured is undefined', () => {
    render(<EventCard event={baseEvent} />);
    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
  });

  it("renders Learn More button when onOpenDetail provided", () => {
    const onOpenDetail = vi.fn();
    render(<EventCard event={baseEvent} onOpenDetail={onOpenDetail} />);
    expect(screen.getByText("Learn More")).toBeInTheDocument();
  });

  it("does NOT render Learn More button without onOpenDetail", () => {
    render(<EventCard event={baseEvent} />);
    expect(screen.queryByText("Learn More")).not.toBeInTheDocument();
  });
});
