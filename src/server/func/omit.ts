export function omit<T, K extends keyof T>(keys: K[], obj: T): Omit<T, K> {
  const omittedKeysSet = new Set<K>(keys);
  const result: any = {};

  for (const key in obj) {
    //@ts-ignore
    if (!omittedKeysSet.has(key)) {
      result[key] = obj[key];
    }
  }

  return result;
}
