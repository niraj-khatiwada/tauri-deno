/// <reference lib="deno.ns" />
/** biome-ignore-all lint/suspicious/noConsole: <> */

/**
 * Compile the packages/server to use as a sidecar in Tauri
 */
import path from 'node:path'

import packageJson from '../../../package.json' with { type: 'json' }
import denoJson from '../deno.json' with { type: 'json' }

const BINARY_NAME = `${packageJson.name}-sidecar`
const OUTDIR = path.join(import.meta.dirname!, '..', '..', '..', 'tauri', 'bin')

const OUTFILE = `${OUTDIR}/${BINARY_NAME}-{binary_postfix}`

async function main() {
  const binary_postfix = Deno.build.target
  const outfile = OUTFILE.replace('{binary_postfix}', binary_postfix)

  console.log(`\x1b[36mDetected:\x1b[0m ${binary_postfix}`)
  console.log(`\x1b[36mOutput binary:\x1b[0m ${outfile}`)

  console.log('\x1b[34mCompiling server with Deno...\x1b[0m')

  const permissions = denoJson.tasks['run:base']
    .slice('deno run'.length)
    .trim()
    .split(' ')

  const cmd = new Deno.Command('deno', {
    args: ['compile', ...permissions, '--output', outfile, 'src/index.ts'],
    stdout: 'inherit',
    stderr: 'inherit',
  })

  const { success } = await cmd.output()
  if (!success) {
    console.error('\x1b[31mBuild failed!\x1b[0m')
    Deno.exit(1)
  }

  console.log('\x1b[32mDone! Binary created at:\x1b[0m', outfile)
}

if (import.meta.main) {
  await main().catch((err) => {
    console.error('Build failed:', err)
    Deno.exit(1)
  })
}
