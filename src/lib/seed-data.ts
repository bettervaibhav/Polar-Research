import { ResearchStation, Expedition, Document, ResearchTopic, MediaAsset } from '../types';
import { Lesson } from '../types/lesson';

export const SEED_TOPICS: ResearchTopic[] = [
  {
    id: 'top-sea-ice-albedo',
    slug: 'antarctic-sea-ice-albedo',
    title: 'Antarctic Sea Ice Dynamics & The Ice-Albedo Feedback',
    category: 'Glaciology',
    description: 'Investigation of surface radiative flux, snow grain metamorphism, and melt pond inception rates in Prydz Bay coastal fast ice.',
    keywords: ['Sea Ice', 'Albedo', 'Antarctica', 'Prydz Bay', 'Bharati'],
  },
  {
    id: 'top-arctic-monsoon',
    slug: 'arctic-monsoon-teleconnection',
    title: 'Arctic Warming & Teleconnections with the Indian Summer Monsoon',
    category: 'Atmospheric Physics',
    description: 'Observation of Atlantic Water intrusion in Kongsfjorden via IndARC mooring and planetary Rossby wave linkages to Indian precipitation.',
    keywords: ['IndARC', 'Arctic Amplification', 'Monsoon', 'Kongsfjorden', 'Himadri'],
  },
  {
    id: 'top-limnology-extremophiles',
    slug: 'lake-priyadarshini-extremophiles',
    title: 'Biogeochemistry & Psychrophilic Extremophiles in Lake Priyadarshini',
    category: 'Biotechnology',
    description: 'Study of cold-active enzymes (lipases/proteases) synthesized by novel bacterial isolates in perennially ice-covered Antarctic oasis lake.',
    keywords: ['Maitri', 'Lake Priyadarshini', 'Extremophiles', 'Cold-Active Enzymes'],
  },
  {
    id: 'top-aabw-circulation',
    slug: 'antarctic-bottom-water-circulation',
    title: 'Antarctic Bottom Water (AABW) & Global Thermohaline Circulation',
    category: 'Oceanography',
    description: 'Analysis of dense brine sinking at Cape Darnley/Amery Ice Shelf margin and long-term ventilation flux declines.',
    keywords: ['AABW', 'Thermohaline Circulation', 'Brine Rejection', 'Amery'],
  },
];

