import { dirname } from 'node:path'

import type { PathEntry } from './types/PathEntry'

import { getPathEntryMap } from './utils/getPathEntryMap'
import { getIndexFiles } from './utils/getIndexFiles'
import { getCompoundDirectories } from './utils/getCompoundDirectories'

type Violation = {
  pathEntries: PathEntry[]
  message: string
}

type PathEntryMap = Record<string, PathEntry>

async function* validate(dir: string): AsyncGenerator<Violation> {
  const pathEntryMap = await getPathEntryMap(dir)
  const indexFiles = await getIndexFiles(dir)
  const compoundDirectories = await getCompoundDirectories(dir)
  const collections: PathEntryMap = {}

  for await (const pathEntry of Object.values(pathEntryMap)) {
    if (pathEntry.dirent.isDirectory()) {
      if (!pathEntry.dirent.name.match(/[A-Z]/)) {
        collections[pathEntry.path] = pathEntry
      }
    }
  }

  const indexFileDirectoryPaths = Object.keys(indexFiles).map(dirname)
  
  const compoundDirectoriesWithoutIndexFiles = compoundDirectories
  for (const directory of indexFileDirectoryPaths) {
    delete compoundDirectoriesWithoutIndexFiles[directory]
  }

  console.log(compoundDirectoriesWithoutIndexFiles)

  const collectionsWithIndexFiles: PathEntryMap = {}
  for (const path of indexFileDirectoryPaths) {
    if (collections[path]) {
      collectionsWithIndexFiles[path] = collections[path]
    }
  }

  console.log(collectionsWithIndexFiles)
}

async function main() {
  for await (const x of await validate('/home/mike/workspace/pro/app/javascript')) {
    console.log(x)
  }
}

main()

// admin

// const collections = `(
//   __mocks__
// |  __snapshots__
// |  __tests__
// |  actions
//   annotations
//   announcements
//   api
//   area
//   array
//   assets
//   categories
//   channels
//   common
//   components
//   config
//   consts
//   contexts
//   controllers
//   core
//   courses
//   da
//   data
//   device
//   document
//   documents
//   elements
//   en
//   entities
//   errors
//   experts
//   features
//   feedback
//   fonts
//   forms
//   helpers
//   hoc
//   hooks
//   icons
//   images
//   jobs
//   karnov-display
//   layouts
//   middlewares
//   mock
//   mocks
//   objects
//   onboarding
//   packs
//   pages
//   properties
//   redirects
//   reducers
//   redux
//   registry
//   roboto
//   segment
//   selectors
//   services
//   settings
//   store
//   styles
//   superhits
//   sv
//   svg
//   tailwind
//   test
//   tip
//   tools
//   translations
//   types
//   ui
//   utilities
//   utils
//   vendor
//   xml
// )`
