import { render, screen, fireEvent } from "@testing-library/react";
import { ChatTrigger } from "@/components/chat/chat-trigger";

vi.mock("motion/react", () => ({
  motion: {
    svg: (props: any) => <svg {...props} />,
  },
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

describe("ChatTrigger", () => {
  it("renders a button element", () => {
    render(<ChatTrigger open={false} onClick={() => {}} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it('button has title "Open chat" when open is false', () => {
    render(<ChatTrigger open={false} onClick={() => {}} />);
    expect(screen.getByTitle("Open chat")).toBeInTheDocument();
  });

  it('button has title "Close chat" when open is true', () => {
    render(<ChatTrigger open={true} onClick={() => {}} />);
    expect(screen.getByTitle("Close chat")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<ChatTrigger open={false} onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
