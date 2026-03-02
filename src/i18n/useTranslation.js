import { useMemo } from 'react'
import { he } from './translations'

/**
 * Returns a translation function t(key, vars?) for the current locale.
 * Keys use dot notation, e.g. 'nav.home'. Use {{varName}} in translation strings for interpolation.
 */
export function useTranslation() {
  return useMemo(() => {
    const dict = he
    return function t(key, vars = {}) {
      let str = dict[key]
      if (str == null) return key
      Object.keys(vars).forEach((k) => {
        str = str.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(vars[k]))
      })
      return str
    }
  }, [])
}
