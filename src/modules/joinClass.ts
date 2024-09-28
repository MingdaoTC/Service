export function joinClass(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
