# Kinkajou

> A lightweight CLI for creating web projects from reusable templates.

[![Version](https://img.shields.io/badge/version-0.8.0-blue.svg)](https://github.com/SEU_USUARIO/kinkajou)
[![Tests](https://img.shields.io/badge/tests-64%20passed-brightgreen.svg)](https://github.com/SEU_USUARIO/kinkajou)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

Kinkajou is a TypeScript CLI designed to simplify the initial setup of web projects.

It can generate projects from predefined templates, operate interactively, install dependencies automatically, choose between different package managers, and persist user preferences through a global configuration file.

The project is built with a focus on **clean architecture, type safety, extensibility, and a small dependency footprint**.

> **Status:** Early development — v0.8.0

---

## ✨ Features

- Create projects from predefined templates
- Interactive project creation
- Recursive template rendering
- Project name validation
- `{{PROJECT_NAME}}` template variable replacement
- Automatic dependency installation
- Package manager selection
- Persistent global configuration
- Built-in `--help` and `--version`
- TypeScript with strict type checking
- No runtime dependencies

---

## 🚀 Quick Start

### Installation

Kinkajou is currently in early development and has not yet been published to npm.

To install the current version from source:

```bash
git clone https://github.com/SEU_USUARIO/kinkajou.git
cd kinkajou
pnpm install
pnpm run build
pnpm add -g .