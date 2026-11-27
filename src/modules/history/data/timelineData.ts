export type EpochId =
  | 'cosmic'
  | 'earth'
  | 'biological'
  | 'agricultural'
  | 'industrial'
  | 'digital';

export interface EpochDefinition {
  id: EpochId;
  label: string;
  shortLabel: string;
  startYa: number; // years before 2026 CE
  endYa: number;
  logMin: number; // log10(endYa)
  logMax: number; // log10(startYa)
  summary: string;
  keyMetric: string;
  shade: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  epoch: EpochId;
  yearsAgo: number; // strictly > 0 (relative to 2026 CE, minimum 1)
  displayDate: string;
  domain: string;
  oneLiner: string;
  metrics: { label: string; value: string }[];
  deepNote: string;
  brainCc?: number;
  energyKcal?: number;
}

export type ScienceTrackKind = 'episteme' | 'techne' | 'synthesis';

export interface ScienceMilestone {
  id: string;
  yearLabel: string;
  yearsAgo: number;
  figure: string;
  breakthrough: string;
  kind: ScienceTrackKind;
  paradigmNote: string;
}

export interface HomininStage {
  species: string;
  horizon: string;
  brainCc: number;
  rmrSharePct: number;
  toolMode: string;
  energeticShift: string;
}

// Reference present = 2026 CE
export const PRESENT_YEAR = 2026;

