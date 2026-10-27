import { type RegionMap } from './rules.js';
import { solvePuzzle } from './solver.js';

export interface LevelDefinition {
  id: string;
  name: string;
  breed: string; // Raça do cachorrinho colecionável desbloqueada
  breedIcon: string;
  size: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Mestre' | 'Grão-Mestre' | 'Lenda';
  regions: RegionMap;
  solution: number[]; // colunas da solução por linha
}

export interface DogBreed {
  name: string;
  icon: string;
  article?: 'do' | 'da';
}

export const DOG_PLACES: string[] = [
  'O Quintal',
  'A Varanda',
  'O Cantinho',
  'O Bosque',
  'O Parque',
  'A Trilha',
  'A Toca',
  'O Jardim',
  'A Casinha',
  'O Gramado',
  'O Sofá',
  'O Tapete',
  'A Praia',
  'O Alpendre',
  'O Pátio',
  'O Mirante',
  'O Riacho',
  'O Refúgio',
  'A Praça',
  'A Sombra',
  'O Recanto',
  'A Colina',
  'O Pomar',
  'O Deck',
  'A Lagoa',
  'A Sacada',
  'O Chalé',
  'A Clareira',
  'O Esconderijo',
  'O Terraço',
  'O Vale',
  'A Alameda',
  'O Gazebo',
  'A Enseada',
  'O Bosquezinho',
  'O Piquenique',
  'A Cabana',
  'O Mirante Ensolarado',
  'A Prainha',
  'O Riacho das Patinhas',
  'O Canto da Lareira',
  'O Bosque das Bolinhas',
  'A Vereda',
  'O Campo Florido',
  'O Bosque dos Gravetos',
  'A Brisa',
  'A Ilha',
  'O Labirinto',
  'A Estalagem',
  'O Refúgio Secreto',
  'A Gruta',
  'O Recanto dos Ossinhos',
  'O Mirante das Estrelas'
];

