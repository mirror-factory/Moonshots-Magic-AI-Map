import { render, screen } from "@testing-library/react";
import { Sparkle } from "@/components/effects/sparkle";

vi.mock("motion/react", () => ({
  motion: {
    span: (props: any) => <span data-testid="sparkle-particle" {...props} />,
  },
}));

describe("Sparkle", () => {
  it("renders children", () => {
    render(
      <Sparkle>
        <span>Hello</span>
      </Sparkle>,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("does NOT render sparkle particles when active is false (default)", () => {
    render(
      <Sparkle>
        <span>Content</span>
      </Sparkle>,
    );
    expect(screen.queryAllByTestId("sparkle-particle")).toHaveLength(0);
  });

  it("renders sparkle particles when active is true", () => {
    render(
      <Sparkle active>
        <span>Content</span>
      </Sparkle>,
    );
    expect(screen.queryAllByTestId("sparkle-particle").length).toBeGreaterThan(
      0,
    );
  });

  it("renders correct number of particles based on count prop", () => {
    render(
      <Sparkle active count={5}>
        <span>Content</span>
      </Sparkle>,
    );
    expect(screen.queryAllByTestId("sparkle-particle")).toHaveLength(5);
  });

  it("default count is 20", () => {
    render(
      <Sparkle active>
        <span>Content</span>
      </Sparkle>,
    );
    expect(screen.queryAllByTestId("sparkle-particle")).toHaveLength(20);
  });
});
