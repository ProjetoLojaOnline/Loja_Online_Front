import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

function SpinnerComponent({ className, ...props }: React.ComponentProps<"svg">) {
    return (
        <Loader2Icon role="status" aria-label="Loading" className={cn("size-12 animate-spin", className)} {...props} />
    )
}

export default SpinnerComponent; 
