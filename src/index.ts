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

type CompoundCheckEntry = PathEntry & { hasIndex: boolean }

async function* validate(dir: string): AsyncGenerator<Violation> {
  const iterator = traverse(dir)

  const indexFiles = (state: Record<string, PathEntry>, pathEntry: PathEntry): Record<string, PathEntry> =>
    pathEntry.dirent.isFile() && pathEntry.dirent.name.match(/^index.tsx?$/)
      ? { [pathEntry.path]: pathEntry, ...state }
      : state

  const compoundDirectories = (state: Record<string, PathEntry>, pathEntry: PathEntry): Record<string, PathEntry> =>
  pathEntry.dirent.isDirectory() && pathEntry.dirent.name.match(/[A-Z]/)
    ? { [pathEntry.path]: pathEntry, ...state }
    : state

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

  let indexFilesState = {}
  let compoundDirectoriesState = {}
  for await (const pathEntry of iterator) {
    indexFilesState = indexFiles(indexFilesState, pathEntry)
    compoundDirectoriesState = compoundDirectories(compoundDirectoriesState, pathEntry)
  }
  console.log({ indexFilesState, compoundDirectoriesState })
}

async function main() {
  for await (const x of await validate('/home/mike/workspace/pro/app/javascript')) {
    console.log(x)
  }
}

main()
