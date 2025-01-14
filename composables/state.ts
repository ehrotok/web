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
 * 全画面
 * @returns
 */
const useFullScreenMode = () =>
  useState<boolean>("fullScreenMode", () => false);

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

/**
 * ブックマーク情報
 * @returns
 */
const useBookmarkState = () => useState<VideoItem[]>("bookmarks", () => []);

export {
  useLoader,
  useLandscapeMode,
  useFullScreenMode,
  usePositionState,
  useAgeCheckState,
  useTokenState,
  useBookmarkState,
};
