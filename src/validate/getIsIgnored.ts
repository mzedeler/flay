import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { getPathEntryMap } from './getPathEntryMap'

type IgnoreEntry = {
  path: string
  pattern: string
}

type IgnoreChecker = (path: string) => boolean

export const getIsIgnored = async (dir: string): Promise<IgnoreChecker> => {
  const pathEntryMap = await getPathEntryMap(dir)
  const ignoreFiles = Object
    .values(pathEntryMap)
    .filter(({ dirent: { name }}) => name === '.flayignore')
    .map(({ path }) => path)
  const ignorePatterns: string[] = []
  for (const ignoreFile of ignoreFiles) {
    const entries = (await readFile(ignoreFile))
      .toString('utf-8')
      .split(/[\r\n]+/)
      .map(s => s.trim())
      .filter(s => s.length)
      .map(pattern => join(dir, pattern))

      ignorePatterns.push(...entries)
  }
  return (path: string) => ignorePatterns.some(pattern => path === pattern)
}
