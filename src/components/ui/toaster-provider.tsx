"use client"

import { Toaster as Sonner } from "sonner"

export function Toaster() {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group-[.toaster]:bg-surface group-[.toaster]:text-foreground group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:backdrop-blur-xl",
          description: "group-[.toast]:text-text-muted",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-background",
          cancelButton: "group-[.toast]:bg-surface group-[.toast]:text-text-muted",
          success: "group-[.toast]:text-primary group-[.toast]:border-primary/20",
          error: "group-[.toast]:text-destructive group-[.toast]:border-destructive/20",
          info: "group-[.toast]:text-accent-cyan group-[.toast]:border-accent-cyan/20",
          warning: "group-[.toast]:text-primary group-[.toast]:border-primary/20",
        },
      }}
    />
  )
}
