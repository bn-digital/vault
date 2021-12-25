declare namespace Vault {
  type AuthProviders = 'github'
}

declare namespace Cli {

  type Args = {
    endpoint?: string
    token?: string
    dist?: string
    file?: string
    provider?: Vault.AuthProviders
  }
}
