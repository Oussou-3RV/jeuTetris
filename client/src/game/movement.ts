import { collides, type Grid } from './grid';
import { rotate, type PieceType, type Shape } from './pieces';

export type ActivePiece = {
  type: PieceType;
  shape: Shape;
  row: number;
  col: number;
};

function tryMove(
  grid: Grid,
  piece: ActivePiece,
  rowDelta: number,
  colDelta: number,
): ActivePiece {
  const moved = { ...piece, row: piece.row + rowDelta, col: piece.col + colDelta };
  return collides(grid, moved.shape, moved.row, moved.col) ? piece : moved;
}

export function moveLeft(grid: Grid, piece: ActivePiece): ActivePiece {
  return tryMove(grid, piece, 0, -1);
}

export function moveRight(grid: Grid, piece: ActivePiece): ActivePiece {
  return tryMove(grid, piece, 0, 1);
}

export function moveDown(grid: Grid, piece: ActivePiece): ActivePiece {
  return tryMove(grid, piece, 1, 0);
}

export function canMoveDown(grid: Grid, piece: ActivePiece): boolean {
  return !collides(grid, piece.shape, piece.row + 1, piece.col);
}

export function rotatePiece(grid: Grid, piece: ActivePiece): ActivePiece {
  const rotated = { ...piece, shape: rotate(piece.shape) };
  return collides(grid, rotated.shape, rotated.row, rotated.col) ? piece : rotated;
}

export function hardDrop(grid: Grid, piece: ActivePiece): ActivePiece {
  let current = piece;
  while (canMoveDown(grid, current)) {
    current = moveDown(grid, current);
  }
  return current;
}