import { opendir } from 'node:fs/promises'
import { join, dirname } from 'node:path'

import type { Dirent } from 'node:fs'

type PathEntry = {
  dirent: Dirent
  path: string
}

async function* traverse(dir: string): AsyncGenerator<PathEntry> {
  const dh = await opendir(dir)
  for await (const dirent of dh) {
    yield {
      path: join(dir, dirent.name),
      dirent
    }
    if (dirent.isDirectory()) {
      for await (const x of await traverse(join(dir, dirent.name))) {
        yield x
      }
    }
  }
}

type Violation = {
  pathEntries: PathEntry[]
  message: string
}

type PathEntryMap = Record<string, PathEntry>

async function* validate(dir: string): AsyncGenerator<Violation> {
  const indexFiles: PathEntryMap = {}
  const compoundDirectories: PathEntryMap = {}
  const collections: PathEntryMap = {}

  for await (const pathEntry of traverse(dir)) {
    if (pathEntry.dirent.isFile() && pathEntry.dirent.name.match(/^index.tsx?$/)) {
      indexFiles[pathEntry.path] = pathEntry
    } else if (pathEntry.dirent.isDirectory()) {
      if (pathEntry.dirent.name.match(/[A-Z]/)) {
        compoundDirectories[pathEntry.path] = pathEntry
      } else {
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