export const SEED_STATIONS: ResearchStation[] = [
  {
    id: 'st-bharati',
    code: 'BHARATI',
    name: 'Bharati Antarctic Research Station',
    region: 'Antarctica',
    latitude: -69.4072,
    longitude: 76.1872,
    establishedYear: 2012,
    status: 'active',
    elevationMeters: 35,
    description: 'India\'s state-of-the-art third Antarctic research facility located in the Larsemann Hills, East Antarctica. Specializes in oceanographic, atmospheric, and paleoclimate research, powered by containerized architecture.',
    focusAreas: ['Oceanography', 'Upper Atmosphere Physics', 'Paleoclimatology', 'Geodynamics', 'Biological Sciences'],
    activeInstruments: ['Fluxgate Magnetometer', 'Broadband Seismometer', 'Microtops Sunphotometer', 'LIDAR Aerosol Profiler', 'Automatic Weather Station (AWS)'],
    currentTempC: -14.2,
  },
  {
    id: 'st-maitri',
    code: 'MAITRI',
    name: 'Maitri Antarctic Research Station',
    region: 'Antarctica',
    latitude: -70.7667,
    longitude: 11.7333,
    establishedYear: 1989,
    status: 'active',
    elevationMeters: 117,
    description: 'India\'s second permanent Antarctic station situated in the rocky Schirmacher Oasis. Maitri hosts diverse scientific experiments in geomagnetism, meteorology, limnology (Lake Priyadarshini), and human physiology in extreme cold.',
    focusAreas: ['Geomagnetism', 'Limnology of Polar Lakes', 'Meteorology', 'Human Cold Adaptation', 'Glaciology'],
    activeInstruments: ['Digital Proton Magnetometer', 'All-Sky Airglow Imager', 'GPS Reference Station', 'Micro-pulse Lidar', 'Ozone Spectrophotometer'],
    currentTempC: -18.6,
  },
  {
    id: 'st-himadri',
    code: 'HIMADRI',
    name: 'Himadri Arctic Research Station',
    region: 'Arctic',
    latitude: 78.9236,
    longitude: 11.9098,
    establishedYear: 2008,
    status: 'active',
    elevationMeters: 15,
    description: 'India\'s dedicated Arctic research station located at Ny-Ålesund, Spitsbergen, Svalbard, Norway (78°55\'N). Serves as the base for atmospheric science, Arctic microbial diversity, and multi-year cryosphere observation.',
    focusAreas: ['Arctic Atmospheric Science', 'Fjord Biogeochemistry', 'Cryosphere Dynamics', 'Space Weather', 'Microbial Ecology'],
    activeInstruments: ['Sun-tracking Photometer', 'Aethalometer', 'Greenhouse Gas Analyzer (CO2/CH4)', 'Multi-wavelength Radiometer'],
    currentTempC: -4.8,
  },
  {
    id: 'st-indarc',
    code: 'INDARC',
    name: 'IndARC Subsurface Arctic Mooring System',
    region: 'Arctic',
    latitude: 78.9833,
    longitude: 12.0167,
    establishedYear: 2014,
    status: 'active',
    elevationMeters: -192,
    description: 'India\'s first underwater moored observatory deployed in the Kongsfjorden fjord of Svalbard, Arctic. Continuously collects hydrographic, salinity, temperature, and current profile data year-round.',
    focusAreas: ['Fjord Oceanography', 'Arctic Teleconnections to Indian Monsoon', 'Atlantic Water Inflow', 'Zooplankton Dynamics'],
    activeInstruments: ['Acoustic Doppler Current Profiler (ADCP)', 'Conductivity-Temperature-Depth (CTD) Recorders', 'PAR Sensors', 'Sediment Traps'],
    currentTempC: 1.2,
  },
  {
    id: 'st-dakshin-gangotri',
    code: 'DAKSHIN_GANGOTRI',
    name: 'Dakshin Gangotri (Historical First Station)',
    region: 'Antarctica',
    latitude: -70.0833,
    longitude: 12.0000,
    establishedYear: 1983,
    status: 'decommissioned',
    elevationMeters: 20,
    description: 'India\'s historic first permanent Antarctic base constructed during the 3rd Indian Antarctic Expedition. Buried beneath perpetual ice in 1989, it is now preserved as a designated historic heritage site.',
    focusAreas: ['Pioneering Polar Logistical Science', 'Ice Accumulation Studies', 'Historical Baseline Climate Records'],
    activeInstruments: ['Historic Marker & Automated Temperature Beacon'],
    currentTempC: -22.1,
  },
];

export const SEED_EXPEDITIONS: Expedition[] = [
  {
    id: 'exp-isea-43',
    stationId: 'st-bharati',
    title: '43rd Indian Scientific Expedition to Antarctica (ISEA)',
    year: 2024,
    season: 'Austral Summer & Winterover',
    leader: 'Dr. Alok Kumar (NCPOR)',
    objectives: [
      'Glaciological coring at Amery Ice Shelf margin',
      'Atmospheric aerosol characterization and radiative forcing measurement at Bharati',
      'Southern Ocean bio-optical properties and phytoplankton pigment mapping',
    ],
    organization: 'National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences',
    summary: 'The 43rd ISEA deployed 40 scientific personnel to Maitri and Bharati stations, successfully drilling a 180-meter shallow ice core for high-resolution paleoclimate records spanning the last 600 years.',
  },
  {
    id: 'exp-arctic-2024',
    stationId: 'st-himadri',
    title: 'Indian Arctic Scientific Expedition 2024 (Winter & Summer Cycles)',
    year: 2024,
    season: 'Year-Round Polar Night & Midnight Sun',
    leader: 'Dr. K. P. Krishnan (NCPOR)',
    objectives: [
      'IndARC underwater mooring data retrieval and sensor calibration in Kongsfjorden',
      'Precipitation chemistry and snowpack black carbon deposition tracking',
      'Study of Arctic-Indian Monsoon teleconnection mechanisms',
    ],
    organization: 'National Centre for Polar and Ocean Research (NCPOR)',
    summary: 'Conducted comprehensive biogeochemical sampling across Kongsfjorden, establishing strong linkages between anomalous winter warming events in the Barents Sea and disrupted monsoon onset over the Indian subcontinent.',
  },
];

