import { opendir } from 'node:fs/promises'
import { join, dirname } from 'node:path'

import type { PathEntry } from '../types/PathEntry'

import { traverse } from './traverse'

type PathEntryMap = Record<string, PathEntry>

let cache: PathEntryMap | undefined
export const getPathEntryMap = async (dir: string): Promise<PathEntryMap> => {
  if (!cache) {
    cache = {}
    for await (const pathEntry of traverse(dir)) {
      cache[pathEntry.path] = pathEntry
    }
  }

  return cache
}
