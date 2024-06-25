'use client'

import { createContext, useState } from 'react'
import type { AppContextValues, ChildrenInterface } from '@/interfaces/general'

export const DEFAULT_APP_CONTEXT_VALUES: AppContextValues = {
  currentUrl:'https://localhost',
  setCurrentUrl: () => {}
}


export const AppContext = createContext<AppContextValues>(DEFAULT_APP_CONTEXT_VALUES)

export default function AppProvider ({ children }: ChildrenInterface) {
  const [currentUrl, setCurrentUrl] = useState<string>('https://localhost')

  return (
    <AppContext.Provider value={{
      currentUrl,
      setCurrentUrl
    }}
    >
      {children}
    </AppContext.Provider>
  )
}