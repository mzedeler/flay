import type { Dirent } from 'node:fs'

export type PathEntry = {
  dirent: Dirent
  path: string
}
