import { Command } from 'commander'
import VaultEnv, { CommandLineArgs } from './index'
import { config } from 'dotenv'

config()

const program = new Command()

program
  .option('-e, --endpoint [endpoint]', 'Vault endpoint, e.g. https://vault.your-company.com. Default is $VAULT_ENDPOINT env variable')
  .option(
    '-t, --token [token]',
    'Authentication token used by Vault to auth with specified provider. Default is $GITHUB_TOKEN env variable'
  )
  .option('-p, --provider [provider]', 'Authentication provider (currently supported: github)', 'github')
  .option('-d, --dist [dist]', 'Dotenv template file in project root to read key=value pairs from', '.env.dist')
  .option('-f, --file [file]', 'Dotenv file in project root to write into', '.env')
  .parse(process.argv)

program.parse()

const { endpoint, token, provider, file, dist } = program.opts() as CommandLineArgs

new VaultEnv(endpoint ?? process.env.VAULT_ENDPOINT, { token: token ?? process.env.GITHUB_TOKEN, provider }).populate(dist, file)
