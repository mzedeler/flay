import { getPathEntryMap } from './getPathEntryMap'

import type { PathEntry } from '../types/PathEntry'
import type { PathEntryMap } from '../types/PathEntryMap'

export const getIndexFiles = async (dir: string): Promise<PathEntryMap> => {
  const pathEntryMap = await getPathEntryMap(dir)
  const result: PathEntryMap = {}
  for (const [path, pathEntry] of Object.entries<PathEntry>(pathEntryMap)) {
    if (pathEntry.dirent.isFile() && pathEntry.dirent.name.match(/^index.tsx?$/)) {
      result[pathEntry.path] = pathEntry
    }
  }

  return result
}
