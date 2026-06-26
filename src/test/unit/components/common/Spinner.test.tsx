import { render, screen } from "@testing-library/react";

import { Spinner } from "@/components/common/Spinner";

describe("Spinner", () => {
  it("renders with default accessible label", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });

  it("accepts a custom label", () => {
    render(<Spinner label="Carregando produtos" />);
    expect(screen.getByLabelText("Carregando produtos")).toBeInTheDocument();
  });

  it("accepts additional className", () => {
    render(<Spinner className="text-red-500" />);
    expect(screen.getByRole("status").getAttribute("class")).toContain("text-red-500");
  });

  it("has animate-spin class", () => {
    render(<Spinner />);
    expect(screen.getByRole("status").getAttribute("class")).toContain("animate-spin");
  });
});
