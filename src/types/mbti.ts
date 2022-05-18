export type Dichotomy = 'I' | 'E' | 'S' | 'N' | 'T' | 'F' | 'P' | 'J';
export type DichotomyCouple = [Dichotomy, Dichotomy];

export const FRUIT_ACTIONS = ['🍉', '🥝', '🍒', '🍌', '🍎', '🍑', '🍇'] as const;
export type FruitAction = typeof FRUIT_ACTIONS[number];

export interface DichotomyRowCount {
  value: Dichotomy;
  count: number;
}

export const DICHOTOMY_COUPLES: [
  DichotomyCouple,
  DichotomyCouple,
  DichotomyCouple,
  DichotomyCouple,
] = [
  ['I', 'E'],
  ['N', 'S'],
  ['F', 'T'],
  ['J', 'P'],
];