export const DOG_BREEDS: DogBreed[] = [
  { name: 'Golden Retriever', icon: '🐕', article: 'do' },
  { name: 'Pug Travesso', icon: '🐶', article: 'do' },
  { name: 'Beagle Curioso', icon: '🦮', article: 'do' },
  { name: 'Corgi Real', icon: '🐕‍🦺', article: 'do' },
  { name: 'Husky Siberiano', icon: '🐺', article: 'do' },
  { name: 'Pastor Alemão Leal', icon: '🐕', article: 'do' },
  { name: 'Poodle Elegante', icon: '🐩', article: 'da' },
  { name: 'São Bernardo Guardião', icon: '🐶', article: 'do' },
  { name: 'Shiba Inu Solitário', icon: '🐕', article: 'do' },
  { name: 'Dachshund (Salsicha)', icon: '🌭', article: 'do' },
  { name: 'Labrador Amigável', icon: '🦮', article: 'do' },
  { name: 'Border Collie Gênio', icon: '🐕', article: 'do' },
  { name: 'Bulldog Francês', icon: '🐶', article: 'do' },
  { name: 'Boxer Saltitante', icon: '🐕', article: 'do' },
  { name: 'Dálmata Pintada', icon: '🐶', article: 'da' },
  { name: 'Rottweiler Corajoso', icon: '🐕', article: 'do' },
  { name: 'Shih Tzu Fofinho', icon: '🐩', article: 'do' },
  { name: 'Yorkshire Atrevido', icon: '🐶', article: 'do' },
  { name: 'Cocker Spaniel Orelhudo', icon: '🐕', article: 'do' },
  { name: 'Schnauzer Barbudinho', icon: '🐶', article: 'do' },
  { name: 'Maltês Branquinho', icon: '🐩', article: 'do' },
  { name: 'Pinscher Valente', icon: '🐶', article: 'do' },
  { name: 'Chihuahua Raivosinho', icon: '🐕', article: 'do' },
  { name: 'Akita Nobre', icon: '🐺', article: 'do' },
  { name: 'Bernese das Montanhas', icon: '🐕', article: 'do' },
  { name: 'Lulu da Pomerânia', icon: '🐩', article: 'do' },
  { name: 'Dogue Alemão Gigante', icon: '🐕', article: 'do' },
  { name: 'Samoieda Nuvem', icon: '🐺', article: 'do' },
  { name: 'Basset Hound Preguiçoso', icon: '🐕', article: 'do' },
  { name: 'Weimaraner Fantasma', icon: '🐕', article: 'do' },
  { name: 'Vira-lata Caramelo', icon: '🐕', article: 'do' },
  { name: 'Border Terrier Aventureiro', icon: '🐶', article: 'do' },
  { name: 'Chow Chow Ursinho', icon: '🦁', article: 'do' },
  { name: 'Pastor Belga Malinois', icon: '🐕', article: 'do' },
  { name: 'Jack Russell Elétrico', icon: '🐶', article: 'do' },
  { name: 'Shar Pei Enrugado', icon: '🐶', article: 'do' },
  { name: 'Mastim Inglês Sossegado', icon: '🐕', article: 'do' },
  { name: 'Bull Terrier Esportista', icon: '🐶', article: 'do' },
  { name: 'Galgo Veloz', icon: '🐕', article: 'do' },
  { name: 'Terra Nova Nadador', icon: '🐶', article: 'do' },
  { name: 'Fila Brasileiro Destemido', icon: '🐕', article: 'do' },
  { name: 'Fox Paulistinha Esperto', icon: '🐶', article: 'do' },
  { name: 'Boiadeiro Australiano (Blue Heeler)', icon: '🐕', article: 'do' },
  { name: 'Doberman Guardião', icon: '🐕', article: 'do' },
  { name: 'Lhasa Apso Tranquilo', icon: '🐩', article: 'do' },
  { name: 'Bichon Frisé Algodão', icon: '🐩', article: 'do' },
  { name: 'Boston Terrier Cavalheiro', icon: '🐶', article: 'do' },
  { name: 'Whippet Elegante', icon: '🐕', article: 'do' },
  { name: 'Cane Corso Imponente', icon: '🐕', article: 'do' },
  { name: 'Cavalier King Charles Nobre', icon: '🐶', article: 'do' },
  { name: 'Mastim Tibetano Leão', icon: '🦁', article: 'do' },
  { name: 'Collie das Colinas', icon: '🐕', article: 'do' },
  { name: 'Papillon Borboleta', icon: '🦋', article: 'do' },
  { name: 'Bloodhound Farejador Real', icon: '🐕', article: 'do' },
  { name: 'Pequinês Imperial', icon: '🦁', article: 'do' },
  { name: 'Basenji Silencioso', icon: '🐕', article: 'do' },
  { name: 'Pastor de Shetland Encantado', icon: '🐕', article: 'do' },
  { name: 'Vizsla Dourado Húngaro', icon: '🐕', article: 'do' },
  { name: 'Bullmastiff Protetor', icon: '🐕', article: 'do' },
  { name: 'Pastor Australiano Colorido', icon: '🐕', article: 'do' }
];

export interface DifficultyTier {
  id: string;
  name: string;
  minLevel: number;
  maxLevel: number;
  size: number;
  difficulty: LevelDefinition['difficulty'];
  icon: string;
  tagline: string;
  description: string;
}

