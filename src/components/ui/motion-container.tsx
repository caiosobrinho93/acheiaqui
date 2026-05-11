"use client"

import { motion, HTMLMotionProps } from "framer-motion"
import { ReactNode } from "react"

interface MotionContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  delay?: number
  stagger?: number
}

export const MotionContainer = ({ 
  children, 
  delay = 0, 
  stagger = 0.1,
  ...props 
}: MotionContainerProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: stagger
          }
        }
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const MotionItem = ({ 
  children,
  className,
  ...props 
}: { 
  children: ReactNode
  className?: string
} & HTMLMotionProps<"div">) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
