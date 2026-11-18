export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

// 1 = carré plein, 0 = case vide
export type Shape = number[][];

export const PIECE_TYPES: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

const SHAPES: Record<PieceType, Shape> = {
    I: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    O: [
      [1, 1],
      [1, 1],
    ],
    T: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    S: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    Z: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    J: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    L: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
  };
  
  export function getShape(type: PieceType): Shape {
    return SHAPES[type].map((ligne) => [...ligne]);
  }

  export function rotate(shape: Shape): Shape {
    const n = shape.length;
    const resultat: Shape = [];
  
    for (let ligne = 0; ligne < n; ligne++) {
      const nouvelleLigne: number[] = [];
      for (let colonne = 0; colonne < n; colonne++) {
        nouvelleLigne.push(shape[n -1 -colonne][ligne]);
      }
      resultat.push(nouvelleLigne);
    }
  
    return resultat;
  }