# web

App Next.js 15 (App Router) del monorepo. Ver el `README.md` de la raíz para
comandos, estructura completa, variables de entorno y despliegue en Vercel.

```bash
pnpm --filter web dev
pnpm --filter web build   # corre check-env como prebuild — ver packages/config/README.md
pnpm --filter web lint
pnpm --filter web typecheck
```

`src/app/**` y `src/components/**` están **congelados** durante la migración
a monorepo: no se editan hasta el rediseño. `src/lib/` y `src/content/`
son en su mayoría adaptadores legacy sobre los paquetes `@site/*` (ver
"Adaptadores legacy" en el README raíz); el contenido real vive en
`@site/content`, no aquí.
