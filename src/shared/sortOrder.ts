import type { Card } from '@/types'

export const detectSortOrder = (cards: Card[]): { isSorted: boolean, ascending: boolean } => {
  const sortedAsc = [...cards].sort((a, b) => a.title.localeCompare(b.title))
  const sortedDesc = [...cards].sort((a, b) => b.title.localeCompare(a.title))

  const isAsc = cards.every((card, i) => card.id === sortedAsc[i]?.id)
  const isDesc = cards.every((card, i) => card.id === sortedDesc[i]?.id)

  return {
    isSorted: isAsc || isDesc,
    ascending: isAsc,
  }
}