export const EPOCHS: EpochDefinition[] = [
  {
    id: 'cosmic',
    label: 'Cosmic Origins',
    shortLabel: 'Cosmic',
    startYa: 13_800_000_000,
    endYa: 4_540_000_000,
    logMin: Math.log10(4_540_000_000),
    logMax: Math.log10(13_800_000_000),
    summary: 'Spacetime expansion, primordial H/He synthesis, Population III stars, and Milky Way assembly.',
    keyMetric: '75% H / 25% He primordial mass ratio',
    shade: '#f5f2eb',
  },
  {
    id: 'earth',
    label: 'Earth & Prebiotic',
    shortLabel: 'Earth',
    startYa: 4_540_000_000,
    endYa: 538_800_000,
    logMin: Math.log10(538_800_000),
    logMax: Math.log10(4_540_000_000),
    summary: 'Planetary accretion, liquid oceans, LUCA abiogenesis, Great Oxidation, and mitochondrial endosymbiosis.',
    keyMetric: '100,000x ATP energy per gene via mitochondria',
    shade: '#f7f5f0',
  },
  {
    id: 'biological',
    label: 'Biological Evolution',
    shortLabel: 'Biological',
    startYa: 538_800_000,
    endYa: 12_000,
    logMin: Math.log10(12_000),
    logMax: Math.log10(538_800_000),
    summary: 'Cambrian body plans, mass extinctions, bipedal hominins, fire-driven encephalization, and symbolic syntax.',
    keyMetric: '400 cc to 1,350 cc hominin brain expansion',
    shade: '#fafaf9',
  },
  {
    id: 'agricultural',
    label: 'Agricultural & Antiquity',
    shortLabel: 'Agricultural',
    startYa: 12_000,
    endYa: 276, // 1750 CE
    logMin: Math.log10(276),
    logMax: Math.log10(12_000),
    summary: 'Holocene grain domestication, river-valley urban states, writing, classical inquiry, and global trade.',
    keyMetric: '10x to 100x population density jump (>50/km2)',
    shade: '#f5f5f4',
  },
  {
    id: 'industrial',
    label: 'Industrial Energy',
    shortLabel: 'Industrial',
    startYa: 276, // 1750 CE
    endYa: 76, // 1950 CE
    logMin: Math.log10(76),
    logMax: Math.log10(276),
    summary: 'Fossil-fuel thermodynamics, electromagnetism, Fordist mass production, and state-funded Big Science.',
    keyMetric: '75,000 to 110,000 kcal/day/capita energy capture',
    shade: '#f8f4f0',
  },
  {
    id: 'digital',
    label: 'Digital & Anthropocene',
    shortLabel: 'Digital',
    startYa: 76, // 1950 CE
    endYa: 1, // Present
    logMin: 0,
    logMax: Math.log10(76),
    summary: 'Molecular genetics, ARPANET, algorithmic markets, programmable CRISPR editing, and planetary forcing.',
    keyMetric: '>220,000 kcal/day/capita global high-tech frontier',
    shade: '#fff7ed',
  },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'big-bang',
    title: 'Big Bang & Primordial Nucleosynthesis',
    epoch: 'cosmic',
    yearsAgo: 13_800_000_000,
    displayDate: '13.80 Gya',
    domain: 'Astrophysics',
    oneLiner: 'Spacetime expands; first 20 minutes freeze cosmic matter at ~75% hydrogen and ~25% helium.',
    metrics: [
      { label: 'Uncertainty', value: '+/- 0.02 Gya' },
      { label: 'Recombination', value: '380 kyr (~3,000 K)' },
    ],
    deepNote:
      'At 380,000 years post-singularity, electrons bound to protons and released the Cosmic Microwave Background (CMB). Population III stars later forged carbon through iron, while supernovae and neutron-star mergers synthesized heavier elements.',
  },
  {
    id: 'milky-way',
    title: 'Milky Way Galactic Assembly',
    epoch: 'cosmic',
    yearsAgo: 13_600_000_000,
    displayDate: '13.6 Gya',
    domain: 'Astrophysics',
    oneLiner: 'Gravitational collapse builds the galactic halo and early stellar populations.',
    metrics: [
      { label: 'Formation Window', value: '13.6 - 13.2 Gya' },
      { label: 'Nucleosynthesis', value: 'Pop III -> Pop II' },
    ],
    deepNote:
      'Successive generations of massive stars enriched the interstellar medium with heavy elements, creating the chemical inventory required for rocky planets and organic chemistry.',
  },
  {
    id: 'earth-accretion',
    title: 'Earth Accretion & Theia Giant Impact',
    epoch: 'earth',
    yearsAgo: 4_540_000_000,
    displayDate: '4.54 Gya',
    domain: 'Geochemistry',
    oneLiner: 'Planetesimal accretion forms Earth; oblique Theia impact (4.51 Gya) creates the Moon and 23.4 deg tilt.',
    metrics: [
      { label: 'Axial Tilt', value: '23.4 deg' },
      { label: 'Oceans Stable', value: '4.4 Gya' },
    ],
    deepNote:
      'A nearby supernova shockwave triggered solar-nebula collapse. The Moon stabilized Earth’s obliquity, anchoring predictable climate seasons across geological eras.',
  },
  {
    id: 'luca-abiogenesis',
    title: 'Abiogenesis & LUCA',
    epoch: 'earth',
    yearsAgo: 3_800_000_000,
    displayDate: '3.8 - 3.7 Gya',
    domain: 'Paleobiology',
    oneLiner: 'Earliest carbon-12 life signatures; anaerobic prokaryotes synthesize ATP via proton gradients.',
    metrics: [
      { label: 'Molecular Clock LUCA', value: '~4.2 Gya' },
      { label: 'Metabolism', value: 'Chemoautotrophic' },
    ],
    deepNote:
      'Isotopic carbon-12 enrichment and microfossils in Archean greenstone belts and hydrothermal vents mark early life. Moody et al. (2024) molecular clocks place LUCA around 4.2 Gya.',
  },
  {
    id: 'great-oxidation',
    title: 'Great Oxidation Event (GOE)',
    epoch: 'earth',
    yearsAgo: 2_400_000_000,
    displayDate: '2.4 - 2.1 Gya',
    domain: 'Geobiology',
    oneLiner: 'Cyanobacterial oxygenic photosynthesis precipitates Banded Iron Formations and triggers Snowball Earth.',
    metrics: [
      { label: 'Mineral Sink', value: 'Fe2+ -> Fe3+ BIFs' },
      { label: 'Glaciation', value: '~300 Myr Huronian' },
    ],
    deepNote:
      'Free O2 from Photosystems I and II saturated oceanic iron sinks, then oxidized atmospheric methane (CH4), collapsing the greenhouse effect and causing mass anaerobic extinction while unlocking aerobic metabolism.',
  },
  {
    id: 'eukaryogenesis',
    title: 'Eukaryogenesis & Mitochondrial Symbiosis',
    epoch: 'earth',
    yearsAgo: 1_800_000_000,
    displayDate: '1.8 - 1.5 Gya',
    domain: 'Cell Biology',
    oneLiner: 'An Asgard archaeal host retains an aerobic bacterium, multiplying ATP per gene by 100,000x.',
    metrics: [
      { label: 'Bioenergetic Gain', value: '100,000x ATP/gene' },
      { label: 'Multicellularity', value: '1.0 - 0.8 Gya' },
    ],
    deepNote:
      'Endosymbiotic mitochondria broke the surface-area-to-volume energy bottleneck of prokaryotes, enabling large eukaryotic genomes, colonial multicellularity (1.0 Gya), and Ediacaran soft-bodied fauna (635-538.8 Mya).',
  },
  {
    id: 'cambrian-explosion',
    title: 'Cambrian Explosion',
    epoch: 'biological',
    yearsAgo: 538_800_000,
    displayDate: '538.8 Mya',
    domain: 'Evolutionary Biology',
    oneLiner: 'Modern bilaterian phyla, eyes, hard shells, and active predation radiate within 20 million years.',
    metrics: [
      { label: 'Radiation Window', value: '~20 Myr' },
      { label: 'Land Plants', value: '475 Mya (O3 shield)' },
    ],
    deepNote:
      'Rising ocean oxygenation and predator-prey arms races drove rapid body-plan diversification (Arthropoda, Mollusca, Chordata / Pikaia). Ozone shielding later enabled terrestrial plants (475 Mya) and tetrapods like Tiktaalik (375 Mya).',
  },
  {
    id: 'amniotes-great-dying',
    title: 'Amniote Egg & Permian-Triassic Extinction',
    epoch: 'biological',
    yearsAgo: 252_000_000,
    displayDate: '320 - 252 Mya',
    domain: 'Paleontology',
    oneLiner: 'Amniotes conquer dry land (320 Mya); Siberian Traps volcanism later wipes out 95% of marine species.',
    metrics: [
      { label: 'Carboniferous O2', value: '~35% atm' },
      { label: 'Great Dying Loss', value: '95% marine / 70% land' },
    ],
    deepNote:
      'The amniotic egg freed vertebrates from aquatic reproduction during high-oxygen coal-forest eras. At 252 Mya, flood basalt volcanism and ocean acidification cleared ecological niches for early dinosaurs and mammals (~225 Mya).',
  },
  {
    id: 'kpg-extinction',
    title: 'K-Pg Asteroid Impact & Primate Radiation',
    epoch: 'biological',
    yearsAgo: 66_000_000,
    displayDate: '66.0 Mya',
    domain: 'Planetary Science',
    oneLiner: 'A 10 km Chicxulub impact ends non-avian dinosaurs, opening arboreal niches for primates.',
    metrics: [
      { label: 'Species Lost', value: '~75% terrestrial' },
      { label: 'Euprimates', value: '~56 Mya' },
    ],
    deepNote:
      'Multi-year impact winter collapsed photosynthetic food chains. Surviving mammals radiated rapidly; true primates evolved stereoscopic vision and grasping hands, with apes diverging from Old World monkeys around 25-20 Mya.',
  },
  {
    id: 'hominin-bipedalism',
    title: 'Hominin Split & Obligate Bipedalism',
    epoch: 'biological',
    yearsAgo: 4_000_000,
    displayDate: '7 - 4.0 Mya',
    domain: 'Paleoanthropology',
    oneLiner: 'Homo-Pan lineages split (7-6 Mya); Australopithecus afarensis walks upright with a 400 cc brain.',
    metrics: [
      { label: 'Brain Volume', value: '380 - 450 cc' },
      { label: 'Key Finding', value: 'Bipedalism precedes big brains' },
    ],
    deepNote:
      'East African drying expanded savannahs. Fossil AL 288-1 ("Lucy") shows valgus knees and arched feet millions of years before major cranial expansion.',
    brainCc: 410,
    energyKcal: 2400,
  },
  {
    id: 'homo-erectus-fire',
    title: 'Homo erectus, Cooking & Gut-Brain Trade-Off',
    epoch: 'biological',
    yearsAgo: 1_800_000,
    displayDate: '1.9 - 1.8 Mya',
    domain: 'Bioenergetics',
    oneLiner: 'Controlled fire and thermal pre-digestion shrink the gut and unlock a 900-1,100 cc brain.',
    metrics: [
      { label: 'Brain Volume', value: '900 - 1,100 cc' },
      { label: 'Egg Protein Digest.', value: '~51% raw -> ~91% cooked' },
    ],
    deepNote:
      'Following Homo habilis (2.4 Mya, 600 cc, Mode 1 Oldowan tools), Homo erectus paired Acheulean handaxes with persistence hunting and cooking (Wrangham hypothesis; unambiguous hearths ~1.0-0.8 Mya). By the Aiello-Wheeler Expensive Tissue Hypothesis, shrinking the metabolically costly gut financed neural expansion.',
    brainCc: 1000,
    energyKcal: 3400,
  },
  {
    id: 'homo-sapiens-cognitive',
    title: 'Homo sapiens & Cognitive Revolution',
    epoch: 'biological',
    yearsAgo: 70_000,
    displayDate: '300 - 70 kya',
    domain: 'Anthropology',
    oneLiner: 'Anatomically modern humans (300 kya, 1,350 cc) cross a symbolic threshold to scale beyond Dunbar’s 150.',
    metrics: [
      { label: 'Brain RMR Share', value: '20 - 25% (2% mass)' },
      { label: 'Dunbar Threshold', value: '~150 -> thousands' },
    ],
    deepNote:
      'Recursive language and shared imagined realities enabled flexible mass cooperation, global dispersal (Australia ~65-50 kya, Europe ~45 kya, 1.5-2.5% Neanderthal DNA), and megafaunal extinctions.',
    brainCc: 1350,
    energyKcal: 4000,
  },
  {
    id: 'neolithic-revolution',
    title: 'Neolithic Agricultural Revolution',
    epoch: 'agricultural',
    yearsAgo: 12_000,
    displayDate: '12 kya (10,000 BCE)',
    domain: 'Archaeology',
    oneLiner: 'Holocene stabilization enables grain domestication, raising carrying capacity 10-100x at a health cost.',
    metrics: [
      { label: 'Density Shift', value: '<1 -> >50 people/km2' },
      { label: 'Holocene Onset', value: '~11,700 ya' },
    ],
    deepNote:
      'Independent domestication in the Fertile Crescent (wheat, barley), China (rice, millet), and the Americas (maize, potatoes) created storable surpluses, alongside reduced stature, dental caries, and livestock zoonoses.',
    energyKcal: 10000,
  },
  {
    id: 'urban-states',
    title: 'First Urban States: Sumer, Egypt & Harappa',
    epoch: 'agricultural',
    yearsAgo: 5_526,
    displayDate: '3500 - 1900 BCE',
    domain: 'Ancient History',
    oneLiner: 'Grain surpluses finance writing (cuneiform 3400 BCE), irrigation bureaucracies, and planned cities.',
    metrics: [
      { label: 'Sumer Base', value: 'Sexagesimal (Base-60)' },
      { label: 'Harappa Bricks', value: '1:2:4 standardized ratio' },
    ],
    deepNote:
      'Sumerian clay tokens evolved into cuneiform accounting; Egypt unified under Narmer (3100 BCE) on predictable Nile silt without Mesopotamian salinization; Mature Harappa (2600-1900 BCE) built municipal covered drainage and grid cities.',
    energyKcal: 22000,
  },
  {
    id: 'bronze-age-collapse',
    title: 'Late Bronze Age Collapse',
    epoch: 'agricultural',
    yearsAgo: 3_226,
    displayDate: '1200 - 1150 BCE',
    domain: 'Systems History',
    oneLiner: 'Cascading drought, tin-copper trade failure, revolts, and Sea Peoples collapse Eastern Mediterranean states.',
    metrics: [
      { label: 'Collapse Span', value: '~50 years' },
      { label: 'Tech Shift', value: 'Bronze -> local Iron' },
    ],
    deepNote:
      'Tightly coupled palace economies (Mycenae, Hittites, Ugarit) failed synchronously when long-distance tin-copper networks broke. Ubiquitous local iron ore decentralized post-collapse metallurgy.',
    energyKcal: 18000,
  },
  {
    id: 'classical-athens-socrates',
    title: 'Athenian Democracy & Trial of Socrates',
    epoch: 'agricultural',
    yearsAgo: 2_425,
    displayDate: '508 - 399 BCE',
    domain: 'Political Philosophy',
    oneLiner: 'Open inquiry (elenchus) and direct democracy contrast with Spartan stasis; Socrates executed in 399 BCE.',
    metrics: [
      { label: 'Jury Size', value: '501 citizens' },
      { label: 'Lineage', value: 'Socrates -> Plato -> Aristotle' },
    ],
    deepNote:
      'Following the Peloponnesian War and the Thirty Tyrants (404-403 BCE), restored Athenian democracy charged Socrates with impiety and corrupting youth. Plato’s preservation of his method separated doxa (opinion) from episteme (knowledge).',
    energyKcal: 31000,
  },
  {
    id: 'columbian-scientific-rev',
    title: 'Columbian Exchange & Scientific Revolution',
    epoch: 'agricultural',
    yearsAgo: 483, // 1543 CE
    displayDate: '1492 - 1687 CE',
    domain: 'History of Science',
    oneLiner: 'Global ecological transfer meets mathematical heliocentrism, anatomy, and Newtonian mechanics.',
    metrics: [
      { label: 'Principia', value: '1687 CE (Newton)' },
      { label: 'Motto', value: 'Nullius in verba' },
    ],
    deepNote:
      'Copernicus and Vesalius (1543), Harvey (1628), and Newton (1687) broke Aristotelian cosmology via empirical verification and calculus, while Enlightenment thinkers (Locke, Voltaire) codified natural rights and reason.',
    energyKcal: 38000,
  },
  {
    id: 'industrial-thermodynamics',
    title: 'Industrial Fossil-Fuel & Thermodynamic Transition',
    epoch: 'industrial',
    yearsAgo: 186, // ~1840 CE
    displayDate: '1750 - 1914 CE',
    domain: 'Energy & Industry',
    oneLiner: 'Coal, steam engines, Maxwell’s electromagnetism, and Fordist assembly lines break organic energy ceilings.',
    metrics: [
      { label: 'Energy Capture', value: '75k - 110k kcal/day' },
      { label: 'Key Laws', value: 'Thermodynamics & EM' },
    ],
    deepNote:
      'Replacing muscle and biomass with fossil fuels multiplied per-capita power by an order of magnitude, while generating urban pollution, imperial asymmetries, and technological lock-in.',
    energyKcal: 92000,
  },
  {
    id: 'big-science-ww2',
    title: 'Big Science & Post-1945 Geopolitical Reordering',
    epoch: 'industrial',
    yearsAgo: 81, // 1945 CE
    displayDate: '1939 - 1945 CE',
    domain: 'Geopolitics & Physics',
    oneLiner: 'Controlled nuclear fission (1942) and WWII shift the world from multipolar empires to bipolar deterrence.',
    metrics: [
      { label: 'Chicago Pile-1', value: '1942 CE' },
      { label: 'Order Shift', value: 'Multipolar -> Bipolar' },
    ],
    deepNote:
      'State-capitalized multi-site research (Manhattan Project) fused physics with national security, while Bretton Woods and nuclear deterrence redefined global institutions.',
    energyKcal: 135000,
  },
  {
    id: 'digital-anthropocene',
    title: 'DNA, ARPANET, CRISPR & The Anthropocene',
    epoch: 'digital',
    yearsAgo: 14, // 2012 CE anchor for modern cluster
    displayDate: '1953 - 2026 CE',
    domain: 'Information & Biosphere',
    oneLiner: 'Molecular genetics, global computation, and algorithmic markets turn humanity into a planetary geological force.',
    metrics: [
      { label: 'Energy Frontier', value: '~230,000 kcal/day/cap' },
      { label: 'Market Latency', value: 'Coffeehouse -> HFT servers' },
    ],
    deepNote:
      'From DNA (1953) and ARPANET/Apollo 11 (1969) to the Human Genome Project (1990-2003) and CRISPR-Cas9 (2012), information theory and synthetic biology now co-evolve with planetary climate constraints.',
    energyKcal: 230000,
  },
];

