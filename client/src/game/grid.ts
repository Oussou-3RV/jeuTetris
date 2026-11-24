import type { PieceType, Shape } from './pieces';

export const COLUMNS = 10;
export const ROWS = 20;

export type Cell = PieceType | null;
export type Grid = Cell[][];

export function createGrid(): Grid {
  return Array.from({ length: ROWS }, () => Array<Cell>(COLUMNS).fill(null));
}

export function collides(grid: Grid, shape: Shape, row: number, col: number): boolean {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] === 0) continue;
  
        const gridRow = row + r;
        const gridCol = col + c;
  
        const isOutside =
          gridRow < 0 || gridRow >= ROWS || gridCol < 0 || gridCol >= COLUMNS;
        if (isOutside) return true;
  
        if (grid[gridRow][gridCol] !== null) return true;
      }
    }
    return false;
  }
  
  export function lockPiece(
    grid: Grid,
    shape: Shape,
    type: PieceType,
    row: number,
    col: number,
  ): Grid {
    const copy = grid.map((ligne) => [...ligne]);
  
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] === 0) continue;
        copy[row + r][col + c] = type;
      }
    }
    return copy;
  }

