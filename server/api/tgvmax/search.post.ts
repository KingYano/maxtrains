import { format } from 'date-fns'
import type { TGVMaxAvailability } from '~/types/tgvmax'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { departureStation, arrivalStation, date } = body
  
  if (!departureStation || !date) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required parameters'
    })
  }


  try {
    // Gérer le cas spécial de Paris intra-muros
    const departureStations = departureStation === 'PARIS_ALL' ? 
      ['PARIS (intramuros)'] : 
      [departureStation]

    let allResults: TGVMaxAvailability[] = []

    // Rechercher pour chaque gare de départ (si Paris intra-muros)
    for (const station of departureStations) {
      const stationResults = await searchTGVMaxForStation(station, arrivalStation, date)
      allResults = allResults.concat(stationResults)
    }

    // Trier par heure de départ (pas de limite)
    allResults.sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime())
    const results = allResults // Afficher tous les résultats sans limite
    
    
    return {
      data: results
    }
  } catch (error) {
    console.error('Error fetching TGVmax data:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: `Erreur lors de la récupération des données: ${error.message}`
    })
  }

async function searchTGVMaxForStation(departureStation: string, arrivalStation?: string, date?: string): Promise<TGVMaxAvailability[]> {
  try {
    // Construire l'URL pour l'API TGVMax SNCF Open Data 
    let tgvMaxUrl = `https://ressources.data.sncf.com/api/records/1.0/search/?dataset=tgvmax&rows=1000&refine.od_happy_card=OUI`
    
    // Ajouter les filtres
    if (departureStation) {
      tgvMaxUrl += `&refine.origine=${encodeURIComponent(departureStation)}`
    }
    
    if (arrivalStation && arrivalStation !== 'PARIS_ALL') {
      tgvMaxUrl += `&refine.destination=${encodeURIComponent(arrivalStation)}`
    }
    
    if (date) {
      tgvMaxUrl += `&refine.date=${date}`
    }

    
    const response = await fetch(tgvMaxUrl, {
      headers: {
        'Accept': 'application/json'
      },
      timeout: 15000
    })

    if (!response.ok) {
      console.error('TGVMax API error:', response.status, response.statusText)
      return []
    }

    const data = await response.json()
    
    if (!data.records || data.records.length === 0) {
      return []
    }

    return data.records
      .map((record: any) => {
        const fields = record.fields
        
        if (!fields.heure_depart || !fields.heure_arrivee) return null
        
        // Plus de filtrage par heure - afficher tous les trains de la journée
        
        // Créer les objets Date complets
        const departureDateTime = new Date(`${fields.date}T${fields.heure_depart}:00`)
        const arrivalDateTime = new Date(`${fields.date}T${fields.heure_arrivee}:00`)
        
        // Calculer la durée
        const diffMs = arrivalDateTime.getTime() - departureDateTime.getTime()
        const hours = Math.floor(diffMs / (1000 * 60 * 60))
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
        const duration = `${hours}h${minutes.toString().padStart(2, '0')}`
        
        // Tous les trains TGVMax sont disponibles (sinon ils ne seraient pas dans l'API)
        const status: 'available' | 'limited' | 'full' = 'available'

        return {
          trainId: fields.train_no || 'TGV',
          departureStation: {
            id: fields.origine?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
            name: fields.origine || departureStation,
            code: fields.origine || departureStation,
            coordinates: { lat: 48.844945, lng: 2.373481 }
          },
          arrivalStation: {
            id: fields.destination?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
            name: fields.destination || 'Destination inconnue',
            code: fields.destination || 'DEST',
            coordinates: { lat: 45.764043, lng: 4.835659 }
          },
          departureTime: departureDateTime.toISOString(),
          arrivalTime: arrivalDateTime.toISOString(),
          duration,
          status,
          availableSeats: 'Disponible', // L'API TGVMax ne fournit pas le nombre exact
          price: 0 // TGVmax gratuit
        } as TGVMaxAvailability
      })
      .filter(Boolean)
      // Pas de limite - afficher tous les résultats
  } catch (error) {
    console.error('Erreur lors de la recherche TGVMax pour', departureStation, ':', error)
    return []
  }
}
})