import type { TGVMaxAvailability } from './tgvmax'

export interface MapViewProps {
  searchResults: TGVMaxAvailability[]
  groupedResults: Record<string, TGVMaxAvailability[]>
}

export interface MapViewEmits {
  destinationSelected: [destination: string]
  trainSelected: [train: TGVMaxAvailability]
}