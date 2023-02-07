import { dirname } from 'node:path'

import { getCollections } from './getCollections'
import { getCompoundDirectories } from './getCompoundDirectories'
import { getIndexFiles } from './getIndexFiles'
import { getPathEntryMap } from './getPathEntryMap'

import type { Violation } from '../types/Violation'
import type { PathEntryMap } from '../types/PathEntryMap'

export async function* validate(dir: string): AsyncGenerator<Violation> {
    const pathEntryMap = await getPathEntryMap(dir)
    const indexFiles = await getIndexFiles(dir)
    const compoundDirectories = await getCompoundDirectories(dir)
    const collections = await getCollections(dir)

    const indexFileDirectoryPaths = Object.keys(indexFiles).map(dirname)

    const getCompoundDirectoriesWithoutIndexFiles = () => {
      const result = compoundDirectories
      for (const directory of indexFileDirectoryPaths) {
        delete result[directory]
      }
      return Object.values(result)
    }

    yield {
      title: 'Compound directories without index files',
      message: 'These compound directories are missing index files.',
      pathEntries: getCompoundDirectoriesWithoutIndexFiles()
    }

    const getCollectionsWithIndexFiles = () => {
      const result: PathEntryMap = {}
      for (const path of indexFileDirectoryPaths) {
        if (collections[path]) {
          result[path] = collections[path]
        }
      }
      return Object.values(result)
    }

    yield {
      title: 'Collections with index files',
      message: 'These collections have unexpected index files.',
      pathEntries: getCollectionsWithIndexFiles()
    }
  }