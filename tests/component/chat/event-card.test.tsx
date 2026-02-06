import { render, screen } from "@testing-library/react";
import { EventCard } from "@/components/chat/event-card";

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, ...props }: any) => (
    <span data-testid="badge" {...props}>
      {children}
    </span>
  ),
}));

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

  it("renders formatted date (short weekday, short month, day)", () => {
    render(<EventCard event={baseEvent} />);
    const date = new Date("2026-03-15T19:00:00Z");
    const expected = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    // Date and time are rendered together in a single span
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    expect(screen.getByText(`${expected} ${timeStr}`)).toBeInTheDocument();
  });

  it("renders formatted time", () => {
    render(<EventCard event={baseEvent} />);
    const date = new Date("2026-03-15T19:00:00Z");
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    // Time appears combined with date string
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    expect(screen.getByText(`${dateStr} ${timeStr}`)).toBeInTheDocument();
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

  it('shows "TBD" when no price', () => {
    render(<EventCard event={baseEvent} />);
    expect(screen.getByText("TBD")).toBeInTheDocument();
  });

  it("shows category badge with label from CATEGORY_LABELS", () => {
    render(<EventCard event={baseEvent} />);
    // "music" maps to "Music" in CATEGORY_LABELS
    expect(screen.getByText("Music")).toBeInTheDocument();
  });

  it('shows "Featured" badge when featured is true', () => {
    const event = { ...baseEvent, featured: true };
    render(<EventCard event={event} />);
    expect(screen.getByText("Featured")).toBeInTheDocument();
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
});
