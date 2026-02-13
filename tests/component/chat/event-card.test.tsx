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

  it('shows "Free" when price.isFree is true', () => {
    const event = {
      ...baseEvent,
      price: { min: 0, max: 0, isFree: true },
    };
    render(<EventCard event={event} />);
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it('shows price range "$10\u2013$25" when min !== max', () => {
    const event = {
      ...baseEvent,
      price: { min: 10, max: 25, isFree: false },
    };
    render(<EventCard event={event} />);
    expect(screen.getByText("$10\u2013$25")).toBeInTheDocument();
  });

  it('shows single price "$15" when min === max', () => {
    const event = {
      ...baseEvent,
      price: { min: 15, max: 15, isFree: false },
    };
    render(<EventCard event={event} />);
    expect(screen.getByText("$15")).toBeInTheDocument();
  });

  it("hides price row when no price data", () => {
    const { container } = render(<EventCard event={baseEvent} />);
    // Tag icon (price row) should not be present when no price
    const tagIcons = container.querySelectorAll(".lucide-tag");
    expect(tagIcons.length).toBe(0);
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

  it("renders Learn More button when coordinates and onShowOnMap provided", () => {
    const event = { ...baseEvent, coordinates: [-81.37, 28.54] as [number, number] };
    const onShowOnMap = vi.fn();
    render(<EventCard event={event} onShowOnMap={onShowOnMap} />);
    expect(screen.getByText("Learn More")).toBeInTheDocument();
  });

  it("does NOT render Learn More button without coordinates", () => {
    const onShowOnMap = vi.fn();
    render(<EventCard event={baseEvent} onShowOnMap={onShowOnMap} />);
    expect(screen.queryByText("Learn More")).not.toBeInTheDocument();
  });
});
