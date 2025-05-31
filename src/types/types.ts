export interface Card {
  id: string
  title: string
  description: string
}

export interface Column {
  id: string
  name: string
  cards: Card[]
}
