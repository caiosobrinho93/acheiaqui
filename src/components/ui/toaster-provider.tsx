"use client"

import { Toaster as Sonner } from "sonner"

export function Toaster() {
  return (
    <Sonner
      className="toaster group"
      position="top-center"
      expand={false}
      closeButton={true}
      toastOptions={{
        classNames: {
          toast: "group-[.toaster]:bg-surface/80 group-[.toaster]:text-foreground group-[.toaster]:border-white/10 group-[.toaster]:shadow-[0_0_40px_rgba(0,0,0,0.5)] group-[.toaster]:rounded-2xl group-[.toaster]:backdrop-blur-xl cursor-pointer hover:scale-[1.02] transition-transform",
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
