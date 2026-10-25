import { type RegionMap } from './rules.js';
import { solvePuzzle } from './solver.js';

export interface LevelDefinition {
  id: string;
  name: string;
  breed: string; // Raça do cachorrinho colecionável desbloqueada
  breedIcon: string;
  size: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Mestre';
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

function growRegions(size: number, solution: number[], rng: () => number): RegionMap {
  const grid: number[][] = Array.from({ length: size }, () => new Array(size).fill(-1));
  const sortedTargetBuckets = size === 5 ? [1, 3, 5, 7, 9] :
    size === 6 ? [1, 2, 4, 6, 8, 15] :
    size === 7 ? [1, 2, 3, 5, 8, 12, 18] :
    [1, 1, 2, 3, 6, 9, 14, 28]; // 8x8 balanceado com âncoras unitárias

  const targetSizes = [...sortedTargetBuckets];
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
 * Gera proceduralmente um nível com garantia matemática de unicidade.
 */
export function generateLevel(levelNumber: number): LevelDefinition {
  const size = levelNumber <= 10 ? 5 :
               levelNumber <= 30 ? 6 :
               levelNumber <= 70 ? 7 : 8;

  const difficulty: LevelDefinition['difficulty'] =
    size === 5 ? 'Fácil' :
    size === 6 ? 'Médio' :
    size === 7 ? 'Difícil' : 'Mestre';

  const breedInfo = DOG_BREEDS[(levelNumber - 1) % DOG_BREEDS.length];

  let attempt = 0;
  while (attempt < 500) {
    const seed = levelNumber * 7919 + attempt * 997 + 12345;
    const rng = createRng(seed);
    const sol = findRandomValidPlacement(size, rng);
    if (!sol) {
      attempt++;
      continue;
    }

    const regions = growRegions(size, sol, rng);
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
