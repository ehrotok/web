/**
 * ローディングを伴う処理を実行するためのユーティリティ関数
 *
 * @param proc - 実行する非同期処理関数
 * @returns 実行結果を返す Promise
 */
const useWait = async <T>(proc: () => Promise<T>): Promise<T> => {
  const loader: Ref<boolean> = useLoader();
  loader.value = true;
  try {
    return await proc();
  } finally {
    loader.value = false;
  }
};

export { useWait };
