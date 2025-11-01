export type DestinationType = 'plage' | 'montagne' | 'parc_attraction' | 'etranger'

export type RegionType =
  | 'ile_de_france'
  | 'bretagne'
  | 'paca'
  | 'occitanie'
  | 'nouvelle_aquitaine'
  | 'auvergne_rhone_alpes'
  | 'grand_est'
  | 'hauts_de_france'
  | 'bourgogne_franche_comte'
  | 'centre_val_de_loire'
  | 'normandie'
  | 'pays_de_la_loire'
  | 'international'

export interface StationMetadata {
  type?: DestinationType
  region: RegionType
  tags: string[]
  description?: string
}

export const stationCategories: Record<string, StationMetadata> = {
  // ==============================
  // 🏖️ PLAGES
  // ==============================
  "AGDE": {
    type: "plage",
    region: "occitanie",
    tags: ["méditerranée"],
    description: "Station balnéaire (14km de la côte)"
  },
  "AIX EN PROVENCE TGV": {
    type: "plage",
    region: "paca",
    tags: ["méditerranée"],
    description: "Station balnéaire (19km de la côte)"
  },
  "ANTIBES": {
    type: "plage",
    region: "paca",
    tags: ["méditerranée"],
    description: "Station balnéaire (19km de la côte)"
  },
  "BAYONNE": {
    type: "plage",
    region: "nouvelle_aquitaine",
    tags: [],
    description: "Station balnéaire (2km de la côte)"
  },
  "BEZIERS": {
    type: "plage",
    region: "occitanie",
    tags: ["méditerranée"],
    description: "Station balnéaire (8km de la côte)"
  },
  "BIARRITZ": {
    type: "plage",
    region: "nouvelle_aquitaine",
    tags: [],
    description: "Station balnéaire (6km de la côte)"
  },
  "BREST": {
    type: "plage",
    region: "bretagne",
    tags: ["atlantique"],
    description: "Station balnéaire (2km de la côte)"
  },
  "CANNES": {
    type: "plage",
    region: "paca",
    tags: ["méditerranée"],
    description: "Station balnéaire (11km de la côte)"
  },
  "DOL DE BRETAGNE": {
    type: "plage",
    region: "bretagne",
    tags: ["atlantique"],
    description: "Station balnéaire (19km de la côte)"
  },
  "HENDAYE": {
    type: "plage",
    region: "nouvelle_aquitaine",
    tags: [],
    description: "Station balnéaire (28km de la côte)"
  },
  "LA BAULE ESCOUBLAC": {
    type: "plage",
    region: "pays_de_la_loire",
    tags: ["atlantique"],
    description: "Station balnéaire (17km de la côte)"
  },
  "LA ROCHELLE VILLE": {
    type: "plage",
    region: "nouvelle_aquitaine",
    tags: ["atlantique"],
    description: "Station balnéaire (7km de la côte)"
  },
  "LE CROISIC": {
    type: "plage",
    region: "pays_de_la_loire",
    tags: ["atlantique"],
    description: "Station balnéaire (26km de la côte)"
  },
  "LE POULIGUEN": {
    type: "plage",
    region: "pays_de_la_loire",
    tags: ["atlantique"],
    description: "Station balnéaire (19km de la côte)"
  },
  "LORIENT": {
    type: "plage",
    region: "bretagne",
    tags: ["atlantique"],
    description: "Station balnéaire (7km de la côte)"
  },
  "LUCON": {
    type: "plage",
    region: "nouvelle_aquitaine",
    tags: ["atlantique"],
    description: "Station balnéaire (28km de la côte)"
  },
  "MAGALAS": {
    type: "plage",
    region: "occitanie",
    tags: ["méditerranée"],
    description: "Station balnéaire (20km de la côte)"
  },
  "MARSEILLE ST CHARLES": {
    type: "plage",
    region: "paca",
    tags: ["méditerranée"],
    description: "Station balnéaire (2km de la côte)"
  },
  "NARBONNE": {
    type: "plage",
    region: "occitanie",
    tags: ["méditerranée"],
    description: "Station balnéaire (26km de la côte)"
  },
  "NICE VILLE": {
    type: "plage",
    region: "paca",
    tags: ["méditerranée"],
    description: "Station balnéaire (3km de la côte)"
  },
  "PERPIGNAN": {
    type: "plage",
    region: "occitanie",
    tags: [],
    description: "Station balnéaire (2km de la côte)"
  },
  "PORNICHET": {
    type: "plage",
    region: "pays_de_la_loire",
    tags: ["atlantique"],
    description: "Station balnéaire (12km de la côte)"
  },
  "QUIMPERLE": {
    type: "plage",
    region: "bretagne",
    tags: ["atlantique"],
    description: "Station balnéaire (22km de la côte)"
  },
  "ST JEAN DE LUZ CIBOURE": {
    type: "plage",
    region: "nouvelle_aquitaine",
    tags: [],
    description: "Station balnéaire (18km de la côte)"
  },
  "ST MALO": {
    type: "plage",
    region: "bretagne",
    tags: ["atlantique"],
    description: "Station balnéaire (5km de la côte)"
  },
  "ST NAZAIRE": {
    type: "plage",
    region: "pays_de_la_loire",
    tags: ["atlantique"],
    description: "Station balnéaire (10km de la côte)"
  },
  "ST RAPHAEL VALESCURE": {
    type: "plage",
    region: "paca",
    tags: ["méditerranée"],
    description: "Station balnéaire (14km de la côte)"
  },
  "TOULON": {
    type: "plage",
    region: "paca",
    tags: ["méditerranée"],
    description: "Station balnéaire (4km de la côte)"
  },
  // ==============================
  // ⛰️ MONTAGNES
  // ==============================
  "AIX LES BAINS LE REVARD": {
    type: "montagne",
    region: "auvergne_rhone_alpes",
    tags: ["alpes", "ski"],
    description: "Station de montagne (6km d'un massif)"
  },
  "ANNECY": {
    type: "montagne",
    region: "auvergne_rhone_alpes",
    tags: ["alpes", "lac"],
    description: "Station de montagne (2km d'un massif)"
  },
  "ARVANT": {
    type: "montagne",
    region: "auvergne_rhone_alpes",
    tags: ["massif central", "volcans"],
    description: "Station de montagne (33km d'un massif)"
  },
  "AUMONT AUBRAC": {
    type: "montagne",
    region: "occitanie",
    tags: ["massif central"],
    description: "Station de montagne (50km d'un massif)"
  },
  "BELFORT MONTBELIARD TGV": {
    type: "montagne",
    region: "grand_est",
    tags: ["vosges", "ski"],
    description: "Station de montagne (44km d'un massif)"
  },
  "BRASSAC LES MINES STE FLORINE": {
    type: "montagne",
    region: "auvergne_rhone_alpes",
    tags: ["massif central", "volcans"],
    description: "Station de montagne (45km d'un massif)"
  },
  "CHAMBERY CHALLES LES EAUX": {
    type: "montagne",
    region: "auvergne_rhone_alpes",
    tags: ["alpes", "ski"],
    description: "Station de montagne (8km d'un massif)"
  },
  "CLERMONT FERRAND": {
    type: "montagne",
    region: "auvergne_rhone_alpes",
    tags: ["massif central", "volcans"],
    description: "Station de montagne (1km d'un massif)"
  },
  "COLMAR": {
    type: "montagne",
    region: "grand_est",
    tags: ["vosges", "ski"],
    description: "Station de montagne (26km d'un massif)"
  },
  "EPINAL": {
    type: "montagne",
    region: "grand_est",
    tags: ["vosges", "ski"],
    description: "Station de montagne (38km d'un massif)"
  },
  "FRASNE": {
    type: "montagne",
    region: "bourgogne_franche_comte",
    tags: ["jura", "ski de fond"],
    description: "Station de montagne (10km d'un massif)"
  },
  "GRENOBLE": {
    type: "montagne",
    region: "auvergne_rhone_alpes",
    tags: ["alpes", "ski"],
    description: "Station de montagne (1km d'un massif)"
  },
  "ISSOIRE": {
    type: "montagne",
    region: "auvergne_rhone_alpes",
    tags: ["massif central", "volcans"],
    description: "Station de montagne (27km d'un massif)"
  },
  "LANNEMEZAN": {
    type: "montagne",
    region: "occitanie",
    tags: ["pyrénées", "ski"],
    description: "Station de montagne (36km d'un massif)"
  },
  "LOURDES": {
    type: "montagne",
    region: "occitanie",
    tags: ["pyrénées"],
    description: "Station de montagne (17km d'un massif)"
  },
  "MODANE": {
    type: "montagne",
    region: "auvergne_rhone_alpes",
    tags: ["alpes", "ski"],
    description: "Station de montagne (4km d'un massif)"
  },
  "MONTELIMAR GARE SNCF": {
    type: "montagne",
    region: "paca",
    tags: ["massif central"],
    description: "Station de montagne (50km d'un massif)"
  },
  "MOUCHARD": {
    type: "montagne",
    region: "bourgogne_franche_comte",
    tags: ["jura"],
    description: "Station de montagne (31km d'un massif)"
  },
  "MULHOUSE VILLE": {
    type: "montagne",
    region: "grand_est",
    tags: ["vosges", "ski"],
    description: "Station de montagne (44km d'un massif)"
  },
  "NEUSSARGUES": {
    type: "montagne",
    region: "auvergne_rhone_alpes",
    tags: ["massif central"],
    description: "Station de montagne (11km d'un massif)"
  },
  "PAU": {
    type: "montagne",
    region: "nouvelle_aquitaine",
    tags: ["pyrénées"],
    description: "Station de montagne (23km d'un massif)"
  },
  "REMIREMONT": {
    type: "montagne",
    region: "grand_est",
    tags: ["vosges", "ski"],
    description: "Station de montagne (21km d'un massif)"
  },
  "RIOM CHATEL GUYON": {
    type: "montagne",
    region: "auvergne_rhone_alpes",
    tags: ["massif central", "volcans"],
    description: "Station de montagne (13km d'un massif)"
  },
  "SAINT CHELY D\\'APCHER": {
    type: "montagne",
    region: "occitanie",
    tags: ["massif central"],
    description: "Station de montagne (37km d'un massif)"
  },
  "ST FLOUR CHAUDES AIGUES": {
    type: "montagne",
    region: "auvergne_rhone_alpes",
    tags: ["massif central"],
    description: "Station de montagne (13km d'un massif)"
  },
  "ST GAUDENS": {
    type: "montagne",
    region: "occitanie",
    tags: ["pyrénées", "ski"],
    description: "Station de montagne (27km d'un massif)"
  },
  "TARBES": {
    type: "montagne",
    region: "occitanie",
    tags: ["pyrénées"],
    description: "Station de montagne (30km d'un massif)"
  },
  "VALENCE TGV": {
    type: "montagne",
    region: "auvergne_rhone_alpes",
    tags: ["massif central"],
    description: "Station de montagne (46km d'un massif)"
  },
  "VICHY": {
    type: "montagne",
    region: "auvergne_rhone_alpes",
    tags: ["massif central", "volcans"],
    description: "Station de montagne (47km d'un massif)"
  },
  // ==============================
  // 🎢 PARCS D'ATTRACTION
  // ==============================
  "AEROPORT ROISSY CDG 2 TGV": {
    type: "parc_attraction",
    region: "ile_de_france",
    tags: ["parc astérix"],
    description: "Aéroport et accès Parc Astérix"
  },
  "FUTUROSCOPE": {
    type: "parc_attraction",
    region: "nouvelle_aquitaine",
    tags: ["technologie"],
    description: "Parc du Futuroscope"
  },
  "LA ROCHE SUR YON": {
    type: "parc_attraction",
    region: "nouvelle_aquitaine",
    tags: ["puy du fou"],
    description: "Accès au Puy du Fou"
  },
  "MARNE LA VALLEE CHESSY": {
    type: "parc_attraction",
    region: "ile_de_france",
    tags: ["disneyland"],
    description: "Disneyland Paris"
  },
  // ==============================
  // 🌍 INTERNATIONAL
  // ==============================
  "BRUXELLES MIDI": {
    type: "etranger",
    region: "international",
    tags: ["europe"],
    description: "Destination internationale"
  },
  // ==============================
  // 🏙️ AUTRES VILLES
  // ==============================
  "AGEN": {
    region: "occitanie",
    tags: []
  },
  "ANGERS SAINT LAUD": {
    region: "pays_de_la_loire",
    tags: []
  },
  "ANGOULEME": {
    region: "nouvelle_aquitaine",
    tags: []
  },
  "ARGENTON SUR CREUSE": {
    region: "nouvelle_aquitaine",
    tags: []
  },
  "ARLES": {
    region: "paca",
    tags: []
  },
  "ARRAS": {
    region: "hauts_de_france",
    tags: []
  },
  "AURAY": {
    region: "bretagne",
    tags: []
  },
  "AVIGNON CENTRE": {
    region: "paca",
    tags: []
  },
  "AVIGNON TGV": {
    region: "paca",
    tags: []
  },
  "BANASSAC LA CANOURGUE": {
    region: "occitanie",
    tags: []
  },
  "BEAUNE": {
    region: "bourgogne_franche_comte",
    tags: []
  },
  "BEDARIEUX": {
    region: "occitanie",
    tags: []
  },
  "BESANCON FRANCHE COMTE TGV": {
    region: "bourgogne_franche_comte",
    tags: []
  },
  "BORDEAUX ST JEAN": {
    region: "nouvelle_aquitaine",
    tags: []
  },
  "BOURG EN BRESSE": {
    region: "auvergne_rhone_alpes",
    tags: []
  },
  "BOURGES": {
    region: "centre_val_de_loire",
    tags: []
  },
  "BRIVE LA GAILLARDE": {
    region: "nouvelle_aquitaine",
    tags: []
  },
  "CAHORS": {
    region: "occitanie",
    tags: []
  },
  "CAMPAGNAC ST GENIEZ": {
    region: "occitanie",
    tags: []
  },
  "CARCASSONNE": {
    region: "occitanie",
    tags: []
  },
  "CAUSSADE(TARN ET GARONNE)": {
    region: "occitanie",
    tags: []
  },
  "CEILHES ROQUEREDONDE": {
    region: "occitanie",
    tags: []
  },
  "CHALON SUR SAONE": {
    region: "bourgogne_franche_comte",
    tags: []
  },
  "CHAMPAGNE ARDENNE TGV": {
    region: "hauts_de_france",
    tags: []
  },
  "CHATEAUROUX": {
    region: "centre_val_de_loire",
    tags: []
  },
  "CHATELLERAULT": {
    region: "centre_val_de_loire",
    tags: []
  },
  "COMMERCY": {
    region: "grand_est",
    tags: []
  },
  "CULMONT CHALINDREY": {
    region: "grand_est",
    tags: []
  },
  "DAX": {
    region: "nouvelle_aquitaine",
    tags: []
  },
  "DIJON VILLE": {
    region: "bourgogne_franche_comte",
    tags: []
  },
  "DOUAI": {
    region: "hauts_de_france",
    tags: []
  },
  "DUNKERQUE": {
    region: "hauts_de_france",
    tags: []
  },
  "FRESNES AU MONT": {
    region: "grand_est",
    tags: []
  },
  "GOURDON": {
    region: "occitanie",
    tags: []
  },
  "GUINGAMP": {
    region: "bretagne",
    tags: []
  },
  "LA SOUTERRAINE": {
    region: "nouvelle_aquitaine",
    tags: []
  },
  "LAVAL": {
    region: "pays_de_la_loire",
    tags: []
  },
  "LE BOUSQUET D\\'ORB": {
    region: "occitanie",
    tags: []
  },
  "LE CREUSOT MONTCEAU MONTCHANIN": {
    region: "bourgogne_franche_comte",
    tags: []
  },
  "LE MANS": {
    region: "centre_val_de_loire",
    tags: []
  },
  "LEROUVILLE CENTRE": {
    region: "grand_est",
    tags: []
  },
  "LES ARCS DRAGUIGNAN": {
    region: "paca",
    tags: []
  },
  "LES AUBRAIS ORLEANS": {
    region: "centre_val_de_loire",
    tags: []
  },
  "LILLE (intramuros)": {
    region: "hauts_de_france",
    tags: []
  },
  "LIMOGES BENEDICTINS": {
    region: "nouvelle_aquitaine",
    tags: []
  },
  "LORRAINE TGV": {
    region: "grand_est",
    tags: []
  },
  "LYON (intramuros)": {
    region: "auvergne_rhone_alpes",
    tags: []
  },
  "LYON ST EXUPERY TGV.": {
    region: "auvergne_rhone_alpes",
    tags: []
  },
  "MACON LOCHE TGV": {
    region: "auvergne_rhone_alpes",
    tags: []
  },
  "MACON VILLE": {
    region: "auvergne_rhone_alpes",
    tags: []
  },
  "MARMANDE": {
    region: "occitanie",
    tags: []
  },
  "MARVEJOLS": {
    region: "occitanie",
    tags: []
  },
  "MASSY TGV": {
    region: "ile_de_france",
    tags: []
  },
  "METZ VILLE": {
    region: "grand_est",
    tags: []
  },
  "MEUSE TGV": {
    region: "grand_est",
    tags: []
  },
  "MILLAU": {
    region: "occitanie",
    tags: []
  },
  "MIRAMAS": {
    region: "paca",
    tags: []
  },
  "MONTAUBAN VILLE BOURBON": {
    region: "occitanie",
    tags: []
  },
  "MONTPELLIER SAINT ROCH": {
    region: "occitanie",
    tags: []
  },
  "MONTPELLIER SUD DE FRANCE": {
    region: "occitanie",
    tags: []
  },
  "MORLAIX": {
    region: "bretagne",
    tags: []
  },
  "MOULINS SUR ALLIER": {
    region: "bourgogne_franche_comte",
    tags: []
  },
  "NANCY": {
    region: "grand_est",
    tags: []
  },
  "NANTES": {
    region: "pays_de_la_loire",
    tags: []
  },
  "NEUFCHATEAU": {
    region: "grand_est",
    tags: []
  },
  "NEVERS": {
    region: "bourgogne_franche_comte",
    tags: []
  },
  "NIMES CENTRE": {
    region: "paca",
    tags: []
  },
  "NIMES PONT DU GARD": {
    region: "paca",
    tags: []
  },
  "NIORT": {
    region: "nouvelle_aquitaine",
    tags: []
  },
  "ORTHEZ": {
    region: "nouvelle_aquitaine",
    tags: []
  },
  "PARIS (intramuros)": {
    region: "ile_de_france",
    tags: []
  },
  "POITIERS": {
    region: "nouvelle_aquitaine",
    tags: []
  },
  "QUIMPER": {
    region: "bretagne",
    tags: []
  },
  "REIMS": {
    region: "hauts_de_france",
    tags: []
  },
  "RENNES": {
    region: "bretagne",
    tags: []
  },
  "RETHEL": {
    region: "grand_est",
    tags: []
  },
  "ROANNE": {
    region: "auvergne_rhone_alpes",
    tags: []
  },
  "ROCHEFORT": {
    region: "nouvelle_aquitaine",
    tags: []
  },
  "ROSPORDEN": {
    region: "bretagne",
    tags: []
  },
  "SABLE SUR SARTHE": {
    region: "pays_de_la_loire",
    tags: []
  },
  "SAINT ETIENNE CHATEAUCREUX": {
    region: "auvergne_rhone_alpes",
    tags: []
  },
  "SAINT GEORGES DE LUZENCON": {
    region: "occitanie",
    tags: []
  },
  "SAINT GERMAIN DES FOSSES": {
    region: "auvergne_rhone_alpes",
    tags: []
  },
  "SAINT ROME DE CERNON": {
    region: "occitanie",
    tags: []
  },
  "SAINTES": {
    region: "nouvelle_aquitaine",
    tags: []
  },
  "SAUMUR": {
    region: "pays_de_la_loire",
    tags: []
  },
  "SETE": {
    region: "occitanie",
    tags: []
  },
  "SEVERAC LE CHATEAU": {
    region: "occitanie",
    tags: []
  },
  "SOUILLAC": {
    region: "occitanie",
    tags: []
  },
  "ST BRIEUC": {
    region: "bretagne",
    tags: []
  },
  "ST MAIXENT (DEUX SEVRES)": {
    region: "nouvelle_aquitaine",
    tags: []
  },
  "ST PIERRE DES CORPS": {
    region: "centre_val_de_loire",
    tags: []
  },
  "STRASBOURG": {
    region: "grand_est",
    tags: []
  },
  "SURGERES": {
    region: "nouvelle_aquitaine",
    tags: []
  },
  "TGV HAUTE PICARDIE": {
    region: "hauts_de_france",
    tags: []
  },
  "THIONVILLE": {
    region: "grand_est",
    tags: []
  },
  "TOUL": {
    region: "grand_est",
    tags: []
  },
  "TOULOUSE MATABIAU": {
    region: "occitanie",
    tags: []
  },
  "TOURNEMIRE ROQUEFORT": {
    region: "occitanie",
    tags: []
  },
  "TOURS": {
    region: "centre_val_de_loire",
    tags: []
  },
  "UZERCHE": {
    region: "nouvelle_aquitaine",
    tags: []
  },
  "VALENCIENNES": {
    region: "hauts_de_france",
    tags: []
  },
  "VANNES": {
    region: "bretagne",
    tags: []
  },
  "VENDOME VILLIERS SUR LOIR": {
    region: "centre_val_de_loire",
    tags: []
  },
  "VERDUN": {
    region: "grand_est",
    tags: []
  },
  "VIERZON": {
    region: "centre_val_de_loire",
    tags: []
  },
}

