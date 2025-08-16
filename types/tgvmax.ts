import type { Station } from './station'

export interface TGVMaxAvailability {
  trainId: string
  departureStation: Station
  arrivalStation: Station
  departureTime: string
  arrivalTime: string
  duration: string
  status: 'available' | 'limited' | 'full'
  availableSeats?: number | string
  price?: number
}

export interface SearchParams {
  departureStation: string
  arrivalStation?: string
  date: string
  passengers?: number
}