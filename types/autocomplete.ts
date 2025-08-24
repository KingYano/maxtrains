import type { Station } from './station'

export interface StationAutocompleteProps {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  class?: string | string[] | Record<string, boolean>
}

export interface StationAutocompleteEmits {
  'update:modelValue': [value: string]
  'stationSelected': [station: Station]
}

export interface SearchHistoryEmits {
  selectHistory: [search: import('./tgvmax').SearchParams]
}