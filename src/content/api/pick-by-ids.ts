/**
 * Resolve an ordered id list against a resource list: keeps the order of
 * `ids` and silently skips ids that do not exist, so a dangling reference
 * from the backend hides one item instead of crashing a section.
 */
export function pickByIds<T extends { id: string }>(
  ids: readonly string[],
  items: readonly T[],
): T[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  return ids.flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });
}
