import type { DestinationType, RegionType, StationMetadata } from '~/utils/station-categories'

export interface Station {
  id: string
  name: string
  code: string
  coordinates: {
    lat: number
    lng: number
  }
  city?: string
  region?: string
  // Nouveaux champs pour les filtres thématiques
  category?: DestinationType
  regionType?: RegionType
  tags?: string[]
  description?: string
  metadata?: StationMetadata
}