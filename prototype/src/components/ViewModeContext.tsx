import { createContext, useContext, useState, type ReactNode } from 'react'

/**
 * ViewMode — global toggle для distribution-значений.
 *   'count' → 58   (число новинок)
 *   'pct'   → 12%  (доля от total)
 *
 * Переключается капсулой в hero top-strip (ViewModeToggle). По default —
 * 'count' (как на оригинальной странице). Hero-метрики и YoY-дельты не
 * реагируют на mode — они и так либо totals, либо уже проценты.
 */

export type ViewMode = 'count' | 'pct'

type Ctx = {
  mode: ViewMode
  setMode: (m: ViewMode) => void
}

const ViewModeCtx = createContext<Ctx>({ mode: 'count', setMode: () => {} })

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ViewMode>('count')
  return <ViewModeCtx.Provider value={{ mode, setMode }}>{children}</ViewModeCtx.Provider>
}

export function useViewMode() {
  return useContext(ViewModeCtx)
}
