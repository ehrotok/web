/**
 * ローディングを管理する状態
 * @returns
 */
export const useLoader = () => useState<boolean>("loader", () => false);
