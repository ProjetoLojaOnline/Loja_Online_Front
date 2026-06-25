import { render, screen } from "@testing-library/react";

import { Logo } from "@/components/common/Logo";

describe("Logo", () => {
  it("renders the brand name ALL", () => {
    render(<Logo />);
    expect(screen.getByText("ALL")).toBeInTheDocument();
  });

  it("renders the brand name BUY", () => {
    render(<Logo />);
    expect(screen.getByText("BUY")).toBeInTheDocument();
  });

  it("renders the copyright symbol", () => {
    render(<Logo />);
    expect(screen.getByText("©")).toBeInTheDocument();
  });

  it("applies brand gradient class to BUY text", () => {
    render(<Logo />);
    const buyText = screen.getByText("BUY");
    expect(buyText.className).toContain("brand-gradient-text");
  });
});
