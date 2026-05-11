import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLevelInfo(xp: number) {
  // Simple RPG formula: Level = floor(sqrt(XP / 50)) + 1
  const level = Math.floor(Math.sqrt(xp / 50)) + 1
  
  // Next level XP
  const nextLevelXp = 50 * Math.pow(level, 2)
  const currentLevelXp = 50 * Math.pow(level - 1, 2)
  
  const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100
  
  const ranks = [
    "Novato", "Aventureiro", "Guerreiro", "Elite", "Mestre", "Lenda", "Divino"
  ]
  const rank = ranks[Math.min(Math.floor((level - 1) / 10), ranks.length - 1)]

  return {
    level,
    progress: Math.min(progress, 100),
    rank,
    xpToNext: nextLevelXp - xp
  }
}
