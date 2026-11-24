import { COLUMNS } from './grid';
import type { ActivePiece } from './movement';
import { PIECE_TYPES, getShape, type PieceType } from './pieces';

export type PieceGenerator = () => PieceType;

export function createRandomGenerator(random: () => number = Math.random): PieceGenerator {
  return () => PIECE_TYPES[Math.floor(random() * PIECE_TYPES.length)];
}

export function spawnPiece(type: PieceType): ActivePiece {
  const shape = getShape(type);
  const col = Math.floor((COLUMNS - shape[0].length) / 2);
  return { type, shape, row: 0, col };
}