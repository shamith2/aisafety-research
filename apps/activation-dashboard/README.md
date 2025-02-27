# Activation Dashboard Setup Guide

## Overview

This guide explains how to set up and run the Activation Dashboard, a React TypeScript based application that visualizes and compares topk activitation patterns.

## Prerequisites

- Node.js
- npm

## Project Structure

```
activation-dashboard/
├── README.md
├── package.json
├── tsconfig.json
├── next.config.js
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── card.tsx
│   │       ├── index.tsx
│   │       ├── page.tsx
│   │       └── [...other UI components]
│
└── public/
```

## Project Creation Flow

1. Create a new Next.js project with TypeScript:

```bash
npx create-next-app@latest activation-dashboard --typescript --tailwind --eslint

✔ Would you like your code inside a `src/` directory? … No / [Yes]
✔ Would you like to use App Router? (recommended) … No / [Yes]
✔ Would you like to use Turbopack for `next dev`? … No / [Yes]
✔ Would you like to customize the import alias (`@/*` by default)? … [No] / Yes

cd activation-dashboard
rm -r -f .git
```

2. Setup Prettier with ESLint

```bash
npm install prettier eslint-config-prettier
```

[Configure `.prettierrc`](https://prettier.io/docs/configuration):

```json
{
    "trailingComma": "es5",
    "tabWidth": 4,
    "semi": false,
    "singleQuote": true
}
```

[Configure `.prettierignore`](https://prettier.io/docs/ignore):

```
# Ignore artifacts:
build
coverage

**/.git
**/.svn
**/.hg
**/node_modules
```

[Configure `eslint.config.mjs`](https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules)

```js
...
const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
]
...
```

3. Install required dependencies:

```bash
npm install recharts @radix-ui/react-slot @radix-ui/react-toast class-variance-authority clsx tailwind-merge lucide-react
```

4. Install shadcn/ui and add Card component:

```bash
npx shadcn@latest init

✔ Which style would you like to use? › New York
✔ Which color would you like to use as the base color? › Zinc
✔ Would you like to use CSS variables for theming? … no / [yes]

✔ How would you like to proceed? › Use --force

npx shadcn@latest add card
```

5. Rename `src/app/page.tsx` to `src/app/index.tsx` for future reference and Modify `src/app/page.tsx` with your `*.tsx` code

```bash
mv src/app/page.tsx src/app/index.tsx
[... modify src/app/page.tsx]
```

6. Configure `src/app/layout.tsx`:

```
export const metadata: Metadata = {
    title: 'Activation Dashboard',
    description: 'Activation Dashboard',
}
```

7. Format files with Prettier

```bash
npx prettier . --check
npx prettier . --write
```

## Running the Application

1. Start the development server:

```bash
npm run dev
```

2. Open http://localhost:3000 in your browser

## Building the Application

1. Build and Start the production server:

```bash
npm run build
npm run start
```

2. Open http://localhost:3000 in your browser

## File Upload Format

The application expects JSON files with the following structure:

```typescript
interface Token {
    token: string
    topk_neuron_activations: {
        neuron: string
        activation: number
    }[]
    topk_next_tokens: {
        [key: string]: number
    }[]
}
```

## Linting and Formatting

1. Uses ESLint for Linter and Prettier for Formatter:

    - Format based on config in `.prettierrc'
    - Tailwind CSS for Styling
