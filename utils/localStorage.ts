/**
 * ローカルストレージに関するユーティリティ
 */
export const localStorageUtil = {
  /**
   * Tをpush
   * @param key
   * @param items
   */
  push: async <T>(key: string, ...items: T[]): Promise<T[]> => {
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
    return Promise.resolve(storage);
  },

  /**
   * Tをsplice
   * @param key
   * @param items
   */
  splice: async <T>(key: string, ...items: T[]): Promise<T[]> => {
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
    return Promise.resolve(storage);
  },

  /**
   * keyのデータを取得する
   *
   * @param key
   */
  getItem: async <T>(key: string): Promise<T[]> => {
    const data = localStorage.getItem(key);
    if (data) {
      return Promise.resolve(JSON.parse(data) as T[]);
    }

    return Promise.resolve([]);
  },
};
