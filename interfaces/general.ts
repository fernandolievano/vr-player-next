import { Dispatch, SetStateAction } from 'react'

export interface ChildrenInterface {
  children: React.ReactNode
}

export interface AppContextValues {
  currentUrl: string
  setCurrentUrl: Dispatch<SetStateAction<string>>
}
