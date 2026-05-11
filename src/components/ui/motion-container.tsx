"use client"

import { ReactNode } from "react"

interface MotionContainerProps {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: number
  [key: string]: any
}

export const MotionContainer = ({ 
  children, 
  className,
  delay,
  stagger,
  ...props 
}: MotionContainerProps) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

export const MotionItem = ({ 
  children,
  className,
  ...props 
}: { 
  children: ReactNode
  className?: string
  [key: string]: any
}) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}