export const DIFFICULTY_TIERS: DifficultyTier[] = [
  {
    id: 'tier-1',
    name: 'Iniciante',
    minLevel: 1,
    maxLevel: 12,
    size: 5,
    difficulty: 'Fácil',
    icon: '🌱',
    tagline: '5x5 • Âncoras Diretas',
    description: 'Tabuleiros 5x5 acolhedores para aprender as regras e relaxar sem pressão.'
  },
  {
    id: 'tier-2',
    name: 'Aprendiz',
    minLevel: 13,
    maxLevel: 35,
    size: 6,
    difficulty: 'Médio',
    icon: '🐾',
    tagline: '6x6 • Diagonais & Quinas',
    description: 'Introdução suave a cantos e eliminação de casas pelo toque de ponta.'
  },
  {
    id: 'tier-3',
    name: 'Intermediário',
    minLevel: 36,
    maxLevel: 80,
    size: 7,
    difficulty: 'Difícil',
    icon: '🧭',
    tagline: '7x7 • Paridade de Linhas',
    description: 'Regiões serpenteantes que exigem cruzar informações de linhas e colunas.'
  },
  {
    id: 'tier-4',
    name: 'Mestre Entrada',
    minLevel: 81,
    maxLevel: 250,
    size: 8,
    difficulty: 'Mestre',
    icon: '⭐',
    tagline: '8x8 • Transição Suave',
    description: 'Entrada no padrão clássico de 64 casas com âncoras amigáveis para pegar o ritmo.'
  },
  {
    id: 'tier-5',
    name: 'Mestre Avançado',
    minLevel: 251,
    maxLevel: 500,
    size: 8,
    difficulty: 'Mestre',
    icon: '🏆',
    tagline: '8x8 • Pointing Pairs',
    description: 'Fases desafiadoras (ex: Nível 400). Sem atalhos fáceis; deduções avançadas de linha.'
  },
  {
    id: 'tier-6',
    name: 'Grão-Mestre',
    minLevel: 501,
    maxLevel: 800,
    size: 8,
    difficulty: 'Grão-Mestre',
    icon: '🔮',
    tagline: '8x8 • Raciocínio Profundo',
    description: 'Equilíbrio topológico apurado (ex: Nível 700). Cadeias de 3 a 5 passos dedutivos.'
  },
  {
    id: 'tier-7',
    name: 'Lenda Canina',
    minLevel: 801,
    maxLevel: 1000,
    size: 8,
    difficulty: 'Lenda',
    icon: '👑',
    tagline: '8x8 • O Ápice da Lógica',
    description: 'O topo supremo do Borkdoku. Para quem dominou completamente a arte do Star Battle.'
  }
];

export function getTierForLevel(levelNumber: number): DifficultyTier {
  for (const tier of DIFFICULTY_TIERS) {
    if (levelNumber >= tier.minLevel && levelNumber <= tier.maxLevel) {
      return tier;
    }
  }
  return DIFFICULTY_TIERS[DIFFICULTY_TIERS.length - 1];
}

