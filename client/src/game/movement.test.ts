import { describe, it, expect } from 'vitest';
import { COLUMNS, ROWS, createGrid } from './grid';
import { getShape, rotate, type PieceType } from './pieces';
import {
  moveLeft,
  moveRight,
  moveDown,
  canMoveDown,
  rotatePiece,
  hardDrop,
  type ActivePiece,
} from './movement';

const piece = (type: PieceType, row: number, col: number): ActivePiece => ({
  type,
  shape: getShape(type),
  row,
  col,
});

describe('moveLeft', () => {
  it('déplace la pièce d\'une colonne vers la gauche', () => {
    const resultat = moveLeft(createGrid(), piece('T', 5, 4));
    expect(resultat.col).toBe(3);
    expect(resultat.row).toBe(5);
  });

  it('est bloqué par le mur de gauche', () => {
    expect(moveLeft(createGrid(), piece('O', 5, 0)).col).toBe(0);
  });

  it('est bloqué par un bloc déjà posé', () => {
    const grille = createGrid();
    grille[5][2] = 'I';
    expect(moveLeft(grille, piece('O', 5, 3)).col).toBe(3);
  });

  it('ne modifie pas la pièce d\'origine', () => {
    const originale = piece('T', 5, 4);
    moveLeft(createGrid(), originale);
    expect(originale.col).toBe(4);
  });
});

describe('moveRight', () => {
  it('déplace la pièce d\'une colonne vers la droite', () => {
    expect(moveRight(createGrid(), piece('T', 5, 4)).col).toBe(5);
  });

  it('est bloqué par le mur de droite', () => {
    expect(moveRight(createGrid(), piece('O', 5, COLUMNS - 2)).col).toBe(COLUMNS - 2);
    expect(moveRight(createGrid(), piece('T', 5, COLUMNS - 3)).col).toBe(COLUMNS - 3);
  });

  it('est bloqué par un bloc déjà posé', () => {
    const grille = createGrid();
    grille[5][5] = 'I';
    expect(moveRight(grille, piece('O', 5, 3)).col).toBe(3);
  });
});

describe('moveDown', () => {
  it('descend la pièce d\'un rang', () => {
    expect(moveDown(createGrid(), piece('T', 5, 3)).row).toBe(6);
  });

  it('est bloqué par le fond', () => {
    expect(moveDown(createGrid(), piece('O', ROWS - 2, 4)).row).toBe(ROWS - 2);
    expect(moveDown(createGrid(), piece('T', ROWS - 2, 3)).row).toBe(ROWS - 2);
  });

  it('est bloqué par un bloc déjà posé', () => {
    const grille = createGrid();
    grille[10][4] = 'I';
    expect(moveDown(grille, piece('O', 8, 4)).row).toBe(8);
  });
});

describe('canMoveDown', () => {
  it('est vrai au milieu d\'une grille vide', () => {
    expect(canMoveDown(createGrid(), piece('T', 5, 3))).toBe(true);
  });

  it('est faux contre le fond', () => {
    expect(canMoveDown(createGrid(), piece('O', ROWS - 2, 4))).toBe(false);
  });

  it('est faux au-dessus d\'un bloc posé', () => {
    const grille = createGrid();
    grille[10][4] = 'I';
    expect(canMoveDown(grille, piece('O', 8, 4))).toBe(false);
  });
});

describe('rotatePiece', () => {
  it('tourne la pièce sans changer sa position', () => {
    const resultat = rotatePiece(createGrid(), piece('T', 5, 3));
    expect(resultat.shape).toEqual(rotate(getShape('T')));
    expect(resultat.row).toBe(5);
    expect(resultat.col).toBe(3);
  });

  it('refuse la rotation si elle touche un bloc posé', () => {
    const grille = createGrid();
    grille[7][4] = 'I';
    const resultat = rotatePiece(grille, piece('T', 5, 3));
    expect(resultat.shape).toEqual(getShape('T'));
  });

  it('refuse la rotation si la pièce sortirait par le bas', () => {
    const resultat = rotatePiece(createGrid(), piece('I', 18, 3));
    expect(resultat.shape).toEqual(getShape('I'));
  });

  it('ne modifie pas la pièce d\'origine', () => {
    const originale = piece('T', 5, 3);
    rotatePiece(createGrid(), originale);
    expect(originale.shape).toEqual(getShape('T'));
  });
});

describe('hardDrop', () => {
  it('fait tomber la pièce O jusqu\'au fond', () => {
    expect(hardDrop(createGrid(), piece('O', 0, 4)).row).toBe(ROWS - 2);
  });

  it('s\'arrête sur la pile de blocs', () => {
    const grille = createGrid();
    grille[19][4] = 'I';
    expect(hardDrop(grille, piece('O', 0, 4)).row).toBe(17);
  });

  it('tient compte de la ligne vide du bas de la matrice (pièce T)', () => {
    expect(hardDrop(createGrid(), piece('T', 0, 3)).row).toBe(18);
  });

  it('ne change pas la colonne', () => {
    expect(hardDrop(createGrid(), piece('O', 0, 4)).col).toBe(4);
  });

  it('ne bouge pas si la pièce est déjà posée', () => {
    expect(hardDrop(createGrid(), piece('O', ROWS - 2, 4)).row).toBe(ROWS - 2);
  });
});