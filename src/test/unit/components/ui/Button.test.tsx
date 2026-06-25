import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  describe("rendering", () => {
    it("renders children text", () => {
      render(<Button>Submit</Button>);
      expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });

    it("applies primary variant styles by default", () => {
      render(<Button>Click</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("border-black");
    });

    it("renders as disabled when disabled prop is passed", () => {
      render(<Button disabled>Click</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("accepts additional className", () => {
      render(<Button className="w-full">Click</Button>);
      expect(screen.getByRole("button").className).toContain("w-full");
    });

    it("forwards type attribute", () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });
  });

  describe("interaction", () => {
    it("calls onClick when clicked", async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      await userEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledOnce();
    });

    it("does not call onClick when disabled", async () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Click</Button>);
      await userEvent.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
