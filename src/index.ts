import chalk from 'chalk'

import { validate } from './validate/validate'

async function main() {
  let failed

  const indent = (message: string) => message.replace(new RegExp('^', 'g'), '  ')

  for await (const violation of await validate(process.argv[2])) {
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
