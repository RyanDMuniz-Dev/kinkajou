export function showHelp(): void {
    console.log(`
Kinkajou CLI

Usage:
  kajo <command> [options]

Commands:
  new <project>       Create a new project
  config              Manage Kinkajou configuration
  help                Show this help message
  version             Show the Kinkajou version

Options:
  -h, --help          Show this help message
  -v, --version       Show the Kinkajou version

Examples:
  kajo new MeuSite
  kajo new MeuSite --template vite-ts
  kajo new MeuSite --template vite-ts --install
  kajo new MeuSite --template vite-ts --install --pm pnpm

Configuration:
  kajo config set manager pnpm
  kajo config get manager
  kajo config list
`);
}