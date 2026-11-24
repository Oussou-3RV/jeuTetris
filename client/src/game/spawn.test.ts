import { describe, it, expect } from 'vitest';
import { createGrid, collides } from './grid';
import { PIECE_TYPES, getShape } from './pieces';
import { createRandomGenerator, spawnPiece } from './spawn';

describe('createRandomGenerator', () => {
  it('choisit une pièce selon la valeur aléatoire reçue', () => {
    expect(createRandomGenerator(() => 0)()).toBe('I');
    expect(createRandomGenerator(() => 0.5)()).toBe('S');
    expect(createRandomGenerator(() => 0.999)()).toBe('L');
  });

  it('peut produire chacun des 7 types', () => {
    const produits = PIECE_TYPES.map((_, i) =>
      createRandomGenerator(() => (i + 0.5) / PIECE_TYPES.length)(),
    );
    expect(produits).toEqual(PIECE_TYPES);
  });

  it('fonctionne avec Math.random par défaut', () => {
    expect(PIECE_TYPES).toContain(createRandomGenerator()());
  });
});

describe('spawnPiece', () => {
  it.each(PIECE_TYPES)('la pièce %s apparaît à la ligne 0 avec sa forme de départ', (type) => {
    const piece = spawnPiece(type);
    expect(piece.type).toBe(type);
    expect(piece.row).toBe(0);
    expect(piece.shape).toEqual(getShape(type));
  });

  it.each([
    ['I', 3],
    ['O', 4],
    ['T', 3],
    ['J', 3],
  ] as const)('la pièce %s est centrée à la colonne %i', (type, col) => {
    expect(spawnPiece(type).col).toBe(col);
  });

  it.each(PIECE_TYPES)('la pièce %s ne touche rien dans une grille vide', (type) => {
    const piece = spawnPiece(type);
    expect(collides(createGrid(), piece.shape, piece.row, piece.col)).toBe(false);
  });
});