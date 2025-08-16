export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchQuery = query.q as string
  
  if (!searchQuery || searchQuery.length < 2) {
    return {
      stations: [],
      error: 'Query too short'
    }
  }

  try {
    // Récupérer les gares TGVMax depuis l'API officielle
    const stations = await getTGVMaxStations(searchQuery)
    
    return {
      stations: stations.slice(0, 12)
    }
  } catch (error) {
    console.error('Error fetching TGVMax stations:', error)
    
    return {
      stations: [],
      error: 'Failed to fetch stations'
    }
  }
})

async function getTGVMaxStations(searchQuery: string) {
  try {
    // Récupérer toutes les gares d'origine TGVMax
    const originsUrl = `https://ressources.data.sncf.com/api/records/1.0/search/?dataset=tgvmax&rows=0&refine.od_happy_card=OUI&facet=origine`
    const destinationsUrl = `https://ressources.data.sncf.com/api/records/1.0/search/?dataset=tgvmax&rows=0&refine.od_happy_card=OUI&facet=destination`
    
    const [originsResponse, destinationsResponse] = await Promise.all([
      fetch(originsUrl),
      fetch(destinationsUrl)
    ])

    const [originsData, destinationsData] = await Promise.all([
      originsResponse.json(),
      destinationsResponse.json()
    ])

    // Combiner origines et destinations et supprimer les doublons
    const allStations = new Set()
    
    originsData.facet_groups?.[0]?.facets?.forEach((facet: any) => {
      allStations.add(facet.name)
    })
    
    destinationsData.facet_groups?.[0]?.facets?.forEach((facet: any) => {
      allStations.add(facet.name)
    })

    // Convertir en format attendu et filtrer par recherche
    const queryLower = searchQuery.toLowerCase()
    const stationsList = Array.from(allStations) as string[]
    const stations = stationsList
      .filter((stationName: string) => 
        stationName.toLowerCase().includes(queryLower)
      )
      .map((stationName: string) => ({
        id: stationName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
        name: stationName,
        fullName: `${stationName} - TGVmax`,
        city: stationName.includes('(intramuros)') ? stationName.replace(' (intramuros)', '') : stationName.split(' ')[0],
        code: stationName === 'PARIS (intramuros)' ? 'PARIS_ALL' : stationName,
        coordinates: getStationCoordinates(stationName)
      }))

    return stations
  } catch (error) {
    console.error('Error fetching TGVMax stations:', error)
    return []
  }
}

function getStationCoordinates(stationName: string) {
  // Coordonnées approximatives des principales gares TGVMax
  const coords: { [key: string]: { lat: number; lng: number } } = {
    'PARIS (intramuros)': { lat: 48.856614, lng: 2.3522219 },
    'LYON (intramuros)': { lat: 45.760596, lng: 4.859409 },
    'BORDEAUX ST JEAN': { lat: 44.825932, lng: -0.569716 },
    'MARSEILLE ST CHARLES': { lat: 43.302666, lng: 5.380407 },
    'RENNES': { lat: 48.103754, lng: -1.672874 },
    'POITIERS': { lat: 46.580224, lng: 0.340375 },
    'TOULOUSE MATABIAU': { lat: 43.610682, lng: 1.453268 },
    'NANTES': { lat: 47.217271, lng: -1.542198 },
    'STRASBOURG': { lat: 48.584614, lng: 7.735259 },
    'AVIGNON TGV': { lat: 43.921684, lng: 4.786255 }
  }
  
  return coords[stationName] || { lat: 46.227638, lng: 2.213749 } // Centre de la France par défaut
}

