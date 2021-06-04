import { config } from 'dotenv'
import NodeVault, { client } from 'node-vault'
import path from 'path'
import fs from 'fs'
import { OptionValues } from 'commander'

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
  populate(from: string, to: string): void {
    const distPath = path.resolve(from)
    const envPath = path.resolve(to)
    fs.writeFileSync(envPath, '')

    if (distPath) {
      const template = config({ path: distPath }).parsed
      if (template) {
        Object.entries(template).forEach(([key, value]) => {
          console.log(`Setting ${key} from ${value}`)
          this.readSecret(value).then((secret) => fs.appendFile(envPath, `${key}=${secret}\n`, (error) => error && console.log(error)))
        })
      } else {
        console.warn('No template provided')
      }
    } else {
      throw new Error(`No template file available at ${distPath}`)
    }
  }

  /**
   * Reads secret by provided complete path to secret, including name, e.g. staging/database/username, where "staging" is key-value path
   * @param path
   */
  private async readSecret(path: string): Promise<string | void> {
    const chunks = path.split('/')
    const root = chunks.shift()
    const searchKey = chunks.pop()
    chunks.unshift(root, 'data')
    const secretPath = chunks.join('/')
    return await this.client
      .then(() => this.vault.read(secretPath))
      .then((secret) => secret.data.data[searchKey])
      .catch(console.log)
  }
}
