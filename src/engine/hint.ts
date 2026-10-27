import { type BoardState, type CellCoord, type ValidationResult, validateBoard } from './rules.js';
import { type LevelDefinition } from './levels.js';

export type HintType = 'error-bone' | 'error-conflict' | 'guide-dog' | 'already-solved';

export interface HintResult {
  type: HintType;
  message: string;
  coord?: CellCoord;
  secondaryCoords?: CellCoord[];
}

/**
 * Avalia o estado atual do tabuleiro contra a solução canônica e regras do nível.
 *
 * Prioridade das Dicas:
 * 1. "Farejar Erro": Detecta ossos colocados na casa de um cachorro ou conflitos ativos.
 * 2. "Patinha Guia": Sugere a próxima casa correta onde o cachorrinho deve ser colocado.
 */
export function getHint(
  board: BoardState,
  level: LevelDefinition,
  validation?: ValidationResult
): HintResult {
  const size = level.size;
  const currentValidation = validation || validateBoard(board, level.regions);

  // 1. Tabuleiro já resolvido
  if (currentValidation.isSolved) {
    return {
      type: 'already-solved',
      message: 'O cantinho já está perfeito! Todos os cachorrinhos foram acomodados.'
    };
  }

  // 2. FAREJAR ERROS: Verifica se o jogador colocou ossinho no lugar onde DEVE ir um cão
  for (let r = 0; r < size; r++) {
    const correctCol = level.solution[r];
    if (board[r][correctCol] === 'bone') {
      return {
        type: 'error-bone',
        coord: { row: r, col: correctCol },
        message: `O farejador sentiu um engano: há um ossinho no lugar de um cachorrinho na Linha ${r + 1}, Coluna ${correctCol + 1}!`
      };
    }
  }

  // 3. FAREJAR CONFLITOS: Verifica se há cães em conflito direto
  if (currentValidation.conflictingCells.size > 0) {
    const firstConflictKey = Array.from(currentValidation.conflictingCells)[0];
    const [rStr, cStr] = firstConflictKey.split(',');
    const conflictCoord: CellCoord = { row: parseInt(rStr, 10), col: parseInt(cStr, 10) };

    return {
      type: 'error-conflict',
      coord: conflictCoord,
      message: 'Cuidado com o espaço pessoal! Há cães muito próximos ou repetidos na mesma linha/coluna.'
    };
  }

  // 4. PATINHA GUIA: Encontra a melhor próxima jogada
  // Prioriza linhas que tenham o menor número de opções livres restantes
  let bestRow = -1;
  let bestRemainingSlots = 999;

  for (let r = 0; r < size; r++) {
    const correctCol = level.solution[r];
    // Se esta linha já tem o cão colocado corretamente, ignora
    if (board[r][correctCol] === 'dog') {
      continue;
    }

    // Conta quantos espaços ainda estão vazios nesta linha
    let emptySlots = 0;
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 'empty') {
        emptySlots++;
      }
    }

    if (emptySlots > 0 && emptySlots < bestRemainingSlots) {
      bestRemainingSlots = emptySlots;
      bestRow = r;
    }
  }

  // Se encontrou uma linha com dedução óbvia ou prioritária
  if (bestRow !== -1) {
    const targetCol = level.solution[bestRow];
    return {
      type: 'guide-dog',
      coord: { row: bestRow, col: targetCol },
      message: `Faro aguçado! Um cachorrinho cabe perfeitamente na Linha ${bestRow + 1}, Coluna ${targetCol + 1} 🐾`
    };
  }

  // Fallback para qualquer cão que ainda falte
  for (let r = 0; r < size; r++) {
    const targetCol = level.solution[r];
    if (board[r][targetCol] !== 'dog') {
      return {
        type: 'guide-dog',
        coord: { row: r, col: targetCol },
        message: `Patinha guia! Acomode um cachorrinho na Linha ${r + 1}, Coluna ${targetCol + 1} 🐾`
      };
    }
  }

  return {
    type: 'already-solved',
    message: 'Nenhum erro encontrado!'
  };
}
