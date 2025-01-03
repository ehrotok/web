/**
 * ローカルストレージに関するユーティリティ
 */
export const localStorageUtil = {
  /**
   * Tをpush
   * @param key
   * @param ids
   */
  push: <T>(key: string, ...items: T[]): T[] => {
    const storage: T[] = [];
    const data = localStorage.getItem(key);
    if (data) {
      storage.push(...JSON.parse(data));
    }

    for (const item of items) {
      if (data?.includes(JSON.stringify(item))) {
        continue;
      }

      storage.push(item);
    }

    localStorage.setItem(key, JSON.stringify(storage));
    return storage;
  },
  /**
   * Tをsplice
   * @param key
   * @param ids
   */
  splice: <T>(key: string, ...items: T[]): T[] => {
    const storage: T[] = [];
    const data = localStorage.getItem(key);
    if (data) {
      storage.push(...JSON.parse(data));
    }

    for (const item of items) {
      const index = storage.findIndex(
        (v) => JSON.stringify(v) === JSON.stringify(item)
      );
      if (index !== -1) {
        storage.splice(index, 1);
      }
    }

    localStorage.setItem(key, JSON.stringify(storage));
    return storage;
  },
  /**
   * keyのデータを取得する
   *
   * @param items
   */
  getItem: <T>(key: string) => {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data) as T[];
    }

    return [];
  },
};
