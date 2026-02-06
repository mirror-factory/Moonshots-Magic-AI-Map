import { render, screen } from "@testing-library/react";
import { MapAction } from "@/components/chat/map-action";

const mockFlyTo = vi.fn();
vi.mock("@/components/map/use-map", () => ({
  useMap: () => ({ flyTo: mockFlyTo }),
}));

describe("MapAction", () => {
  beforeEach(() => {
    mockFlyTo.mockClear();
  });

  it('renders "Flying to location" for action "flyTo"', () => {
    render(
      <MapAction
        input={{ action: "flyTo", coordinates: [-81.37, 28.54], zoom: 14 }}
      />,
    );
    expect(screen.getByText("Flying to location")).toBeInTheDocument();
  });

  it('renders "Highlighting events on map" for action "highlight"', () => {
    render(
      <MapAction
        input={{ action: "highlight", eventIds: ["evt-1", "evt-2"] }}
      />,
    );
    expect(
      screen.getByText("Highlighting events on map"),
    ).toBeInTheDocument();
  });

  it('renders "Fitting map to events" for action "fitBounds"', () => {
    render(
      <MapAction
        input={{ action: "fitBounds", eventIds: ["evt-1"] }}
      />,
    );
    expect(screen.getByText("Fitting map to events")).toBeInTheDocument();
  });

  it("returns null when input is null", () => {
    const { container } = render(
      <MapAction input={null as any} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null when input is undefined", () => {
    const { container } = render(
      <MapAction input={undefined as any} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
