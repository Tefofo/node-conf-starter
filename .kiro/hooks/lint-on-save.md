# Hook: Lint on Save

## Trigger
- on: file_save
- pattern: "**/*.{ts,tsx}"

## Action
Run ESLint on the saved file to catch issues early.

```bash
npx eslint --fix {{filePath}}
```
