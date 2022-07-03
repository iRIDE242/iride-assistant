import { createContext, useContext } from 'react'

/**
 * Helper function to create context.
 * Will show error if content is out of context.
 */
export function createCtx(providerName, displayName) {
  const ctx = createContext(undefined)

  if (ctx && displayName) {
    ctx.displayName = displayName
  }

  function useCtx(componentName = 'Consumer components') {
    const c = useContext(ctx)
    if (c === undefined)
      throw new Error(
        `${componentName} must be inside ${providerName} with a value`
      )
    return c
  }
  return [useCtx, ctx.Provider]
}
