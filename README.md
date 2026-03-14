# Hotel de Alfombras Superclim

Sistema web profesional para gestion de almacenamiento de alfombras de clientes en Barcelona, construido con Next.js, TypeScript, Tailwind y Supabase.

## Estado actual

La aplicacion ya incluye:

- dashboard operativo inicial
- modulo de clientes
- modulo de localizaciones
- modulo de alfombras
- reglas simples de precio
- movimientos operativos
- recibo HTML imprimible

## Stack

- Next.js 16 App Router
- TypeScript estricto
- Tailwind CSS 4
- Supabase
- Zod

## Variables de entorno

Copia `.env.example` a `.env.local` y completa:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Notas:

- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` son obligatorias para la app.
- `SUPABASE_SERVICE_ROLE_KEY` queda preparada para futuras operaciones administrativas, aunque hoy no es imprescindible para el flujo principal.

## Desarrollo local

```bash
npm install
copy .env.example .env.local
npm run dev
```

App local:

- `http://localhost:3000`

## Validaciones

```bash
npm run lint
npm run typecheck
npm run build
```

## Supabase

Antes de usar la aplicacion, aplica las migraciones en este orden:

1. [supabase/migrations/0001_initial_schema.sql](C:\Users\sedne\OneDrive\Documentos\almacenamiento_alfombras\supabase\migrations\0001_initial_schema.sql)
2. [supabase/migrations/0002_rug_movements_workflow.sql](C:\Users\sedne\OneDrive\Documentos\almacenamiento_alfombras\supabase\migrations\0002_rug_movements_workflow.sql)

Opcional:

3. [supabase/seed.sql](C:\Users\sedne\OneDrive\Documentos\almacenamiento_alfombras\supabase\seed.sql)

Si no tienes Supabase CLI configurado, ejecuta los SQL desde el `SQL Editor` del panel de Supabase.

## Estructura principal

```text
src/
  app/
  components/
  features/
  lib/
  types/
supabase/
  migrations/
  seed.sql
```

## Git y GitHub

Si todavia no tienes repo remoto:

```bash
git init
git add .
git commit -m "feat: initial superclim rug storage system"
```

Despues crea un repositorio vacio en GitHub y conecta el remoto:

```bash
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git branch -M main
git push -u origin main
```

## Deploy en Vercel

1. Subir el repo a GitHub.
2. Entrar en Vercel.
3. `Add New Project`.
4. Importar el repositorio.
5. Configurar variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Ejecutar el deploy.

Configuracion recomendada:

- Framework: `Next.js`
- Build command: `npm run build`
- Install command: `npm install`

## Pendencias antes de produccion real

- aplicar la migracion `0002` en Supabase
- definir estrategia real de autenticacion y permisos
- definir flujo real de cobro si `pagamentos pendentes` va a ser financiero de verdad
- implementar upload real de fotos
- revisar politicas RLS de Supabase antes de abrir acceso multiusuario
