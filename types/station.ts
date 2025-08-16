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
}