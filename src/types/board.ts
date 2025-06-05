export type Card = {
  id: string
  title: string
  description: string
  updatedAt: string
}

export type Column = {
  id: string
  name: string
  isLocked?: boolean
  cards: Card[]
}
