import { Command } from 'commander'
import VaultEnv from './index'
import { config } from 'dotenv'
import path from 'path'
import { blue, green, red } from 'chalk'
import fs from 'fs'
import os from 'os'

config()
if (fs.existsSync(path.join(os.homedir(), '.env'))) {
  config({ path: path.join(os.homedir(), '.env') })
}
const program = new Command()

program
  .option('-e, --endpoint [endpoint]', 'Vault endpoint, e.g. https://vault.your-company.com. Default is $VAULT_ENDPOINT env variable', process.env.VAULT_ENDPOINT)
  .option('-t, --token [token]', 'Authentication token used by Vault to auth with specified provider. Default is $GITHUB_TOKEN env variable', process.env.GITHUB_TOKEN)
  .option('-p, --provider [provider]', 'Authentication provider (currently supported: github)', 'github')
  .option('-d, --dist [dist]', 'Dotenv template file in project root to read key=value pairs from', path.join(process.cwd(), `.env.${process.env.APP_ENV ?? 'dist'}`))
  .option('-f, --file [file]', 'Dotenv file in project root to write into', path.join(process.cwd(), '.env'))
  .parse(process.argv)

program.parse()

const { endpoint, token, provider, file, dist } = program.opts<Cli.Args>()
const scopes: string[][] = [['repo', '*'], ['write:packages', '*'], ['admin:org', 'read'], ['user', '*'], ['gist', '*']]
const formattedScopes = scopes.map(([scope, permissions]) => [green(scope), blue(permissions)].join(':')).join(',')

if (endpoint && token) {
  const url = new URL(endpoint)
  new VaultEnv(`${url.protocol}//${url.host}`, { token, provider }).populate(dist, file)
} else {
  if (!token) {
    console.error(`${red('No Github token found in env variables')}.\nGenerate token here https://github.com/settings/tokens with scopes: ${formattedScopes} and place into .env file or set globally.\n`)
  }
  if (!endpoint) {
    console.error(`${red('No Vault endpoint found in env variables')}.\nPlace value of endpoint (e.g. ${blue('https://vault.domain.com')}) into .env file or set globally.\n`)
  }
  process.exit(1)
}
