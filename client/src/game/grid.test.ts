import { describe, it, expect } from 'vitest';
import { COLUMNS, ROWS, createGrid, collides, lockPiece } from './grid';
import { getShape } from './pieces';

describe('createGrid', () => {
  it('crée une grille de 20 lignes et 10 colonnes', () => {
    const grille = createGrid();
    expect(grille).toHaveLength(ROWS);
    expect(grille.every((ligne) => ligne.length === COLUMNS)).toBe(true);
  });

  it('toutes les cases sont vides', () => {
    expect(createGrid().flat().every((c) => c === null)).toBe(true);
  });

  it('les lignes sont indépendantes', () => {
    const grille = createGrid();
    grille[0][0] = 'T';
    expect(grille[1][0]).toBeNull();
  });
});

describe('collides', () => {
  it('pas de collision au milieu d\'une grille vide', () => {
    expect(collides(createGrid(), getShape('T'), 5, 3)).toBe(false);
  });

  it('collision avec le mur de gauche', () => {
    expect(collides(createGrid(), getShape('O'), 0, -1)).toBe(true);
  });

  it('collision avec le mur de droite', () => {
    expect(collides(createGrid(), getShape('O'), 0, COLUMNS - 1)).toBe(true);
  });

  it('collision avec le fond', () => {
    expect(collides(createGrid(), getShape('O'), ROWS - 1, 0)).toBe(true);
  });

  it('pas de collision quand la pièce rentre pile contre le fond', () => {
    expect(collides(createGrid(), getShape('O'), ROWS - 2, 0)).toBe(false);
  });

  it('collision avec le haut de la grille', () => {
    expect(collides(createGrid(), getShape('O'), -1, 0)).toBe(true);
  });

  it('les cases vides de la matrice ne comptent pas', () => {
    // la 1re ligne de la matrice I est vide : elle peut sortir par le haut
    expect(collides(createGrid(), getShape('I'), -1, 0)).toBe(false);
  });

  it('collision avec un bloc déjà posé', () => {
    const grille = createGrid();
    grille[19][0] = 'I';
    expect(collides(grille, getShape('O'), 18, 0)).toBe(true);
  });

  it('pas de collision à côté d\'un bloc posé', () => {
    const grille = createGrid();
    grille[19][0] = 'I';
    expect(collides(grille, getShape('O'), 18, 1)).toBe(false);
  });
});

describe('lockPiece', () => {
  it('écrit les 4 carrés de la pièce dans la grille', () => {
    const resultat = lockPiece(createGrid(), getShape('O'), 'O', 18, 4);
    expect(resultat[18][4]).toBe('O');
    expect(resultat[18][5]).toBe('O');
    expect(resultat[19][4]).toBe('O');
    expect(resultat[19][5]).toBe('O');
    expect(resultat.flat().filter((c) => c !== null)).toHaveLength(4);
  });

  it('place la pièce T aux bons endroits', () => {
    const resultat = lockPiece(createGrid(), getShape('T'), 'T', 0, 3);
    expect(resultat[0][4]).toBe('T');
    expect(resultat[1][3]).toBe('T');
    expect(resultat[1][4]).toBe('T');
    expect(resultat[1][5]).toBe('T');
    expect(resultat.flat().filter((c) => c !== null)).toHaveLength(4);
  });

  it('garde les blocs déjà posés', () => {
    const grille = createGrid();
    grille[19][9] = 'L';
    const resultat = lockPiece(grille, getShape('O'), 'O', 18, 0);
    expect(resultat[19][9]).toBe('L');
  });

  it('ne modifie pas la grille d\'origine', () => {
    const grille = createGrid();
    lockPiece(grille, getShape('O'), 'O', 18, 4);
    expect(grille.flat().every((c) => c === null)).toBe(true);
  });
});