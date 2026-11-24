import { describe, it, expect } from 'vitest';
import { PIECE_TYPES, getShape, rotate, type Shape } from './pieces';

const compterCarres = (s: Shape) => s.flat().filter((c) => c === 1).length;

describe('pièces', () => {
  it('il y a 7 types de pièces', () => {
    expect(PIECE_TYPES).toHaveLength(7);
  });

  it.each(PIECE_TYPES)('la pièce %s contient exactement 4 carrés', (type) => {
    expect(compterCarres(getShape(type))).toBe(4);
  });

  it('la pièce T a la bonne forme de départ', () => {
    expect(getShape('T')).toEqual([
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],    
    ]);
  });
});

describe('rotation', () => {
  it('tourne la pièce T de 90° vers la droite', () => {
    expect(rotate(getShape('T'))).toEqual([
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ]);
  });

  it.each(PIECE_TYPES)('4 rotations de la pièce %s redonnent la forme de départ', (type) => {
    let forme = getShape(type);
    for (let i = 0; i < 4; i++) forme = rotate(forme);
    expect(forme).toEqual(getShape(type));  
  });

  it.each(PIECE_TYPES)('la rotation de %s garde 4 carrés', (type) => {
    expect(compterCarres(rotate(getShape(type)))).toBe(4);
  });

  it('la pièce O ne change pas quand on la tourne', () => {
    expect(rotate(getShape('O'))).toEqual(getShape('O'));
  });

  it('rotate ne modifie pas la forme reçue', () => {
    const forme = getShape('T');
    const copie = forme.map((ligne) => [...ligne]);
    rotate(forme);
    expect(forme).toEqual(copie);
  });
});