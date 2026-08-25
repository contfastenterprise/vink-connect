# Plan de Optimización de Rendimiento — Vink Connect

**Verified & Polished**

## Hitos Completados
1. **ISR & Caché Optimizado**:
   - Agregada directiva de revalidación (`revalidate = 3600`) a `/c/[slug]/page.tsx` para servir tarjetas estáticas desde CDN.
   - Removido `revalidatePath('/')` innecesario del tracker de visitas.

2. **Carga Asíncrona de Web-Push**:
   - `web-push` cargado dinámicamente en `dashboard-actions.ts` evitando su inclusión en el cold-start del resto de las acciones del panel.

3. **Queries Supabase Paralelizadas y Optimizadas**:
   - Las consultas a perfiles y tarjetas ahora corren en paralelo (`Promise.all`).
   - Se reemplazaron consultas `SELECT *` por campos explícitos.
   - Eliminado el doble fetch de `leads` pasando la data pre-cargada como props a `<LeadList>`.

4. **Optimización de Fuentes y Media**:
   - Migrado de `<link>` bloqueantes a `next/font/google` para la fuente `Inter`.
   - Implementado `next/image` con fallbacks para optimizar logos, marcas y avatares del dashboard y página pública.
   - Configurado `remotePatterns` en `next.config.ts` para optimización de avatares de Dicebear y Supabase.