export const SCIENCE_MILESTONES: ScienceMilestone[] = [
  {
    id: 'sci-thales',
    yearLabel: '585 BCE',
    yearsAgo: 2611,
    figure: 'Thales of Miletus',
    breakthrough: 'Naturalistic eclipse prediction & material substrate',
    kind: 'episteme',
    paradigmNote: 'Shifted explanation from mythic agency toward natural regularities.',
  },
  {
    id: 'sci-aristotle',
    yearLabel: '335 BCE',
    yearsAgo: 2361,
    figure: 'Aristotle',
    breakthrough: 'Lyceum founded; formal logic & empirical taxonomy',
    kind: 'episteme',
    paradigmNote: 'Systematized biology and geocentric physics that dominated for 1,800 years.',
  },
  {
    id: 'sci-eratosthenes',
    yearLabel: '250 BCE',
    yearsAgo: 2276,
    figure: 'Eratosthenes',
    breakthrough: 'Measured Earth’s circumference via solar shadows',
    kind: 'synthesis',
    paradigmNote: 'Combined geometry with empirical measurement across Alexandria and Syene.',
  },
  {
    id: 'sci-khwarizmi',
    yearLabel: '820 CE',
    yearsAgo: 1206,
    figure: 'Al-Khwarizmi',
    breakthrough: 'Kitab al-jabr: formal foundation of algebra',
    kind: 'episteme',
    paradigmNote: 'Emergent product of the Abbasid Translation Movement synthesizing Greek and Indian math.',
  },
  {
    id: 'sci-bisheng',
    yearLabel: '1041 CE',
    yearsAgo: 985,
    figure: 'Bi Sheng',
    breakthrough: 'Ceramic movable-type printing in Song China',
    kind: 'techne',
    paradigmNote: 'Applied reproduction technology that lowered the cost of transmitting knowledge.',
  },
  {
    id: 'sci-copernicus',
    yearLabel: '1543 CE',
    yearsAgo: 483,
    figure: 'Copernicus & Vesalius',
    breakthrough: 'Heliocentric astronomy & direct human anatomy',
    kind: 'episteme',
    paradigmNote: 'Replaced Ptolemaic geocentrism and Galenic dogma with direct mathematical and anatomical evidence.',
  },
  {
    id: 'sci-harvey',
    yearLabel: '1628 CE',
    yearsAgo: 398,
    figure: 'William Harvey',
    breakthrough: 'Closed circulatory system of blood (De motu cordis)',
    kind: 'episteme',
    paradigmNote: 'Applied quantitative flow reasoning to physiology, undermining humoralism.',
  },
  {
    id: 'sci-newton',
    yearLabel: '1687 CE',
    yearsAgo: 339,
    figure: 'Isaac Newton',
    breakthrough: 'Principia Mathematica: universal gravitation & calculus',
    kind: 'synthesis',
    paradigmNote: 'Unified terrestrial and celestial mechanics under single mathematical laws.',
  },
  {
    id: 'sci-lavoisier',
    yearLabel: '1789 CE',
    yearsAgo: 237,
    figure: 'Antoine Lavoisier',
    breakthrough: 'Quantitative chemistry & oxygen combustion theory',
    kind: 'episteme',
    paradigmNote: 'Replaced phlogiston theory with mass conservation and precise instrumentation.',
  },
  {
    id: 'sci-lyell',
    yearLabel: '1833 CE',
    yearsAgo: 193,
    figure: 'Charles Lyell',
    breakthrough: 'Uniformitarianism & geological deep time',
    kind: 'episteme',
    paradigmNote: 'Established slow, continuous geological processes over vast time horizons.',
  },
  {
    id: 'sci-darwin',
    yearLabel: '1859 CE',
    yearsAgo: 167,
    figure: 'Charles Darwin',
    breakthrough: 'On the Origin of Species: natural selection',
    kind: 'episteme',
    paradigmNote: 'Unified biological diversity via descent with modification across deep time.',
  },
  {
    id: 'sci-maxwell-mendel',
    yearLabel: '1865 CE',
    yearsAgo: 161,
    figure: 'Maxwell & Mendel',
    breakthrough: 'Electromagnetic wave equations & laws of genetics',
    kind: 'synthesis',
    paradigmNote: 'Laid simultaneous foundations for power grids/radio and the Modern Synthesis.',
  },
  {
    id: 'sci-curie-roentgen',
    yearLabel: '1895 - 1898 CE',
    yearsAgo: 129,
    figure: 'Roentgen & M./P. Curie',
    breakthrough: 'X-rays & radioactivity (polonium, radium)',
    kind: 'techne',
    paradigmNote: 'New diagnostic instruments revealed subatomic instability and launched modern physics.',
  },
  {
    id: 'sci-einstein',
    yearLabel: '1905 / 1915 CE',
    yearsAgo: 116,
    figure: 'Albert Einstein',
    breakthrough: 'Special & General Relativity (spacetime curvature)',
    kind: 'episteme',
    paradigmNote: 'Reframed gravity, light speed, and cosmic geometry, enabling Big Bang cosmology.',
  },
  {
    id: 'sci-fermi',
    yearLabel: '1942 CE',
    yearsAgo: 84,
    figure: 'Enrico Fermi et al.',
    breakthrough: 'Chicago Pile-1: controlled nuclear chain reaction',
    kind: 'techne',
    paradigmNote: 'Inaugurated industrial-scale Big Science and nuclear energy/deterrence.',
  },
  {
    id: 'sci-dna',
    yearLabel: '1953 CE',
    yearsAgo: 73,
    figure: 'Franklin, Watson, Crick, Wilkins',
    breakthrough: 'Double-helix structure of DNA',
    kind: 'synthesis',
    paradigmNote: 'X-ray crystallography revealed the molecular code behind the central dogma of genetics.',
  },
  {
    id: 'sci-arpanet',
    yearLabel: '1969 CE',
    yearsAgo: 57,
    figure: 'ARPANET & Apollo 11',
    breakthrough: 'Packet-switched networking & crewed lunar landing',
    kind: 'techne',
    paradigmNote: 'Cold War state patronage forged global digital networking and orbital infrastructure.',
  },
  {
    id: 'sci-hgp',
    yearLabel: '1990 - 2003 CE',
    yearsAgo: 23,
    figure: 'Human Genome Project',
    breakthrough: 'Complete sequencing of the human genome',
    kind: 'synthesis',
    paradigmNote: 'Public-private Big Science merged molecular biology with high-throughput computation.',
  },
  {
    id: 'sci-crispr',
    yearLabel: '2012 CE',
    yearsAgo: 14,
    figure: 'Doudna, Charpentier et al.',
    breakthrough: 'CRISPR-Cas9 programmable gene editing',
    kind: 'techne',
    paradigmNote: 'Adapted bacterial immunity into precision biological engineering.',
  },
];

export const HOMININ_ENCEPHALIZATION: HomininStage[] = [
  {
    species: 'Australopithecus afarensis',
    horizon: '4.0 - 3.0 Mya',
    brainCc: 410,
    rmrSharePct: 9,
    toolMode: 'None / unmodified',
    energeticShift: 'Obligate bipedalism; large fibrous-forage gut',
  },
  {
    species: 'Homo habilis',
    horizon: '2.4 - 1.6 Mya',
    brainCc: 615,
    rmrSharePct: 13,
    toolMode: 'Mode 1 Oldowan',
    energeticShift: 'Scavenged bone marrow & stone-flaked meat',
  },
  {
    species: 'Homo erectus',
    horizon: '1.9 Mya - 110 kya',
    brainCc: 1000,
    rmrSharePct: 19,
    toolMode: 'Mode 2 Acheulean',
    energeticShift: 'Fire & cooking shrink gut; endurance hunting',
  },
  {
    species: 'Homo sapiens',
    horizon: '300 kya - Present',
    brainCc: 1350,
    rmrSharePct: 22.5,
    toolMode: 'Symbolic / composite',
    energeticShift: '2% body mass consumes 20-25% resting energy',
  },
];