export const CURATED_LEVELS: LevelDefinition[] = [
  {
    id: 'level-1',
    name: 'O Cantinho do Golden',
    breed: 'Golden Retriever',
    breedIcon: '🐕',
    size: 5,
    difficulty: 'Fácil',
    regions: [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1],
      [0, 3, 3, 3, 2],
      [0, 3, 3, 4, 4],
      [0, 0, 3, 4, 4]
    ],
    solution: [0, 2, 4, 1, 3]
  },
  {
    id: 'level-2',
    name: 'O Quintal do Pug',
    breed: 'Pug Travesso',
    breedIcon: '🐶',
    size: 5,
    difficulty: 'Fácil',
    regions: [
      [1, 1, 1, 0, 0],
      [1, 1, 1, 0, 0],
      [1, 1, 2, 0, 3],
      [1, 1, 1, 3, 3],
      [1, 4, 4, 4, 4]
    ],
    solution: [3, 0, 2, 4, 1]
  },
  {
    id: 'level-3',
    name: 'O Parque do Beagle',
    breed: 'Beagle Curioso',
    breedIcon: '🦮',
    size: 6,
    difficulty: 'Médio',
    regions: [
      [0, 0, 0, 0, 0, 1],
      [0, 0, 0, 2, 0, 1],
      [3, 3, 0, 2, 2, 1],
      [3, 3, 0, 0, 4, 1],
      [5, 3, 3, 0, 4, 4],
      [5, 3, 3, 0, 0, 0]
    ],
    solution: [2, 5, 3, 1, 4, 0]
  },
  {
    id: 'level-4',
    name: 'A Varanda do Corgi',
    breed: 'Corgi Real',
    breedIcon: '🐕‍🦺',
    size: 6,
    difficulty: 'Médio',
    regions: [
      [2, 2, 1, 1, 1, 0],
      [2, 2, 2, 1, 1, 1],
      [2, 2, 2, 2, 2, 1],
      [4, 4, 4, 4, 3, 1],
      [4, 4, 4, 4, 4, 4],
      [4, 4, 5, 5, 4, 4]
    ],
    solution: [5, 3, 1, 4, 0, 2]
  },
  {
    id: 'level-5',
    name: 'A Trilha do Husky',
    breed: 'Husky Siberiano',
    breedIcon: '🐺',
    size: 7,
    difficulty: 'Difícil',
    regions: [
      [1, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 2, 1, 1],
      [1, 3, 1, 1, 1, 4, 1],
      [1, 1, 1, 1, 1, 4, 4],
      [1, 1, 5, 1, 1, 1, 1],
      [1, 1, 5, 1, 1, 1, 6]
    ],
    solution: [3, 0, 4, 1, 5, 2, 6]
  },
  {
    id: 'level-6',
    name: 'A Toca do Pastor Alemão',
    breed: 'Pastor Alemão Leal',
    breedIcon: '🐕',
    size: 7,
    difficulty: 'Difícil',
    regions: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1],
      [0, 0, 2, 2, 0, 3, 3],
      [0, 0, 4, 2, 3, 3, 3],
      [0, 0, 4, 4, 5, 3, 3],
      [0, 0, 4, 5, 5, 5, 5],
      [0, 6, 6, 6, 6, 6, 6]
    ],
    solution: [0, 6, 3, 5, 2, 4, 1]
  },
  {
    id: 'level-7',
    name: 'O Jardim do Poodle',
    breed: 'Poodle Elegante',
    breedIcon: '🐩',
    size: 8,
    difficulty: 'Mestre',
    regions: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 2, 0, 0, 0, 3, 3, 0],
      [0, 0, 0, 0, 0, 3, 3, 3],
      [0, 0, 0, 0, 0, 3, 4, 4],
      [0, 0, 0, 5, 5, 3, 3, 3],
      [0, 0, 7, 7, 7, 0, 6, 6],
      [0, 0, 7, 7, 7, 0, 0, 0]
    ],
    solution: [0, 4, 1, 5, 7, 3, 6, 2]
  },
  {
    id: 'level-8',
    name: 'O Bosque do São Bernardo',
    breed: 'São Bernardo Guardião',
    breedIcon: '🐶',
    size: 8,
    difficulty: 'Mestre',
    regions: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 2],
      [0, 0, 3, 3, 0, 0, 0, 2],
      [0, 0, 3, 3, 0, 0, 4, 4],
      [0, 0, 0, 3, 3, 3, 4, 4],
      [0, 0, 0, 5, 5, 3, 3, 3],
      [0, 6, 6, 6, 6, 6, 6, 6],
      [0, 6, 6, 6, 6, 7, 6, 6]
    ],
    solution: [0, 3, 7, 2, 6, 4, 1, 5]
  }
];

/**
 * Gera nomes charmosos e temáticos combinando 53 lugares caninos e 60 raças de cachorro.
 * Níveis 1 a 8 preservam seus nomes artesanais consagrados.
 * Para níveis 9+, cruza deterministicamente 53 lugares e 60 raças (3.180 combinações sem repetição).
 */
export function generateLevelName(levelNumber: number): string {
  if (levelNumber >= 1 && levelNumber <= CURATED_LEVELS.length) {
    return CURATED_LEVELS[levelNumber - 1].name;
  }
  const breedIndex = (levelNumber - 1) % DOG_BREEDS.length;
  const placeIndex = (levelNumber * 7 + 11) % DOG_PLACES.length;

  const breed = DOG_BREEDS[breedIndex];
  const place = DOG_PLACES[placeIndex];
  const article = breed.article || 'do';

  return `Nível ${levelNumber}: ${place} ${article} ${breed.name}`;
}

