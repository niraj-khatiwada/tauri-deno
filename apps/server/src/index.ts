export function add(a: number, b: number): number {
  return a + b
}

// biome-ignore lint/suspicious/noConsole: <>
console.log('Add 2 + 3 =', add(2, 3))
