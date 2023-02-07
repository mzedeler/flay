import type { PathEntry } from './PathEntry'

export type Violation = {
  pathEntries: PathEntry[]
  title: string
  message: string
}
