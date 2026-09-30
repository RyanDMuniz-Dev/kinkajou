# Kinkajou

> A lightweight CLI for creating web projects from reusable templates.

Kinkajou is a TypeScript CLI designed to simplify the initial setup of web projects.

It can generate projects from predefined templates, operate interactively, install dependencies automatically, choose between different package managers, and persist user preferences through a global configuration file.

The project is built with a focus on **clean architecture, type safety, extensibility, and a small dependency footprint**.

## ✨ Features

* Create projects from predefined templates
* Interactive project creation
* Recursive template rendering
* Project name validation
* `{{PROJECT_NAME}}` template variable replacement
* Automatic dependency installation
* Package manager selection
* Persistent global configuration
* Built-in `--help` and `--version`
* TypeScript with strict type checking
* No runtime dependencies

## 🚀 Quick Start

### Create a project

```bash
kajo new MeuSite
```

By default, Kinkajou uses the `none` template.

### Create a Vite + TypeScript project

```bash
kajo new MeuSite --template vite-ts
```

### Create a project and install dependencies

```bash
kajo new MeuSite --template vite-ts --install
```

### Choose a package manager

```bash
kajo new MeuSite --template vite-ts --install --pm pnpm
```

Supported package managers:

* `pnpm`
* `npm`
* `yarn`
* `bun`

## 🧭 Interactive Mode

Kinkajou can guide you through project creation:

```bash
kajo new
```

The interactive flow asks for:

1. Project name
2. Template
3. Whether dependencies should be installed
4. Package manager, when installation is enabled

The configured package manager is used as the default when one is available.

## 📦 Templates

Kinkajou currently provides two templates:

| Template  | Description                   |
| --------- | ----------------------------- |
| `none`    | Pure HTML, CSS and JavaScript |
| `vite-ts` | Vite + TypeScript             |

### Plain web project

```bash
kajo new MeuSite --template none
```

### Vite + TypeScript

```bash
kajo new MeuApp --template vite-ts
```

Templates are rendered recursively, allowing directories and nested files to be reproduced inside the generated project.

Template files can also use the following variable:

```text
{{PROJECT_NAME}}
```

Kinkajou replaces it with the generated project's name.

## ⚙️ Configuration

Kinkajou supports persistent user configuration.

Set the default package manager:

```bash
kajo config set manager pnpm
```

Read the configured manager:

```bash
kajo config get manager
```

List the current configuration:

```bash
kajo config list
```

When `--pm` is provided, it takes precedence over the configured value.

For example:

```bash
kajo config set manager pnpm
```

allows:

```bash
kajo new MeuSite --template vite-ts --install
```

to use `pnpm` automatically.

## 🖥️ CLI Reference

### `new`

Create a new project.

```bash
kajo new <project>
```

Options:

```text
--template <name>    Select a project template
--install            Install project dependencies
--pm <manager>       Select the package manager
```

Examples:

```bash
kajo new MeuSite
kajo new MeuSite --template vite-ts
kajo new MeuSite --template vite-ts --install
kajo new MeuSite --template vite-ts --install --pm npm
```

Interactive mode:

```bash
kajo new
```

### `config`

Manage persistent Kinkajou configuration.

```bash
kajo config set manager pnpm
kajo config get manager
kajo config list
```

### `help`

Display the CLI help:

```bash
kajo --help
```

or:

```bash
kajo help
```

### `version`

Display the installed Kinkajou version:

```bash
kajo --version
```

or:

```bash
kajo version
```

## 🏗️ Architecture

Kinkajou is organized into focused modules, keeping responsibilities separated:

```text
src/
├── cli/
│   ├── index.ts
│   ├── interactive-cli.ts
│   ├── config-cli.ts
│   ├── help.ts
│   └── version.ts
│
├── project/
│   ├── project-generator.ts
│   ├── project-validator.ts
│   ├── template-manager.ts
│   └── template-renderer.ts
│
├── package-manager/
│   └── package-manager.ts
│
├── system/
│   └── process-runner.ts
│
└── config/
    ├── config-manager.ts
    ├── config-types.ts
    └── config-resolver.ts
```

### CLI

Responsible for argument parsing, command dispatching, interactive input, help, version information, and configuration commands.

### Project

Responsible for project validation, template management, template rendering, and project generation.

### Package Manager

Provides an abstraction over supported package managers, allowing Kinkajou to install dependencies without coupling the rest of the application to a specific tool.

### System

Contains lower-level system integrations, such as running external processes.

### Configuration

Handles persistent user configuration and resolves values between explicit CLI options and configured defaults.

This separation allows new features to be added without concentrating the CLI's entire implementation in a single file.

## 🛠️ Development

### Requirements

* Node.js
* pnpm

Clone the repository and install dependencies:

```bash
pnpm install
```

Build the project:

```bash
pnpm run build
```

The compiled CLI is generated in:

```text
dist/
```

### Run the CLI locally

After building:

```bash
pnpm exec node dist/cli/index.js --help
```

You can also install the current local project globally with pnpm:

```bash
pnpm add -g .
```

Then use:

```bash
kajo --help
```

## 🔍 Type Safety

Kinkajou uses TypeScript with strict compiler checks enabled.

The project explicitly enables options such as:

```json
{
  "strict": true,
  "noImplicitAny": true,
  "forceConsistentCasingInFileNames": true
}
```

The goal is to catch incorrect assumptions during development rather than allowing them to reach runtime.

## 🗺️ Roadmap

### v0.7.0

* [x] Project generation
* [x] Template system
* [x] Vite + TypeScript template
* [x] Interactive project creation
* [x] Project name validation
* [x] Dependency installation
* [x] Package manager selection
* [x] Persistent configuration
* [x] Help and version commands
* [x] Type-safe CLI architecture

### Future

Possible future directions include:

* Automated test suite
* More built-in templates
* Additional project generators
* Project-aware commands
* Page and component generation
* Router and layout integration
* Extensible template/plugin systems
* npm publication and distribution improvements

The roadmap is intentionally open-ended as the project evolves.

## 📄 License

This project is licensed under the MIT License.