// Cache em memória para níveis já gerados proceduralmente
const levelCache = new Map<number, LevelDefinition>();

// PRNG determinístico rápido (Mulberry32)
function createRng(seed: number) {
  let s = seed | 0;
  return function() {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function findRandomValidPlacement(size: number, rng: () => number): number[] | null {
  const cols = new Array(size).fill(false);
  const placement = new Array(size).fill(-1);

  function search(row: number): boolean {
    if (row === size) return true;
    const available: number[] = [];
    for (let c = 0; c < size; c++) {
      if (!cols[c]) {
        if (row === 0 || Math.abs(placement[row - 1] - c) > 1) {
          available.push(c);
        }
      }
    }
    for (let i = available.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [available[i], available[j]] = [available[j], available[i]];
    }

    for (const c of available) {
      cols[c] = true;
      placement[row] = c;
      if (search(row + 1)) return true;
      cols[c] = false;
      placement[row] = -1;
    }
    return false;
  }

  if (search(0)) return placement;
  return null;
}

function growRegions(
  size: number,
  solution: number[],
  targetBuckets: number[],
  rng: () => number
): RegionMap {
  const grid: number[][] = Array.from({ length: size }, () => new Array(size).fill(-1));
  const targetSizes = [...targetBuckets];
  for (let i = targetSizes.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [targetSizes[i], targetSizes[j]] = [targetSizes[j], targetSizes[i]];
  }
  const currentSizes = new Array(size).fill(1);

  for (let r = 0; r < size; r++) {
    grid[r][solution[r]] = r;
  }

  let unassignedCount = size * size - size;
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  while (unassignedCount > 0) {
    const candidates: { r: number; c: number; reg: number }[] = [];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === -1) {
          for (const [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc] !== -1) {
              const reg = grid[nr][nc];
              if (currentSizes[reg] < targetSizes[reg]) {
                candidates.push({ r, c, reg });
              }
            }
          }
        }
      }
    }

    if (candidates.length === 0) {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (grid[r][c] === -1) {
            for (const [dr, dc] of dirs) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc] !== -1) {
                candidates.push({ r, c, reg: grid[nr][nc] });
              }
            }
          }
        }
      }
    }

    if (candidates.length === 0) break;
    const chosen = candidates[Math.floor(rng() * candidates.length)];
    grid[chosen.r][chosen.c] = chosen.reg;
    currentSizes[chosen.reg]++;
    unassignedCount--;
  }

  return grid;
}

/**
 * Retorna as configurações de particionamento e restrições de acordo com a curva de dificuldade progressiva:
 * - Níveis 1-12 (5x5, Fácil): Acolhimento, aprendizado rápido e dopamina inicial
 * - Níveis 13-35 (6x6, Médio): Primeiras deduções espaciais e cantos
 * - Níveis 36-80 (7x7, Difícil): Regiões maiores e raciocínio de paridade de linhas
 * - Níveis 81-250 (8x8, Mestre): Entrada no padrão 64 casas com âncoras suaves
 * - Níveis 251-500 (8x8, Mestre - ex: Nível 400): Máximo 1 âncora, deduções avançadas (pointing pairs)
 * - Níveis 501-800 (8x8, Grão-Mestre - ex: Nível 700): Equilíbrio topológico refinado, sem atalhos
 * - Níveis 801+ (8x8, Lenda Canina): Desafio puro com cadeias profundas de eliminação
 */
