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

export const DOG_BREEDS = [
  { name: 'Golden Retriever', icon: '🐕' },
  { name: 'Pug Travesso', icon: '🐶' },
  { name: 'Beagle Curioso', icon: '🦮' },
  { name: 'Corgi Real', icon: '🐕‍🦺' },
  { name: 'Husky Siberiano', icon: '🐺' },
  { name: 'Pastor Alemão Leal', icon: '🐕' },
  { name: 'Poodle Elegante', icon: '🐩' },
  { name: 'São Bernardo Guardião', icon: '🐶' },
  { name: 'Shiba Inu Solitário', icon: '🐕' },
  { name: 'Dachshund (Salsicha)', icon: '🌭' },
  { name: 'Labrador Amigável', icon: '🦮' },
  { name: 'Border Collie Gênio', icon: '🐕' },
  { name: 'Bulldog Francês', icon: '🐶' },
  { name: 'Boxer Saltitante', icon: '🐕' },
  { name: 'Dálmata Pintado', icon: '🐶' },
  { name: 'Rottweiler Corajoso', icon: '🐕' },
  { name: 'Shih Tzu Fofinho', icon: '🐩' },
  { name: 'Yorkshire Atrevido', icon: '🐶' },
  { name: 'Cocker Spaniel Orelhudo', icon: '🐕' },
  { name: 'Schnauzer Barbudinho', icon: '🐶' },
  { name: 'Maltês Branquinho', icon: '🐩' },
  { name: 'Pinscher Valente', icon: '🐶' },
  { name: 'Chihuahua Raivosinho', icon: '🐕' },
  { name: 'Akita Nobre', icon: '🐺' },
  { name: 'Bernese das Montanhas', icon: '🐕' },
  { name: 'Lulu da Pomerânia', icon: '🐩' },
  { name: 'Dogue Alemão Gigante', icon: '🐕' },
  { name: 'Samoieda Nuvem', icon: '🐺' },
  { name: 'Basset Hound Preguiçoso', icon: '🐕' },
  { name: 'Weimaraner Fantasma', icon: '🐕' },
  { name: 'Vira-lata Caramelo', icon: '🐕' },
  { name: 'Border Terrier Aventureiro', icon: '🐶' },
  { name: 'Chow Chow Ursinho', icon: '🦁' },
  { name: 'Pastor Belga Malinois', icon: '🐕' },
  { name: 'Jack Russell Elétrico', icon: '🐶' },
  { name: 'Shar Pei Enrugado', icon: '🐶' },
  { name: 'Mastim Inglês Sossegado', icon: '🐕' },
  { name: 'Bull Terrier Esportista', icon: '🐶' },
  { name: 'Galgo Veloz', icon: '🐕' },
  { name: 'Terra Nova Nadador', icon: '🐶' }
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
    breed: 'Poodle Encantador',
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
  } else if (levelNumber <= 600) {
    buckets = [1, 2, 2, 4, 6, 9, 14, 26];
  } else {
    buckets = [1, 2, 3, 4, 6, 9, 13, 26];
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
        name: `Nível ${levelNumber}: O Recanto do ${breedInfo.name}`,
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
  return CURATED_LEVELS[(levelNumber - 1) % CURATED_LEVELS.length];
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
