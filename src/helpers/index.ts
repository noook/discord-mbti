export function shuffle<T extends any[]>(array: readonly [...T]): { [I in keyof T]: T[number] } {
  const copy: T[] = [...array];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy as { [I in keyof T]: T[number] };
}
