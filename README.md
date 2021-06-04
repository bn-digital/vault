# Vault .env

Populates .env file with values, provided by Hashicorp's Vault

## Workflow example


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
