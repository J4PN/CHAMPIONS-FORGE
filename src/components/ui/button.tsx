import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-pixel text-[10px] uppercase tracking-wider rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0 border",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-primary text-primary-foreground shadow-soft-primary hover:brightness-110 active:translate-y-[1px]",
        destructive:
          "border-destructive/30 bg-destructive text-destructive-foreground shadow-soft hover:brightness-110 active:translate-y-[1px]",
        outline:
          "border-border bg-card text-foreground shadow-soft hover:bg-muted hover:shadow-soft-lg",
        secondary:
          "border-border bg-secondary text-secondary-foreground shadow-soft hover:brightness-105",
        ghost: "border-transparent hover:bg-muted",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