// Fonctions utilitaires
export function getStationMetadata(stationName: string): StationMetadata | undefined {
  return stationCategories[stationName]
}

export function getStationsByType(type: DestinationType): string[] {
  return Object.entries(stationCategories)
    .filter(([_, meta]) => meta.type === type)
    .map(([name, _]) => name)
}

export function getStationsByRegion(region: RegionType): string[] {
  return Object.entries(stationCategories)
    .filter(([_, meta]) => meta.region === region)
    .map(([name, _]) => name)
}

export function getStationsByTag(tag: string): string[] {
  return Object.entries(stationCategories)
    .filter(([_, meta]) => meta.tags.some(t => t.toLowerCase().includes(tag.toLowerCase())))
    .map(([name, _]) => name)
}

// Labels pour l'affichage
export const typeLabels: Record<DestinationType, string> = {
  plage: '🏖️ Plages',
  montagne: '⛰️ Montagnes',
  parc_attraction: '🎢 Parcs d\'Attraction',
  etranger: '🌍 Étranger'
}

export const regionLabels: Record<RegionType, string> = {
  ile_de_france: 'Île-de-France',
  bretagne: 'Bretagne',
  paca: 'PACA',
  occitanie: 'Occitanie',
  nouvelle_aquitaine: 'Nouvelle-Aquitaine',
  auvergne_rhone_alpes: 'Auvergne-Rhône-Alpes',
  grand_est: 'Grand Est',
  hauts_de_france: 'Hauts-de-France',
  bourgogne_franche_comte: 'Bourgogne-Franche-Comté',
  centre_val_de_loire: 'Centre-Val de Loire',
  normandie: 'Normandie',
  pays_de_la_loire: 'Pays de la Loire',
  international: 'International'
}
