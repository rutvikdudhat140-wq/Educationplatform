import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded border border-transparent px-2 text-[0.6875rem] font-semibold whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary:
          "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]",
        accent:
          "bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]",
        navy:
          "bg-[#172554] text-white",
        outline:
          "border-line bg-white text-ink-soft",
        ghost:
          "bg-surface text-ink-muted",
        success:
          "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]",
        warning:
          "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]",
        destructive:
          "bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps({
      className: cn(badgeVariants({ variant }), className),
    }, props),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants }
