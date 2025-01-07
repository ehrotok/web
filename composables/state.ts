/**
 * ローディングを管理する状態
 * @returns
 */
const useLoader = () => useState<boolean>("loader", () => false);

/**
 * 横画面か
 * @returns
 */
const useLandscapeMode = () => useState<boolean>("landscapeMode", () => false);

/**
 * 選択した位置
 * @returns
 */
const usePositionState = () => useState<number>("position", () => 0);

/**
 * 年齢確認
 * @returns
 */
const useAgeCheckState = () => useState<boolean>("age_check", () => true);

/**
 * トークン
 * @returns
 */
const useTokenState = () => useState<string>("token", () => "");

export {
  useLoader,
  useLandscapeMode,
  usePositionState,
  useAgeCheckState,
  useTokenState,
};