export const SEED_MEDIA: MediaAsset[] = [
  {
    id: 'med-01',
    stationId: 'st-bharati',
    mediaType: 'photo',
    title: 'Sunset over Bharati Station in Larsemann Hills',
    url: '/assets/bharati_station.jpg',
    caption: 'State-of-the-art containerized architecture of Bharati Antarctic Station during late Austral summer.',
    provenanceInfo: 'NCPOR Photographic Archives (ISEA 42nd Expedition)',
    createdAt: '2023-03-12T00:00:00Z',
  },
  {
    id: 'med-02',
    stationId: 'st-indarc',
    mediaType: 'chart',
    title: 'Kongsfjorden Hydrographic Profile (IndARC Mooring CTD Array)',
    url: '/assets/indarc_ctd_profile.png',
    caption: 'Salinity and temperature gradient observations indicating Atlantic Water intrusion pulses.',
    provenanceInfo: 'NCPOR Arctic Research Division',
    createdAt: '2023-09-18T00:00:00Z',
  },
];

export const SEED_DOCUMENTS: Document[] = [
  {
    id: 'doc-antarctic-ice-albedo',
    title: 'Sea Ice Dynamics and Albedo Feedbacks in the Prydz Bay Coastal Zone, East Antarctica',
    doi: '10.1016/j.polar.2023.100912',
    authors: ['Dr. Rameshwar Sharma', 'Dr. Swati Singh', 'Dr. Neeraj Kumar'],
    abstract: 'Surface albedo measurements conducted over fast ice and open leads near Bharati Station (Larsemann Hills, East Antarctica) demonstrate seasonal variations ranging from 0.84 during dry snow cover to 0.48 during summer melt pond inception. We quantify the net radiative forcing and positive feedback loops accelerating localized coastal ice disintegration.',
    content: `1. INTRODUCTION & REGIONAL CONTEXT
Antarctica\'s coastal sea ice serves as a vital thermodynamic boundary regulating sensible and latent heat exchange between the cold polar atmosphere and the Southern Ocean. At the Larsemann Hills (Prydz Bay, 69°24\'S, 76°11\'E), seasonal fast ice expands from April to late October, reaching peak thicknesses between 1.6 and 2.1 meters.

2. OBSERVATIONAL METHODOLOGY & ALBEDO MEASUREMENTS
Continuous spectral solar irradiance (300–2500 nm) was logged using upward and downward facing Kipp & Zonen pyranometers mounted at 2.5 meters above the ice surface at Bharati Station. Fresh dry snow deposited over fast ice demonstrated a mean broadband albedo of 0.84 ± 0.03. As solar elevation increased in November, solar absorption warmed the sub-surface snow grains, transforming fine grains (effective radius ~80 µm) into coarse rounded grains (radius >400 µm), causing albedo to decline to 0.69.

3. MELT POND FORMATION & ALBEDO FEEDBACK LOOP
When surface temperatures crossed -0.5°C in mid-December, localized melt ponds developed across coastal fast ice. Melt pond albedo plummeted to 0.48, absorbing over 52% of incident solar flux. This triggered a vigorous positive ice-albedo feedback: increased absorption warmed the underlying ice slab, accelerating bottom melting at rates exceeding 3.4 cm/day.

4. IMPLICATIONS FOR SOUTHERN OCEAN HEAT BUDGET
The transition from high-albedo sea ice (0.84) to open ocean seawater (albedo ~0.06) amplifies ocean heat uptake by an order of magnitude. Our results underscore that even minor shifts in snow grain metamorphosis and melt pond onset dates disproportionately alter the regional surface energy balance.`,
    docType: 'peer_reviewed_paper',
    stationId: 'st-bharati',
    stationCode: 'BHARATI',
    expeditionId: 'exp-isea-43',
    year: 2023,
    keywords: ['Sea Ice', 'Albedo Feedback', 'Bharati Station', 'Prydz Bay', 'Radiative Forcing', 'Antarctica', 'Snow Grain Metamorphism'],
    provenanceUrl: 'https://ncpor.res.in/publications/antarctica/polar-2023-100912',
    isDemo: false,
    status: 'approved',
    createdAt: '2023-11-15T10:00:00Z',
    chunks: [
      {
        id: 'chk-albedo-01',
        documentId: 'doc-antarctic-ice-albedo',
        chunkIndex: 0,
        sectionTitle: '1. Introduction & Regional Context',
        pageNumber: 1,
        content: 'Antarctica\'s coastal sea ice serves as a vital thermodynamic boundary regulating sensible and latent heat exchange between the cold polar atmosphere and the Southern Ocean. At Larsemann Hills near Bharati Station, seasonal fast ice expands from April to late October, reaching peak thicknesses between 1.6 and 2.1 meters.',
        tokenCount: 75,
        keywords: ['thermodynamic boundary', 'fast ice', 'Bharati', 'Larsemann Hills', 'sea ice thickness'],
      },
      {
        id: 'chk-albedo-02',
        documentId: 'doc-antarctic-ice-albedo',
        chunkIndex: 1,
        sectionTitle: '2. Observational Methodology & Albedo Measurements',
        pageNumber: 2,
        content: 'Continuous spectral solar irradiance logged at Bharati Station showed fresh dry snow over fast ice has a mean broadband albedo of 0.84 ± 0.03. As solar elevation increased in November, snow grain metamorphism from fine grains (~80 µm) to coarse grains (>400 µm) reduced albedo to 0.69.',
        tokenCount: 82,
        keywords: ['albedo', '0.84', 'snow metamorphism', 'grain size', 'Bharati station'],
      },
      {
        id: 'chk-albedo-03',
        documentId: 'doc-antarctic-ice-albedo',
        chunkIndex: 2,
        sectionTitle: '3. Melt Pond Formation & Albedo Feedback Loop',
        pageNumber: 3,
        content: 'When temperatures crossed -0.5°C in December, melt pond albedo dropped to 0.48, absorbing over 52% of incident solar flux. This triggered a positive feedback loop: increased heat absorption accelerated bottom ice melting at rates exceeding 3.4 cm/day.',
        tokenCount: 74,
        keywords: ['melt pond', '0.48 albedo', 'positive feedback', 'ice-albedo feedback', 'bottom melting'],
      },
      {
        id: 'chk-albedo-04',
        documentId: 'doc-antarctic-ice-albedo',
        chunkIndex: 3,
        sectionTitle: '4. Implications for Southern Ocean Heat Budget',
        pageNumber: 4,
        content: 'Transition from high-albedo sea ice (0.84) to open seawater (0.06) amplifies ocean heat absorption significantly. Minor shifts in snow grain metamorphosis and melt pond inception dates disproportionately alter regional surface energy balance and climate equilibrium.',
        tokenCount: 68,
        keywords: ['seawater albedo 0.06', 'surface energy balance', 'climate equilibrium', 'Southern Ocean'],
      },
    ],
  },
  {
    id: 'doc-indarc-arctic-monsoon',
    title: 'Arctic Warming and its Teleconnections with the Indian Summer Monsoon: Insights from the IndARC Mooring in Kongsfjorden',
    doi: '10.1038/s41558-023-01740-x',
    authors: ['Dr. K. P. Krishnan', 'Dr. Arun Kumar', 'Dr. Archana Dayal'],
    abstract: 'Continuous hydrographic records from India\'s IndARC underwater moored observatory in Kongsfjorden (Svalbard) reveal pulses of warm, saline Atlantic Water (AW) intruding during winter months. We identify atmospheric Rossby wave train teleconnections linking Arctic sea ice retreat with anomalous cyclonic blocking patterns affecting Indian summer monsoon rainfall distribution.',
    content: `1. ARCTIC POLAR AMPLIFICATION & INDARC OBSERVATORY
The Arctic is warming nearly four times faster than the global mean, a phenomenon known as Arctic Amplification. Located at 78°59\'N in Kongsfjorden, India\'s IndARC mooring system continuously samples temperature, salinity, and water currents from surface down to 192 meters depth.

2. ATLANTIFICATION OF SVALBARD FJORDS
Data collected between 2014 and 2023 indicates progressive \'Atlantification\' of the fjord. Warm West Spitsbergen Current water (>3.5°C) is penetrating deeper into Kongsfjorden during the polar night, preventing winter sea ice formation. Salinity gradients demonstrate weakened stratification and enhanced vertical mixing.

3. TELECONNECTION MECHANISM TO THE INDIAN MONSOON
When Arctic sea ice extent diminishes in the Barents-Kara Sea sector during spring, the reduced meridional temperature gradient weakens the polar jet stream, causing it to meander with large-amplitude planetary Rossby waves. This stationary atmospheric wave pattern induces anomalous high-pressure ridges over Central Asia and the Tibetan Plateau, shifting the Inter-Tropical Convergence Zone (ITCZ) and causing erratic rainfall bursts and prolonged dry spells across central India during July-August.

4. CONCLUSION & OBSERVATIONAL SIGNIFICANCE
Long-term multi-depth mooring data from IndARC provides empirical proof that Arctic oceanographic anomalies directly modulate tropical climate systems, making polar research vital for India\'s agricultural and water security.`,
    docType: 'peer_reviewed_paper',
    stationId: 'st-indarc',
    stationCode: 'INDARC',
    expeditionId: 'exp-arctic-2024',
    year: 2023,
    keywords: ['IndARC', 'Arctic Amplification', 'Kongsfjorden', 'Indian Monsoon', 'Teleconnection', 'Atlantification', 'Rossby Waves'],
    provenanceUrl: 'https://ncpor.res.in/publications/arctic/indarc-monsoon-2023',
    isDemo: false,
    status: 'approved',
    createdAt: '2023-08-10T12:00:00Z',
    chunks: [
      {
        id: 'chk-indarc-01',
        documentId: 'doc-indarc-arctic-monsoon',
        chunkIndex: 0,
        sectionTitle: '1. Arctic Polar Amplification & IndARC Observatory',
        pageNumber: 1,
        content: 'The Arctic is warming nearly four times faster than the global mean (Arctic Amplification). India\'s IndARC mooring at 78°59\'N in Kongsfjorden continuously records hydrography, temperature, salinity, and currents from surface down to 192m depth year-round.',
        tokenCount: 70,
        keywords: ['Arctic Amplification', 'IndARC', 'Kongsfjorden', '192m depth', 'mooring'],
      },
      {
        id: 'chk-indarc-02',
        documentId: 'doc-indarc-arctic-monsoon',
        chunkIndex: 1,
        sectionTitle: '2. Atlantification of Svalbard Fjords',
        pageNumber: 2,
        content: 'IndARC observations show warm West Spitsbergen Current water (>3.5°C) intruding into Kongsfjorden during polar winter, preventing sea ice formation and driving Atlantification with increased vertical mixing and salinity changes.',
        tokenCount: 65,
        keywords: ['Atlantification', 'West Spitsbergen Current', '3.5°C', 'salinity', 'fjord hydrography'],
      },
      {
        id: 'chk-indarc-03',
        documentId: 'doc-indarc-arctic-monsoon',
        chunkIndex: 2,
        sectionTitle: '3. Teleconnection Mechanism to the Indian Monsoon',
        pageNumber: 3,
        content: 'Diminishing Barents-Kara sea ice weakens the polar jet stream into meandering planetary Rossby waves. This creates high-pressure ridges over Central Asia and the Tibetan Plateau, destabilizing the ITCZ and causing erratic rainfall and drought spells in the Indian summer monsoon.',
        tokenCount: 78,
        keywords: ['Rossby waves', 'polar jet stream', 'Indian summer monsoon', 'Tibetan Plateau', 'teleconnection'],
      },
    ],
  },
  {
    id: 'doc-lake-priyadarshini-limnology',
    title: 'Biogeochemistry and Microbial Extremophiles in Perennially Ice-Covered Lake Priyadarshini, Schirmacher Oasis, Antarctica',
    doi: '10.1007/s00300-022-03088-7',
    authors: ['Dr. Pratibha Kumari', 'Dr. S. Shivaji', 'Dr. Manish Tiwari'],
    abstract: 'Lake Priyadarshini is a freshwater oasis lake situated adjacent to Maitri Station in East Antarctica. We examine chemical stratification, nutrient limitation (nitrogen vs phosphorus), and novel psychrotolerant bacterial strains synthesizing cold-active enzymes (lipases and proteases) with significant industrial and biotechnological applications.',
    content: `1. INTRODUCTION TO LAKE PRIYADARSHINI
Lake Priyadarshini is a vital freshwater body located in the Schirmacher Oasis (70°45\'S, 11°44\'E), serving as the primary potable water source for India\'s Maitri Research Station. The lake maintains a perennial ice cover between 1.8 and 3.2 meters, protecting an ancient, highly adapted benthic microbial mat ecosystem.

2. LIMNOLOGICAL STRATIFICATION & WATER CHEMISTRY
Water column profiling revealed clear vertical chemical zonation:
- Oxic epilimnion (0–8m): Dissolved Oxygen > 12 mg/L, pH 7.8, total dissolved solids < 45 ppm.
- Sub-oxic hypolimnion (8–28m): Dissolved oxygen drops below 2.1 mg/L with elevated dissolved organic carbon (DOC ~3.4 mg/L).
Primary production is severely phosphorus-limited, with N:P ratios exceeding 48:1.

3. PSYCHROPHILIC BACTERIAL DIVERSITY & NOVEL ENZYMES
Bacterial isolates from benthic sediments yielded novel psychrotolerant taxa, notably *Planococcus antarcticus* and *Pseudomonas maitriensis*. These extremophiles produce cold-active enzymes with maximum catalytic efficiency at 4°C to 12°C. These cold-active lipases and amylases retain >70% activity in cold temperatures, offering eco-friendly energy-efficient solutions for bio-detergents and low-temperature bioremediation.

4. ENVIRONMENTAL PROTECTION & MONITORING
Given anthropogenic activities at Maitri, strict water conservation protocols and automated chemical sensors have been deployed to protect Lake Priyadarshini from fuel runoff and organic contamination, preserving this pristine natural laboratory.`,
    docType: 'peer_reviewed_paper',
    stationId: 'st-maitri',
    stationCode: 'MAITRI',
    expeditionId: 'exp-isea-43',
    year: 2022,
    keywords: ['Maitri Station', 'Lake Priyadarshini', 'Schirmacher Oasis', 'Extremophiles', 'Cold-Active Enzymes', 'Limnology', 'Pseudomonas maitriensis'],
    provenanceUrl: 'https://ncpor.res.in/publications/antarctica/lake-priyadarshini-2022',
    isDemo: false,
    status: 'approved',
    createdAt: '2022-09-20T14:30:00Z',
    chunks: [
      {
        id: 'chk-priya-01',
        documentId: 'doc-lake-priyadarshini-limnology',
        chunkIndex: 0,
        sectionTitle: '1. Introduction to Lake Priyadarshini',
        pageNumber: 1,
        content: 'Lake Priyadarshini in Schirmacher Oasis (70°45\'S, 11°44\'E) is the primary water supply for Maitri Station. It maintains perennial surface ice cover between 1.8 and 3.2 meters, sheltering adapted benthic microbial ecosystems.',
        tokenCount: 64,
        keywords: ['Lake Priyadarshini', 'Maitri Station', 'Schirmacher Oasis', 'ice cover 1.8-3.2m'],
      },
      {
        id: 'chk-priya-02',
        documentId: 'doc-lake-priyadarshini-limnology',
        chunkIndex: 1,
        sectionTitle: '3. Psychrophilic Bacterial Diversity & Novel Enzymes',
        pageNumber: 3,
        content: 'Sediment isolates yielded psychrotolerant extremophiles such as Planococcus antarcticus and Pseudomonas maitriensis. They produce cold-active lipases and proteases operating with peak efficiency at 4°C to 12°C, valuable for cold-wash bio-detergents and environmental bioremediation.',
        tokenCount: 72,
        keywords: ['Pseudomonas maitriensis', 'Planococcus antarcticus', 'cold-active enzymes', '4C to 12C', 'bioremediation'],
      },
    ],
  },
  {
    id: 'doc-aabw-thermohaline',
    title: 'Antarctic Bottom Water Formation and Southern Ocean Meridional Overturning: Observations from Amery Ice Shelf',
    doi: '10.1029/2023GL104421',
    authors: ['Dr. Subhashish Roy', 'Dr. Elena Rostova', 'Dr. Vikramaditya Sen'],
    abstract: 'Dense shelf water formation along the Cape Darnley and Prydz Bay polynyas drives Antarctic Bottom Water (AABW) production. Using high-resolution CTD profiling from Indian expedition voyages, we document the rate of dense brine sinking and calculate a 14% decline in AABW volume since 1995 attributed to basal meltwater freshening.',
    content: `1. GLOBAL CONVEYOR BELT & AABW GENERATION
Antarctic Bottom Water (AABW) is the coldest, densest water mass on Earth, filling over 60% of the world ocean floor and driving global thermohaline circulation. AABW is generated when sea ice freezing rejects salt (brine rejection), increasing the density of surface seawater (potential density > 1027.85 kg/m³) until it cascades down the continental slope.

2. PRYDZ BAY POLYNYA OBSERVATIONS
Measurements collected aboard icebreaker expeditions adjacent to Bharati Station captured dense shelf water cascades down the Amery Depression. Salinities reached 34.62 PSU at temperatures near surface freezing point (-1.89°C).

3. FRESHENING INDUCED BY BASAL ICE SHELF MELTING
Accelerated basal melting from the Amery Ice Shelf discharges buoyant freshwater into the coastal current. This freshwater cap reduces surface salinity, suppressing the density threshold required for deep convective overturning. We estimate a 14% reduction in AABW ventilation flux over the past three decades.`,
    docType: 'peer_reviewed_paper',
    stationId: 'st-bharati',
    stationCode: 'BHARATI',
    expeditionId: 'exp-isea-43',
    year: 2023,
    keywords: ['Antarctic Bottom Water', 'AABW', 'Thermohaline Circulation', 'Brine Rejection', 'Amery Ice Shelf', 'Prydz Bay', 'Ocean Overturning'],
    provenanceUrl: 'https://ncpor.res.in/publications/oceanography/aabw-amery-2023',
    isDemo: false,
    status: 'approved',
    createdAt: '2023-12-01T09:00:00Z',
    chunks: [
      {
        id: 'chk-aabw-01',
        documentId: 'doc-aabw-thermohaline',
        chunkIndex: 0,
        sectionTitle: '1. Global Conveyor Belt & AABW Generation',
        pageNumber: 1,
        content: 'Antarctic Bottom Water (AABW) is the densest water mass on Earth, driving global thermohaline ocean circulation. Freezing sea ice rejects salt (brine rejection), causing high-density seawater (>1027.85 kg/m³) to plunge down continental slopes into deep abyss basins.',
        tokenCount: 70,
        keywords: ['AABW', 'Antarctic Bottom Water', 'brine rejection', 'thermohaline circulation', 'density'],
      },
      {
        id: 'chk-aabw-02',
        documentId: 'doc-aabw-thermohaline',
        chunkIndex: 1,
        sectionTitle: '3. Freshening Induced by Basal Ice Shelf Melting',
        pageNumber: 3,
        content: 'Basal melting of the Amery Ice Shelf injects buoyant freshwater into coastal currents, lowering surface salinity and inhibiting deep convective sinking. Measurements show a 14% decline in AABW ventilation volume since 1995.',
        tokenCount: 65,
        keywords: ['Amery Ice Shelf', 'basal melting', '14% decline', 'freshwater cap', 'convective sinking'],
      },
    ],
  },
];

