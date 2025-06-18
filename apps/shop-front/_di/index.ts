// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type FirstArg<F> = F extends (first: infer T, ...rest: any[]) => any ? T : never;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type RestArgs<F> = F extends (first: any, ...rest: infer R) => any ? R : never;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function withRepo<T extends (...args: any[]) => ReturnType<T>>(
  useCaseFn: T,
  repoArg: FirstArg<T>
): (...remainingArgs: RestArgs<T>) => ReturnType<T> {
  return (...remainingArgs: RestArgs<T>) => {
    return useCaseFn(repoArg, ...remainingArgs)
  }
}