export function getTierSettings(levelNumber: number, attempt: number): {
  size: number;
  difficulty: LevelDefinition['difficulty'];
  buckets: number[];
  maxSingletons: number;
} {
  const size = levelNumber <= 12 ? 5 :
               levelNumber <= 35 ? 6 :
               levelNumber <= 80 ? 7 : 8;

  const difficulty: LevelDefinition['difficulty'] =
    size === 5 ? 'Fácil' :
    size === 6 ? 'Médio' :
    size === 7 ? 'Difícil' :
    levelNumber <= 500 ? 'Mestre' :
    levelNumber <= 800 ? 'Grão-Mestre' : 'Lenda';

  const maxSingletons =
    size <= 6 ? 2 :
    levelNumber <= 250 ? 2 : 1;

  let buckets: number[];
  if (size === 5) {
    buckets = [1, 2, 4, 7, 11];
  } else if (size === 6) {
    buckets = [1, 2, 4, 6, 9, 14];
  } else if (size === 7) {
    buckets = [1, 2, 3, 5, 8, 12, 18];
  } else if (attempt > 200) {
    // Escalada de tolerância para garantir geração síncrona em <50ms
    buckets = [1, 1, 2, 3, 6, 9, 14, 28];
  } else if (levelNumber <= 250) {
    buckets = [1, 1, 2, 4, 6, 8, 14, 28];
  } else {
    // Níveis 251+: Bucket equilibrado mestre com estritamente 1 singleton e alta profundidade
    buckets = [1, 2, 2, 4, 6, 9, 14, 26];
  }

  return { size, difficulty, buckets, maxSingletons };
}

/**
 * Gera proceduralmente um nível com garantia matemática de unicidade e curva calibrada de dificuldade.
 */
export function generateLevel(levelNumber: number): LevelDefinition {
  const breedInfo = DOG_BREEDS[(levelNumber - 1) % DOG_BREEDS.length];

  let attempt = 0;
  while (attempt < 500) {
    const { size, difficulty, buckets, maxSingletons } = getTierSettings(levelNumber, attempt);
    const seed = levelNumber * 7919 + attempt * 997 + 12345;
    const rng = createRng(seed);
    const sol = findRandomValidPlacement(size, rng);
    if (!sol) {
      attempt++;
      continue;
    }

    const regions = growRegions(size, sol, buckets, rng);

    // Evita proliferação de âncoras óbvias em fases avançadas
    if (attempt < 200) {
      const counts = new Array(size).fill(0);
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          counts[regions[r][c]]++;
        }
      }
      let singletons = 0;
      for (let i = 0; i < size; i++) {
        if (counts[i] === 1) singletons++;
      }
      if (singletons > maxSingletons) {
        attempt++;
        continue;
      }
    }

    const check = solvePuzzle(regions, 2);
    if (check.isUnique) {
      return {
        id: `level-${levelNumber}`,
        name: generateLevelName(levelNumber),
        breed: breedInfo.name,
        breedIcon: breedInfo.icon,
        size,
        difficulty,
        regions,
        solution: sol
      };
    }
    attempt++;
  }

  // Fallback de segurança se exceder 500 tentativas (raríssimo com os buckets calibrados)
  const fallback = CURATED_LEVELS[(levelNumber - 1) % CURATED_LEVELS.length];
  return {
    ...fallback,
    id: `level-${levelNumber}`,
    name: generateLevelName(levelNumber),
    breed: breedInfo.name,
    breedIcon: breedInfo.icon
  };
}

/**
 * Retorna o nível pelo seu número inteiro (1 a 500+).
 */
export function getLevel(levelNumber: number): LevelDefinition {
  const num = Math.max(1, levelNumber);

  if (num <= 8) {
    return CURATED_LEVELS[num - 1];
  }

  if (levelCache.has(num)) {
    return levelCache.get(num)!;
  }

  const generated = generateLevel(num);
  levelCache.set(num, generated);
  return generated;
}

/**
 * Retorna o nível pelo ID string (ex: 'level-400' ou 'level-1').
 */
export function getLevelById(id: string): LevelDefinition {
  const match = id.match(/\d+/);
  const num = match ? parseInt(match[0], 10) : 1;
  return getLevel(num);
}

/**
 * Retorna o próximo nível na sequência progressiva infinita (1 a 500+).
 */
export function getNextLevel(currentId: string): LevelDefinition {
  const match = currentId.match(/\d+/);
  const num = match ? parseInt(match[0], 10) : 1;
  return getLevel(num + 1);
}
