import { getInput, info, setFailed, setSecret } from '@actions/core'
import path from 'path'
import VaultEnv from './index'
import { createHash } from 'crypto'
import * as crypto from 'crypto'

/**
 * Executes as Github Action entrypoint
 */
async function run(): Promise<void> {
  const workspaceDir = process.env.GITHUB_WORKSPACE
  try {
    const vaultEnv = new VaultEnv(getInput('endpoint'), {
      provider: getInput('provider'),
      token: getInput('token') ?? process.env.GITHUB_TOKEN,
    })
    const values = vaultEnv.populate(path.resolve(workspaceDir, getInput('template')), path.resolve(workspaceDir, getInput('target')))

    Object.entries(values).map(([key, value]) =>
      info(`Created entry ${key} with hashed value ${crypto.createHash('sha256').update(value).digest()}`)
    )
  } catch (error) {
    setFailed(error.message)
  }
}

run().catch(console.error)
