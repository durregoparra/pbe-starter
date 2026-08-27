# Priorizador de Features — Contexto del proyecto

_Última actualización: 2026-08-26_

## Qué es este proyecto

Una app de gestión y priorización de features para equipos de producto.
Se construye durante el curso **Product Building Essentials** (alaimolabs.com/pbe),
partiendo de este shell casi vacío.

## Visión del producto

La app terminada permite a un equipo de producto:

1. **Capturar ideas/features** con los datos necesarios para priorizarlas:
   título, descripción, categoría, estado, y los cuatro valores RICE.
2. **Puntuarlas con RICE**: Reach × Impact × Confidence ÷ Effort.
   - Reach: personas alcanzadas por trimestre (número)
   - Impact: 0.25 (mínimo), 0.5 (bajo), 1 (medio), 2 (alto), 3 (masivo)
   - Confidence: 0.5 (baja), 0.8 (media), 1.0 (alta)
   - Effort: persona-meses (número > 0)
3. **Ver el ranking** calculado automáticamente, ordenado por score RICE.
4. **Explorar una matriz Impacto vs. Esfuerzo** con cuatro cuadrantes:
   - Quick Wins (alto impacto, bajo esfuerzo)
   - Big Bets (alto impacto, alto esfuerzo)
   - Fill-ins (bajo impacto, bajo esfuerzo)
   - Time Sinks (bajo impacto, alto esfuerzo)
5. **Filtrar** por estado (`idea`, `en_evaluacion`, `priorizada`, `en_desarrollo`, `lanzada`)
   y por categoría (texto libre, ej: "onboarding", "checkout").
6. **Colaborar en tiempo real**: los cambios de otros usuarios aparecen sin recargar.

No construyas todo esto de una vez: el curso lo desarrolla módulo a módulo.
Implementa solo lo que se te pida en cada prompt.

## Stack técnico

- **Next.js** (App Router) con **TypeScript**
- **Tailwind CSS** para estilos

La base de datos (Supabase) y el deployment (Vercel) se agregan durante el curso;
todavía no están configurados en este proyecto. Cuando se conecte Supabase, usa
las API keys nuevas (`sb_publishable_...` en `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`),
nunca las legacy (anon/service_role JWT).

### Supabase: base de datos de producción, sin migraciones

Este proyecto se conecta directamente a la base de datos de **producción** de
Supabase. Es un prototipo, así que **no se usan migraciones**: los cambios de
esquema (crear/alterar tablas, columnas, políticas RLS, etc.) se hacen directo
sobre la base de datos de producción cuando se piden, sin pasos intermedios de
staging ni archivos de migración versionados.

## Comandos

Este proyecto usa **pnpm** (no npm ni yarn).

- `pnpm dev` — servidor de desarrollo en http://localhost:3000
- `pnpm build` — build de producción (úsalo para verificar que no hay errores)
- `pnpm lint` — linter

## Estructura

- `src/app/` — páginas y layout (App Router)
- `public/` — assets estáticos (incluye el logo de Alaimo Labs)

## Convenciones

- Todo el texto visible para el usuario va en **español neutro** (tuteo, nunca voseo).
- Nombres de variables, funciones y tablas en **inglés** (ej: `features`,
  `title`, `reach`, `impact`, `confidence`, `effort`, `status`, `category`).
- Componentes de React en `src/components/` cuando la app crezca.
- Diseño limpio y minimalista con Tailwind; la app debe verse bien en modo claro y oscuro.
- Antes de dar por terminado un cambio, verifica que `pnpm build` pase sin errores.
- Los formularios validan en el cliente antes de enviar y muestran los mensajes de error en cada campo.
- Ninguna pantalla queda sin estado vacío y sin estado de carga.
