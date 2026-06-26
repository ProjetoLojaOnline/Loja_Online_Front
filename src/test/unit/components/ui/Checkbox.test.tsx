import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Checkbox } from "@/components/ui/checkbox";

describe("Checkbox", () => {
  describe("rendering", () => {
    it("renders unchecked by default", () => {
      render(<Checkbox />);
      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it("renders checked when defaultChecked is true", () => {
      render(<Checkbox defaultChecked />);
      expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("renders as disabled", () => {
      render(<Checkbox disabled />);
      expect(screen.getByRole("checkbox")).toBeDisabled();
    });
  });

  describe("interaction", () => {
    it("calls onCheckedChange with true when clicked while unchecked", async () => {
      const handleCheckedChange = vi.fn();
      render(<Checkbox onCheckedChange={handleCheckedChange} />);
      await userEvent.click(screen.getByRole("checkbox"));
      expect(handleCheckedChange).toHaveBeenCalledWith(true);
    });

    it("calls onCheckedChange with false when clicked while checked", async () => {
      const handleCheckedChange = vi.fn();
      render(<Checkbox defaultChecked onCheckedChange={handleCheckedChange} />);
      await userEvent.click(screen.getByRole("checkbox"));
      expect(handleCheckedChange).toHaveBeenCalledWith(false);
    });

    it("does not call onCheckedChange when disabled", async () => {
      const handleCheckedChange = vi.fn();
      render(<Checkbox disabled onCheckedChange={handleCheckedChange} />);
      await userEvent.click(screen.getByRole("checkbox"));
      expect(handleCheckedChange).not.toHaveBeenCalled();
    });

    it("toggles between checked and unchecked on consecutive clicks", async () => {
      const handleCheckedChange = vi.fn();
      render(<Checkbox onCheckedChange={handleCheckedChange} />);
      await userEvent.click(screen.getByRole("checkbox"));
      await userEvent.click(screen.getByRole("checkbox"));
      expect(handleCheckedChange).toHaveBeenNthCalledWith(1, true);
      expect(handleCheckedChange).toHaveBeenNthCalledWith(2, false);
    });
  });
});
