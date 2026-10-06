import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 min-h-[38px] w-full min-w-0 rounded-md border border-input bg-background px-3 py-1.5 text-[0.875rem] leading-6 text-ink transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-slate-400 focus-visible:border-[#2563EB] focus-visible:ring-[2px] focus-visible:ring-[#2563EB]/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-[2px] aria-invalid:ring-destructive/20",
        className
      )}
      {...props} />
  );
}

export { Input }
