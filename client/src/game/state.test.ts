import { describe, it, expect } from 'vitest';
import { createGrid } from './grid';
import { getShape, type PieceType } from './pieces';
import { hardDrop } from './movement';
import type { PieceGenerator } from './spawn';
import { createPlayState, lockCurrentPiece, type PlayState } from './state';

const sequence = (...types: PieceType[]): PieceGenerator => {
  let i = 0;
  return () => types[i++ % types.length];
};

describe('createPlayState', () => {
  it('démarre avec une grille vide', () => {
    const state = createPlayState(sequence('T', 'I'));
    expect(state.grid.flat().every((c) => c === null)).toBe(true);
  });

  it('tire la pièce courante puis la prochaine pièce du générateur', () => {
    const state = createPlayState(sequence('T', 'I', 'O'));
    expect(state.current.type).toBe('T');
    expect(state.next).toBe('I');
  });
});

describe('lockCurrentPiece', () => {
  const stateWithOAtBottom = (): PlayState => ({
    grid: createGrid(),
    current: { type: 'O', shape: getShape('O'), row: 18, col: 4 },
    next: 'T',
  });

  it('fige la pièce courante dans la grille', () => {
    const resultat = lockCurrentPiece(stateWithOAtBottom(), sequence('L'));
    expect(resultat.grid[18][4]).toBe('O');
    expect(resultat.grid[18][5]).toBe('O');
    expect(resultat.grid[19][4]).toBe('O');
    expect(resultat.grid[19][5]).toBe('O');
  });

  it('la prochaine pièce devient la pièce courante, en haut de la grille', () => {
    const resultat = lockCurrentPiece(stateWithOAtBottom(), sequence('L'));
    expect(resultat.current.type).toBe('T');
    expect(resultat.current.row).toBe(0);
  });

  it('tire une nouvelle prochaine pièce du générateur', () => {
    const resultat = lockCurrentPiece(stateWithOAtBottom(), sequence('L'));
    expect(resultat.next).toBe('L');
  });

  it('ne modifie pas l\'état d\'origine', () => {
    const state = stateWithOAtBottom();
    lockCurrentPiece(state, sequence('L'));
    expect(state.grid.flat().every((c) => c === null)).toBe(true);
    expect(state.current.type).toBe('O');
    expect(state.next).toBe('T');
  });

  it('enchaîne les pièces dans l\'ordre du générateur', () => {
    const generateur = sequence('T', 'I', 'O', 'Z');
    let state = createPlayState(generateur);

    state = { ...state, current: hardDrop(state.grid, state.current) };
    state = lockCurrentPiece(state, generateur);
    expect(state.current.type).toBe('I');
    expect(state.next).toBe('O');

    state = { ...state, current: hardDrop(state.grid, state.current) };
    state = lockCurrentPiece(state, generateur);
    expect(state.current.type).toBe('O');
    expect(state.next).toBe('Z');
  });
});