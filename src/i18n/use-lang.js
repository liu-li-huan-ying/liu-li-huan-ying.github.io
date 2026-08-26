import { useContext } from 'react'
import { LangContext } from './context'

export function useLang() {
  return useContext(LangContext)
}
