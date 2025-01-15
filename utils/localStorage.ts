/**
 * ローカルストレージに関するユーティリティ
 */
export const localStorageUtil = {
  /**
   * Tをpush
   * @param key
   * @param duplicateCheckKey
   * @param items
   */
  push: async <T>({
    key,
    duplicateCheckKey,
    items,
  }: {
    key: string;
    duplicateCheckKey?: string;
    items: T[];
  }): Promise<T[]> => {
    const storage: T[] = [];
    const data = localStorage.getItem(key);
    if (data) {
      storage.push(...JSON.parse(data));
    }

    for (const item of items) {
      if (
        duplicateCheckKey &&
        typeof item === "object" &&
        item !== null &&
        duplicateCheckKey in item
      ) {
        const value = (item as { [key: string]: string })[duplicateCheckKey];
        if (data?.includes(value)) {
          continue;
        }
      } else if (data?.includes(JSON.stringify(item))) {
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
   * @param duplicateCheckKey
   * @param items
   */
  splice: async <T>({
    key,
    duplicateCheckKey,
    items,
  }: {
    key: string;
    duplicateCheckKey: string;
    items: T[];
  }): Promise<T[]> => {
    const storage: T[] = [];
    const data = localStorage.getItem(key);

    if (data) {
      storage.push(...JSON.parse(data));
    }

    for (const item of items) {
      // 指定されたキーで重複チェック
      const index = storage.findIndex(
        (v) =>
          typeof v === "object" &&
          v !== null &&
          duplicateCheckKey in v &&
          v[duplicateCheckKey as keyof T] ===
            item[duplicateCheckKey as keyof T],
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
  getItem: async <T>(key: string): Promise<T> => {
    const data = localStorage.getItem(key);
    if (data) {
      return Promise.resolve(JSON.parse(data) as T);
    }

    return Promise.resolve({} as T);
  },

  getItems: async <T>(key: string): Promise<T[]> => {
    const data = localStorage.getItem(key);
    if (data) {
      return Promise.resolve(JSON.parse(data) as T[]);
    }

    return Promise.resolve([]);
  },

  updateItem: async <T>(key: string, items: T): Promise<void> => {
    localStorage.setItem(key, JSON.stringify(items));
  },
};
