import { getInput, setFailed } from '@actions/core'
import path from 'path'
import VaultEnv from './index'

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
    vaultEnv.populate(path.resolve(workspaceDir, getInput('template')), path.resolve(workspaceDir, getInput('target')))
  } catch (error) {
    setFailed(error.message)
  }
}

run().catch(console.error)
