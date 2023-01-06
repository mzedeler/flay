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

type SetState = Record<string, PathEntry>

async function* validate(dir: string): AsyncGenerator<Violation> {
  const iterator = traverse(dir)
  const indexFiles: Set<PathEntry> = new Set()
  const compoundDirectories: Set<PathEntry> = new Set()

  const indexFilesReducer = (state: Record<string, PathEntry>, pathEntry: PathEntry): Record<string, PathEntry> =>
    pathEntry.dirent.isFile() && pathEntry.dirent.name.match(/^index.tsx?$/)
      ? { [pathEntry.path]: pathEntry, ...state }
      : state

  const compoundDirectoriesReducer = (state: Record<string, PathEntry>, pathEntry: PathEntry): Record<string, PathEntry> =>
  pathEntry.dirent.isDirectory() && pathEntry.dirent.name.match(/[A-Z]/)
    ? { [pathEntry.path]: pathEntry, ...state }
    : state

  const reduce = ({ indexFiles, compoundDirectories }: { indexFiles: SetState, compoundDirectories: SetState }, pathEntry: PathEntry) => ({
    indexFiles: indexFilesReducer(indexFiles, pathEntry),
    compoundDirectories: compoundDirectoriesReducer(compoundDirectories, pathEntry)
  })

  let state = { indexFiles: {}, compoundDirectories: {} }
  for await (const pathEntry of iterator) {
    if (pathEntry.dirent.isFile() && pathEntry.dirent.name.match(/^index.tsx?$/) {
      indexFiles.add(pathEntry)
    }

    if (pathEntry.dirent.isDirectory() && pathEntry.dirent.name.match(/[A-Z]/)) {
      compoundDirectories.add(pathEntry
    }
    state = reduce(state, pathEntry)
  }
  
  console.log(state)
}

async function main() {
  for await (const x of await validate('/home/mike/workspace/pro/app/javascript')) {
    console.log(x)
  }
}

main()

// type CompoundCheckEntry = PathEntry & { hasIndex: boolean }

    // const compoundHasIndex = () => {
  //   // const hasIndex = Record<string, true>
  //   let compoundPathEntries: Record<string, CompoundCheckEntry> = {}
  //   let queue: string[] = []

  //   return (pathEntry: PathEntry | void): Violation | void => {
  //     if (pathEntry) {
  //       console.log(pathEntry.path)
  //       if (pathEntry.dirent.isDirectory()) {
  //         while (queue.length && queue[0] < pathEntry.path && !pathEntry.path.startsWith(queue[0])) {
  //           const path = queue.shift()
  //           const compoundPathEntry = compoundPathEntries[path as string]
  //           if (!compoundPathEntry.hasIndex) {
  //             return {
  //               message: 'Compound directory is missing an index file',
  //               pathEntries: [compoundPathEntry]
  //             }
  //           }
  //         }
  //         if (pathEntry.dirent.name.match(/[A-Z]/)) {
  //           compoundPathEntries[pathEntry.path] = {
  //             ...pathEntry,
  //             hasIndex: false
  //           }
  //           queue.push(pathEntry.path)
  //         }
  //       }

  //       if (pathEntry.dirent.name.match(/^index.tsx?$/)) {
  //         const directory = dirname(pathEntry.path)
  //         console.log('set index for ', directory)
  //         compoundPathEntries[directory].hasIndex = true
  //         // hasIndex[directory] = true
  //       }
  //     }
  //   }
  // }

  // const v = compoundHasIndex()
