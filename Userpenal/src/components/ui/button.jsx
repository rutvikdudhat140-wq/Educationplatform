import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border text-[0.8125rem] font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-150 outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#172554] text-white hover:bg-[#0F172A] shadow-none",
        primary:
          "border-transparent bg-[#172554] text-white hover:bg-[#0F172A] shadow-none",
        outline:
          "border-line bg-white text-[#172554] hover:border-[#172554] hover:bg-[#F8FAFC] shadow-none",
        secondary:
          "border-line bg-white text-[#172554] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] shadow-none",
        accent:
          "border-transparent bg-[#F97316] text-white hover:bg-[#EA580C] shadow-none",
        ghost:
          "border-transparent text-ink-soft hover:bg-surface hover:text-ink shadow-none",
        destructive:
          "border-transparent bg-destructive/10 text-destructive hover:bg-destructive hover:text-white",
        link: "border-transparent text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default:
          "h-8.5 min-h-[34px] px-3.5 text-[0.8125rem] font-bold rounded-[6px]",
        xs: "h-7 min-h-[28px] rounded px-2 text-[0.75rem] font-bold",
        sm: "h-8 min-h-[32px] rounded px-2.5 text-[0.78125rem] font-bold",
        lg: "h-9.5 min-h-[38px] px-4 text-[0.8125rem] font-bold rounded-lg",
        xl: "h-10 min-h-[40px] px-5 text-[0.875rem] font-bold rounded-lg",
        icon: "size-8.5 min-h-[34px] min-w-[34px] rounded-[6px]",
        "icon-xs": "size-7 rounded min-h-[28px] min-w-[28px]",
        "icon-sm": "size-8 rounded min-h-[32px] min-w-[32px]",
        "icon-lg": "size-9.5 rounded-lg min-h-[38px] min-w-[38px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
      nativeButton={asChild ? false : undefined}
      render={asChild ? children : undefined}
    >
      {!asChild ? children : undefined}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants }
