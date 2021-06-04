# Vault .env

Populates .env file with values, provided by Hashicorp's Vault

## Usage

### CLI

1. Install package

```shell
yarn add vault-env
```
2. Create template file with key=value structure, where `key` - desired environment variable name, and value - full variable path in Vault

Example: 

```dotenv
MAILGUN_API_KEY=staging/mailgun/mg-bndigital-dev/api-key
MAILGUN_DOMAIN=staging/mailgun/mg-bndigital-dev/domain
MAILGUN_PUBLIC_KEY=staging/mailgun/mg-bndigital-dev/public-key
S3_SECRET_ACCESS_KEY=staging/digitalocean/spaces/secret-access-key
S3_ACCESS_KEY_ID=staging/digitalocean/spaces/access-key-id
DATABASE_PASSWORD=staging/postgresql/database-password
```

3. Execute command to generate .env file

```shell
yarn vault-env -e https://vault.company.com -t $GITHUB_TOKEN -d .env.dist -f .env.dev
```

### Github Action

```yaml
name: Vault
on:
  - push
jobs:
  env:
    name: Dump .env
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout sources
        uses: actions/checkout@v2

      - name: Populate .env
        uses: bn-digital/vault-env@latest
        with:
          endpoint: ${{ secrets.VAULT_ENDPOINT }}
          token: ${{ secrets.GITHUB_TOKEN }}
          template: .env.dist
          target: .env

```
