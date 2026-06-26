import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Input } from "@/components/ui/input";

describe("Input", () => {
  describe("rendering", () => {
    it("renders an input element", () => {
      render(<Input />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("renders with correct type", () => {
      render(<Input type="email" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
    });

    it("renders password type input (no textbox role)", () => {
      const { container } = render(<Input type="password" />);
      expect(container.querySelector("input[type=password]")).toBeInTheDocument();
    });

    it("renders placeholder text", () => {
      render(<Input placeholder="Enter email" />);
      expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    });

    it("forwards name attribute", () => {
      render(<Input name="email" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("name", "email");
    });

    it("renders as disabled", () => {
      render(<Input disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("accepts additional className", () => {
      render(<Input className="mt-4" />);
      expect(screen.getByRole("textbox").className).toContain("mt-4");
    });
  });

  describe("interaction", () => {
    it("calls onChange on every keystroke", async () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);
      await userEvent.type(screen.getByRole("textbox"), "abc");
      expect(handleChange).toHaveBeenCalledTimes(3);
    });

    it("reflects controlled value", () => {
      render(<Input value="test@email.com" onChange={vi.fn()} />);
      expect(screen.getByRole("textbox")).toHaveValue("test@email.com");
    });

    it("does not call onChange when disabled", async () => {
      const handleChange = vi.fn();
      render(<Input disabled onChange={handleChange} />);
      await userEvent.type(screen.getByRole("textbox"), "abc");
      expect(handleChange).not.toHaveBeenCalled();
    });
  });
});
