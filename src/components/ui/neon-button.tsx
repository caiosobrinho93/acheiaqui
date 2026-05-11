"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Slot } from "@radix-ui/react-slot"

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "glass"
  size?: "sm" | "md" | "lg" | "icon"
  asChild?: boolean
}

const MotionSlot = motion(Slot)

export const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-background shadow-neon-soft hover:shadow-neon-strong",
      secondary: "bg-surface text-foreground border border-white/10 hover:border-primary/50",
      outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-background",
      glass: "bg-white/5 backdrop-blur-md border border-white/10 text-foreground hover:bg-white/10",
    }

    const sizes = {
      sm: "px-6 py-2 text-xs",
      md: "px-8 py-4 text-sm",
      lg: "px-12 py-5 text-lg",
      icon: "h-12 w-12 flex items-center justify-center p-0",
    }

    const Comp = asChild ? MotionSlot : motion.button

    const sharedProps = {
      ref: ref as any,
      whileTap: { scale: 0.96 },
      className: cn(
        "relative flex items-center justify-center rounded-2xl font-semibold tracking-normal transition-all duration-300 overflow-hidden",
        variants[variant],
        sizes[size],
        className
      ),
      ...props
    }

    if (asChild) {
      return (
        <Comp {...(sharedProps as any)}>
          {props.children}
        </Comp>
      )
    }

    return (
      <Comp {...(sharedProps as any)}>
        <div className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
          {props.children}
        </div>
        <div className="absolute inset-0 bg-white/20 opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none" />
      </Comp>
    )
  }
)
NeonButton.displayName = "NeonButton"
