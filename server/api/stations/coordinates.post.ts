import { staticCoordinates } from '~/utils/station-coordinates'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const stationNames = body.stations
  
  // Validation des inputs
  if (!stationNames || !Array.isArray(stationNames)) {
    return { coordinates: {} }
  }
  
  
  // Vérifier que chaque station est une string
  for (const station of stationNames) {
    if (typeof station !== 'string' || station.length > 100) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nom de gare invalide'
      })
    }
  }
  
  try {
    const coordinates: Record<string, { lat: number; lng: number }> = {}
    
    for (const stationName of stationNames) {
      if (staticCoordinates[stationName]) {
        coordinates[stationName] = staticCoordinates[stationName]
      }
    }
    
    
    return { coordinates }
  } catch (error) {
    console.error('Error fetching station coordinates:', error)
    return { coordinates: {} }
  }
})