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

  const staticCoordinates: Record<string, { lat: number; lng: number }> = {
    'PARIS (intramuros)': { lat: 48.856614, lng: 2.3522219 },
    'LYON (intramuros)': { lat: 45.760596, lng: 4.859409 },
    'BORDEAUX ST JEAN': { lat: 44.825932, lng: -0.569716 },
    'MARSEILLE ST CHARLES': { lat: 43.302666, lng: 5.380407 },
    'RENNES': { lat: 48.103754, lng: -1.672874 },
    'POITIERS': { lat: 46.580224, lng: 0.340375 },
    'NANTES': { lat: 47.217271, lng: -1.542198 },
    'AVIGNON TGV': { lat: 43.921684, lng: 4.786255 },
    'LILLE (intramuros)': { lat: 50.636, lng: 3.070 },
    'TOURS': { lat: 47.394, lng: 0.689 },
    'ANGERS SAINT LAUD': { lat: 47.465, lng: -0.556 },
    'LE MANS': { lat: 48.007, lng: 0.194 },
    'ANGOULEME': { lat: 45.654, lng: 0.159 },
    'NIORT': { lat: 46.323, lng: -0.459 },
    'LA ROCHELLE VILLE': { lat: 46.158, lng: -1.151 },
    'CHATELLERAULT': { lat: 46.816, lng: 0.546 },
    'ST PIERRE DES CORPS': { lat: 47.387, lng: 0.748 },
    'VALENCE TGV': { lat: 44.982, lng: 4.785 },
    'MONTPELLIER SUD DE FRANCE': { lat: 43.596, lng: 3.921 },
    'AVIGNON CENTRE': { lat: 43.944, lng: 4.805 },
    'ORANGE': { lat: 44.136, lng: 4.808 },
    'VALENCE VILLE': { lat: 44.930, lng: 4.892 },
    'NIMES PONT DU GARD': { lat: 43.836, lng: 4.360 },
    'ARRAS': { lat: 50.291, lng: 2.782 },
    'DOUAI': { lat: 50.378, lng: 3.078 },
    'VALENCIENNES': { lat: 50.354, lng: 3.521 },
    'LENS': { lat: 50.433, lng: 2.832 },
    'BETHUNE': { lat: 50.525, lng: 2.640 },
    'HAZEBROUCK': { lat: 50.725, lng: 2.540 },
    'ROUBAIX': { lat: 50.691, lng: 3.174 },
    'TOURCOING': { lat: 50.723, lng: 3.161 },
    'CROIX WASQUEHAL': { lat: 50.670, lng: 3.145 },
    'DUNKERQUE': { lat: 51.034, lng: 2.376 },
    'NANCY': { lat: 48.687, lng: 6.176 },
    'EPINAL': { lat: 48.175, lng: 6.449 },
    'REMIREMONT': { lat: 48.017, lng: 6.590 },
    'REIMS': { lat: 49.259, lng: 4.027 },
    'STRASBOURG': { lat: 48.584, lng: 7.735 },
    'METZ': { lat: 49.109, lng: 6.176 },
    'GRENOBLE': { lat: 45.191, lng: 5.714 },
    'CHAMBERY CHALLES LES EAUX': { lat: 45.564, lng: 5.918 },
    'ANNECY': { lat: 45.901, lng: 6.129 },
    'AIX LES BAINS LE REVARD': { lat: 45.690, lng: 5.915 },
    'BOURG EN BRESSE': { lat: 46.205, lng: 5.226 },
    'MACON LOCHE TGV': { lat: 46.297, lng: 4.777 },
    'LYON ST EXUPERY TGV.': { lat: 45.724, lng: 5.091 },
    'LE CREUSOT MONTCEAU MONTCHANIN': { lat: 46.796, lng: 4.416 },
    'SAINT ETIENNE CHATEAUCREUX': { lat: 45.441, lng: 4.403 },
    'CLERMONT FERRAND': { lat: 45.776, lng: 3.103 },
    'VICHY': { lat: 46.126, lng: 3.422 },
    'MOULINS SUR ALLIER': { lat: 46.563, lng: 3.334 },
    'NEVERS': { lat: 46.989, lng: 3.161 },
    'RIOM CHATEL GUYON': { lat: 45.888, lng: 3.112 },
    'LIMOGES BENEDICTINS': { lat: 45.836, lng: 1.279 },
    'BRIVE LA GAILLARDE': { lat: 45.153, lng: 1.531 },
    'CAHORS': { lat: 44.445, lng: 1.441 },
    'MONTAUBAN VILLE BOURBON': { lat: 44.018, lng: 1.354 },
    'AGEN': { lat: 44.203, lng: 0.616 },
    'TOULOUSE MATABIAU': { lat: 43.611, lng: 1.453 },
    'ARCACHON': { lat: 44.661, lng: -1.166 },
    'LA TESTE': { lat: 44.630, lng: -1.139 },
    'BIGANOS FACTURE': { lat: 44.642, lng: -0.967 },
    'LIBOURNE': { lat: 44.918, lng: -0.242 },
    'SURGERES': { lat: 46.108, lng: -0.755 },
    'SAINTES': { lat: 45.743, lng: -0.629 },
    'ROYAN': { lat: 45.625, lng: -1.029 },
    'JONZAC': { lat: 45.447, lng: -0.434 },
    'ST NAZAIRE': { lat: 47.287, lng: -2.213 },
    'LE CROISIC': { lat: 47.293, lng: -2.513 },
    'LA BAULE ESCOUBLAC': { lat: 47.287, lng: -2.391 },
    'LE POULIGUEN': { lat: 47.272, lng: -2.431 },
    'PORNICHET': { lat: 47.260, lng: -2.339 },
    'NICE VILLE': { lat: 43.705, lng: 7.262 },
    'CANNES': { lat: 43.551, lng: 7.019 },
    'ANTIBES': { lat: 43.581, lng: 7.124 },
    'ST RAPHAEL VALESCURE': { lat: 43.424, lng: 6.770 },
    'TOULON': { lat: 43.124, lng: 5.926 },
    'AIX EN PROVENCE TGV': { lat: 43.455, lng: 5.317 },
    'CHATEAUROUX': { lat: 46.813, lng: 1.693 },
    'ARGENTON SUR CREUSE': { lat: 46.588, lng: 1.519 },
    'LA SOUTERRAINE': { lat: 46.233, lng: 1.488 },
    'VIERZON': { lat: 47.223, lng: 2.067 },
    'VENDOME VILLIERS SUR LOIR': { lat: 47.793, lng: 1.069 },
    'FUTUROSCOPE': { lat: 46.671, lng: 0.373 },
    'ST MAIXENT (DEUX SEVRES)': { lat: 46.410, lng: -0.204 },
    'MONTELIMAR GARE SNCF': { lat: 44.558, lng: 4.751 },
    'ST MICHEL VALLOIRE': { lat: 45.230, lng: 6.466 },
    'SAINT AVRE LA CHAMBRE': { lat: 45.393, lng: 6.380 },
    'ST JEAN DE MAURIENNE ARVAN': { lat: 45.276, lng: 6.345 },
    'MODANE': { lat: 45.201, lng: 6.654 },
    'BELLEGARDE SUR VALSERINE GARE': { lat: 46.107, lng: 5.826 },
    'OFFENBURG': { lat: 48.473, lng: 7.942 },
    'RINGSHEIM EUROPA PARK': { lat: 48.268, lng: 7.735 },
    'LAHR SCHWARZW': { lat: 48.339, lng: 7.874 },
    'FREIBURG (BREISGAU) HBF': { lat: 47.997, lng: 7.840 }
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