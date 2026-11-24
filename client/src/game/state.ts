import { createGrid, lockPiece, type Grid } from './grid';
import type { ActivePiece } from './movement';
import type { PieceType } from './pieces';
import { spawnPiece, type PieceGenerator } from './spawn';

export type PlayState = {
  grid: Grid;
  current: ActivePiece;
  next: PieceType;
};

export function createPlayState(generator: PieceGenerator): PlayState {
  return {
    grid: createGrid(),
    current: spawnPiece(generator()),
    next: generator(),
  };
}

export function lockCurrentPiece(state: PlayState, generator: PieceGenerator): PlayState {
  const { grid, current, next } = state;
  return {
    grid: lockPiece(grid, current.shape, current.type, current.row, current.col),
    current: spawnPiece(next),
    next: generator(),
  };
}