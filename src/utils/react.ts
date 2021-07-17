export const concatClass = (...args: (string | boolean | undefined)[]) =>
  args.filter(v => typeof v !== 'undefined' && v !== false).join(' ')
