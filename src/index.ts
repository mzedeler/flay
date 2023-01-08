import chalk from 'chalk'
import { dirname } from 'node:path'

import type { PathEntry } from './types/PathEntry'

import { getPathEntryMap } from './utils/getPathEntryMap'
import { getIndexFiles } from './utils/getIndexFiles'
import { getCompoundDirectories } from './utils/getCompoundDirectories'
import { getCollections } from './utils/getCollections'

type Violation = {
  pathEntries: PathEntry[]
  title: string
  message: string
}

type PathEntryMap = Record<string, PathEntry>

async function* validate(dir: string): AsyncGenerator<Violation> {
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

async function main() {
  let failed

  const indent = (message: string) => message.replace(new RegExp('^', 'g'), '  ')

  for await (const violation of await validate('/home/mike/workspace/pro/app/javascript')) {
    if (!failed) {
      failed = true
      console.log('')
      console.log(chalk.red(chalk.inverse(' FAIL ')))
    }
    console.log('')
    console.log(indent(chalk.bold(violation.title)))
    console.log(indent(chalk.yellow(violation.message)))
    console.log('')
    violation.pathEntries.forEach(pathEntry => console.log(indent(pathEntry.path)))
    console.log('')
  }

  if (failed) {
    process.exit(-1)
  }
}

main()
