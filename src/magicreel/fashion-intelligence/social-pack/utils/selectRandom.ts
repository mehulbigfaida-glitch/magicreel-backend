export function selectRandom<T>(
  values: T[],
  count: number
): T[] {
  const shuffled = [...values].sort(
    () => 0.5 - Math.random()
  );

  return shuffled.slice(0, count);
}
