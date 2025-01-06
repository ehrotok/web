/**
 * ローディングを管理する状態
 * @returns
 */
export const useLoader = () => useState<boolean>("loader", () => false);

/**
 * 横画面か
 * @returns
 */
export const useLandscapeMode = () =>
  useState<boolean>("landscapeMode", () => false);

/**
 * 選択した位置
 * @returns
 */
export const usePositionState = () => useState<number>("position", () => 0);
