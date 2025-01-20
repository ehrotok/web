export const formatUtil = {
  replace: (value: string, ...args: unknown[]) => {
    let result = ''
    for (const [i, arg] of args.entries()) {
      const regExp = new RegExp(`\\{${i}\\}`, 'g')
      result = value.replace(regExp, arg as string)
    }
    return result
  },
}
