import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { FaCheck } from "react-icons/fa6";

import { cn } from "@/lib/utils"

function CheckboxComponent({
    className,
    ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                "peer border-input bg-white data-[state=checked]:bg-gray-300 border-gray-300 data-[state=checked]:text-gray-500 aria-invalid:ring-destructive/20 aria-invalid:border-destructive size-4 shrink-0 rounded-sm border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="grid place-content-center text-current transition-none"
            >
                <FaCheck className="size-3.5" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
}

export { CheckboxComponent }
