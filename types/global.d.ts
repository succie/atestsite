// Microsoft Clarity
interface ClarityFunction {
  (method: 'event', eventName: string, data?: Record<string, unknown>): void
  (method: 'set', key: string, value: string): void
}

// Global window extensions
declare global {
  interface Window {
    clarity?: ClarityFunction
    _mfq?: unknown[]
  }
}

// Nuxt Context types
interface NuxtContext {
  $router: {
    push(path: string): void
  }
}

export {}