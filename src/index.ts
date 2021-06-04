import { config } from 'dotenv'
import NodeVault, { client } from 'node-vault'
import path from 'path'
import fs from 'fs'
import { OptionValues } from 'commander'
import { cyan, green, red, yellow } from 'chalk'

const log = console.log
export type AuthProviders = 'github'

export type CommandLineArgs = OptionValues & {
  endpoint?: string
  token?: string
  dist?: string
  file?: string
  auth?: AuthProviders
}

export default class VaultEnv {
  private readonly vault: client
  private readonly client: Promise<client>

  /**
   * @param endpoint
   * @param auth
   */
  constructor(endpoint: string, auth: { provider: string; token: string }) {
    this.vault = NodeVault({ endpoint: endpoint })

    if (auth.provider === 'github') {
      this.client = this.vault.githubLogin({ token: auth.token })
    }
  }

  /**
   * Writes fetched secret values to file, using template file with env variable keys and secret paths as values
   * @param from
   * @param to
   */
  populate(from: string, to: string): { [key: string]: string } {
    const distPath = path.resolve(from)
    const envPath = path.resolve(to)
    const values: { [key: string]: string } = {}
    if (fs.existsSync(envPath)) {
      Object.entries(config({ path: envPath }).parsed).forEach(([key, value]) => (values[key] = value))
    }
    fs.writeFileSync(envPath, '')
    if (distPath) {
      const template = config({ path: distPath }).parsed
      if (template) {
        Object.entries(template).forEach(([key, value]) => {
          log(`Setting ${cyan(key)} from ${green(value)}`)
          this.readSecret(value).then((secret) => {
            secret ? (values[key] = secret) : yellow(`Failed to fetch ${value}`)
          })
        })
      } else {
        log(red('No template provided'))
      }
      Object.entries(values)
        .sort(([keyA], [keyB]) => (keyA > keyB ? 1 : -1))
        .forEach(([key, secret]) => fs.appendFileSync(envPath, `${key}=${secret}\n`))
      return values
    } else {
      throw new Error(`No template file available at ${distPath}`)
    }
  }

  /**
   * Reads secret by provided complete path to secret, including name, e.g. staging/database/username, where "staging" is key-value path
   * @param path
   */
  private async readSecret(path: string): Promise<string> {
    const chunks = path.split('/')
    const root = chunks.shift()
    const searchKey = chunks.pop()
    chunks.unshift(root, 'data')
    const secretPath = chunks.join('/')
    return await this.client
      .then(() => this.vault.read(secretPath))
      .then((secret) => secret.data.data[searchKey])
      .catch(() => '')
  }
}
