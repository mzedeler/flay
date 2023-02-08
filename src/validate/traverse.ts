import { opendir } from 'node:fs/promises'
import { join } from 'node:path'

import type { PathEntry } from '../types/PathEntry'

export async function* traverse(dir: string): AsyncGenerator<PathEntry> {
  const dh = await opendir(dir)
  for await (const dirent of dh) {
    if (dirent.isDirectory() && dirent.name === 'node_modules') {
      continue
    }
    yield {
      path: join(dir, dirent.name),
      dirent
    }
    if (dirent.isDirectory()) {
      for await (const pathEntry of await traverse(join(dir, dirent.name))) {
        yield pathEntry
      }
    }
  }
}
