import { type ComponentProps } from "react";
import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SpinnerProps extends ComponentProps<"svg"> {
  label?: string;
}

const Spinner = ({ className, label = "Loading", ...props }: SpinnerProps) => (
  <Loader2Icon
    role="status"
    aria-label={label}
    className={cn("size-8 animate-spin", className)}
    {...props}
  />
);

export { Spinner };