export const INITIAL_FLAGSHIP_LESSON: Lesson = {
  id: 'les-antarctic-sea-ice-flagship',
  title: 'Antarctic Sea Ice Dynamics & The Ice-Albedo Feedback Loop',
  topic: 'Antarctic Sea Ice and Climate',
  learnerLevel: 'undergraduate',
  targetDurationMin: 10,
  learningObjectives: [
    'Understand how seasonal fast ice functions as a thermodynamic barrier.',
    'Trace the positive feedback loop of summer melt pond formation reducing albedo from 0.84 to 0.48.',
    'Evaluate the impact of bottom melting (>3.4 cm/day) on Southern Ocean heat budgets.',
  ],
  summary: 'Flagship pedagogical lesson on Antarctic sea ice albedo feedback mechanisms based on observations at Bharati Station (Larsemann Hills).',
  sourceDocumentIds: ['doc-antarctic-ice-albedo'],
  createdAt: '2024-01-10T10:00:00Z',
  sections: [
    {
      id: 'sec-flagship-01',
      orderIndex: 0,
      title: 'Antarctic Fast Ice Thermodynamics',
      concept: 'Sea ice serves as a vital thermodynamic boundary regulating heat exchange between the polar atmosphere and Southern Ocean.',
      teacherScript: 'Welcome everyone! Today we will examine Antarctic fast ice and how its surface reflectivity regulates Earth\'s planetary energy balance.',
      estimatedDurationSec: 60,
      blackboardActions: [
        {
          id: 'act-flagship-01',
          actionType: 'WRITE_TEXT',
          orderIndex: 0,
          payload: { x: 50, y: 70, text: 'ANTARCTIC SEA ICE THERMODYNAMICS', size: 22, color: '#00f2fe', weight: 'bold' },
          spokenTriggerPhrase: 'Antarctic fast ice',
        },
        {
          id: 'act-flagship-02',
          actionType: 'DRAW_BOX',
          orderIndex: 1,
          payload: { x: 40, y: 110, width: 340, height: 120, label: 'Fast Ice (Prydz Bay / Bharati Station)', color: '#38bdf8' },
          spokenTriggerPhrase: 'thermodynamic boundary',
        },
        {
          id: 'act-flagship-03',
          actionType: 'WRITE_TEXT',
          orderIndex: 2,
          payload: { x: 60, y: 160, text: '• Peak Thickness: 1.6 - 2.1 meters\n• Active Months: April to November\n• Base Temp: -1.8°C Freezing Point', size: 15, color: '#f8fafc' },
        },
      ],
      expectedQuestions: ['Why is it called fast ice?', 'How thick does the ice grow at Bharati?'],
      sourceCitations: ['doc-antarctic-ice-albedo:Sec 1'],
    },
    {
      id: 'sec-flagship-02',
      orderIndex: 1,
      title: 'The Ice-Albedo Feedback Loop',
      concept: 'Fresh snow reflects 84% solar radiation; summer melt ponds plummet albedo to 0.48, accelerating ocean heat absorption.',
      teacherScript: 'Now, observe the blackboard as we trace the positive feedback cycle when surface snow metamorphoses into melt ponds during summer.',
      estimatedDurationSec: 90,
      blackboardActions: [
        {
          id: 'act-flagship-04',
          actionType: 'WRITE_TEXT',
          orderIndex: 0,
          payload: { x: 420, y: 70, text: 'THE ALBEDO FEEDBACK LOOP', size: 22, color: '#facc15', weight: 'bold' },
        },
        {
          id: 'act-flagship-05',
          actionType: 'DRAW_BOX',
          orderIndex: 1,
          payload: { x: 420, y: 110, width: 170, height: 60, label: 'Fresh Snow (Albedo 0.84)', color: '#86efac' },
        },
        {
          id: 'act-flagship-06',
          actionType: 'DRAW_ARROW',
          orderIndex: 2,
          payload: { from: { x: 505, y: 170 }, to: { x: 505, y: 220 }, label: 'Summer Solar Flux' },
        },
        {
          id: 'act-flagship-07',
          actionType: 'DRAW_BOX',
          orderIndex: 3,
          payload: { x: 420, y: 220, width: 170, height: 60, label: 'Melt Ponds (Albedo 0.48)', color: '#f87171' },
        },
        {
          id: 'act-flagship-08',
          actionType: 'DRAW_ARROW',
          orderIndex: 4,
          payload: { from: { x: 590, y: 250 }, to: { x: 670, y: 250 }, label: '52% Solar Absorbed' },
        },
        {
          id: 'act-flagship-09',
          actionType: 'DRAW_BOX',
          orderIndex: 5,
          payload: { x: 670, y: 220, width: 180, height: 60, label: 'Bottom Melt (>3.4 cm/day)', color: '#f43f5e' },
        },
      ],
      expectedQuestions: ['What is the albedo of open ocean water?', 'Can this feedback loop be reversed?'],
      sourceCitations: ['doc-antarctic-ice-albedo:Sec 3'],
    },
  ],
  quiz: [
    {
      id: 'quiz-flagship-01',
      question: 'What is the broadband albedo of fresh dry snow measured over fast ice near Bharati Station?',
      options: ['0.48 ± 0.03', '0.84 ± 0.03', '0.06 ± 0.01', '0.22 ± 0.04'],
      correctAnswerIndex: 1,
      explanation: 'Continuous Kipp & Zonen pyranometer readings at Bharati Station confirm fresh dry snow reflects 84% (albedo 0.84) of incident solar flux.',
      sourceReference: 'doc-antarctic-ice-albedo:Sec 2',
    },
    {
      id: 'quiz-flagship-02',
      question: 'How does melt pond formation accelerate sea ice disintegration?',
      options: [
        'By dropping albedo to 0.48 and absorbing over 52% solar radiation, driving bottom melting >3.4 cm/day',
        'By releasing volcanic hydrothermal vents beneath the continental shelf',
        'By neutralizing seawater salinity to 0 PSU',
        'By creating atmospheric ozone holes over Larsemann Hills',
      ],
      correctAnswerIndex: 0,
      explanation: 'Melt ponds drop albedo to 0.48, absorbing 52% of solar energy and warming the underlying ice slab.',
      sourceReference: 'doc-antarctic-ice-albedo:Sec 3',
    },
  ],
};
