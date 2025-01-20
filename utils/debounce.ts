export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId) // 既存のタイマーをクリア
    }
    timeoutId = setTimeout(() => {
      func(...args) // 指定時間後に関数を実行
    }, delay)
  }
}
