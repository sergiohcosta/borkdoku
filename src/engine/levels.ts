import { type RegionMap } from './rules.js';

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

export function getLevelById(id: string): LevelDefinition {
  const found = CURATED_LEVELS.find(lvl => lvl.id === id);
  return found || CURATED_LEVELS[0];
}

export function getNextLevel(currentId: string): LevelDefinition {
  const idx = CURATED_LEVELS.findIndex(lvl => lvl.id === currentId);
  if (idx >= 0 && idx < CURATED_LEVELS.length - 1) {
    return CURATED_LEVELS[idx + 1];
  }
  // Se terminou o catálogo curado, volta para o início em modo contínuo
  return CURATED_LEVELS[0];
}
