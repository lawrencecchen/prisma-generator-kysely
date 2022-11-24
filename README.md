# Kysely Prisma Generator

Manage your schema with Prisma and generate types for Kysely.

## Installation

```bash
npm install prisma-generator-kysely

pnpm add prisma-generator-kysely

yarn add prisma-generator-kysely
```

## Usage

```prisma
generator kysely {
  provider = "npx prisma-generator-kysely"
  output   = "./types"
}
```
