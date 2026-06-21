# MercadoArtesano 🧉

Plataforma de marketplace para artesanos argentinos de mates. Conectamos a artesanos y proveedores con compradores de todo el país.

## Stack tecnológico

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS, Shadcn/UI
- **Estado**: React Query (TanStack Query v5) + Zustand
- **Auth**: NextAuth v5 (Auth.js) con Credentials Provider
- **Base de datos**: PostgreSQL + Prisma ORM
- **Storage**: Cloudflare R2 (imágenes)
- **QR**: Librería `qrcode` para generación de códigos QR
- **Validaciones**: Zod

## Requisitos previos

- Node.js 20+
- PostgreSQL 15+
- Cuenta de Cloudflare R2 (para imágenes)

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd mercadoartesano
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con tus valores:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/mercadoartesano"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-aleatorio-aqui"

# Cloudflare R2 (para imágenes)
CLOUDFLARE_R2_ACCOUNT_ID="tu-account-id"
CLOUDFLARE_R2_ACCESS_KEY_ID="tu-access-key"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="tu-secret-key"
CLOUDFLARE_R2_BUCKET_NAME="nombre-del-bucket"
CLOUDFLARE_R2_PUBLIC_URL="https://pub-xxxx.r2.dev"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="MercadoArtesano"
```

### 4. Configurar la base de datos

```bash
# Crear la base de datos en PostgreSQL
createdb mercadoartesano

# Sincronizar el schema
npm run db:push

# Generar el cliente Prisma
npm run db:generate

# Cargar datos de prueba
npm run db:seed
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Usuarios de prueba

Luego de ejecutar el seed, disponés de estos usuarios (contraseña: `password123`):

| Email | Rol | Descripción |
|-------|-----|-------------|
| admin@mercadoartesano.com.ar | Admin | Panel de administración |
| matesnorte@ejemplo.com | Artesano | Mates del Norte (Misiones) |
| virolas@ejemplo.com | Artesano | Virolas Riojanas (La Rioja) |
| calabazas@ejemplo.com | Artesano | Calabazas Cordobesas (Córdoba) |
| bombillas@ejemplo.com | Proveedor | Bombillas & Accesorios SA (Buenos Aires) |
| juan@ejemplo.com | Cliente | Cliente de prueba |
| maria@ejemplo.com | Cliente | Cliente de prueba |

## Estructura del proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Páginas de autenticación
│   ├── admin/             # Panel de administración
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard del vendedor
│   ├── explorar/          # Página de exploración
│   ├── pedido/[codigo]/   # Página de pedido con QR
│   ├── producto/[id]/     # Página de producto
│   └── tienda/[username]/ # Tienda pública del artesano
├── components/
│   ├── home/              # Componentes de la home
│   ├── layout/            # Navbar, Footer
│   ├── productos/         # Grillas y cards de productos
│   ├── shared/            # WhatsApp button, QR display, etc.
│   ├── tienda/            # Store header y grid
│   └── ui/                # Componentes Shadcn/UI
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities (prisma, auth, qr, r2)
├── server/
│   ├── actions/           # Server Actions
│   └── queries/           # Server-side queries
├── store/                 # Zustand stores
└── types/                 # TypeScript types
```

## Comandos disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter ESLint
npm run db:push      # Sincronizar schema con DB
npm run db:seed      # Cargar datos de prueba
npm run db:studio    # Prisma Studio (UI de DB)
npm run db:generate  # Generar cliente Prisma
```

## Configurar Cloudflare R2

1. Accedé a [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Creá un bucket en R2
3. Configurá el acceso público
4. Generá las credenciales de API
5. Completá las variables de entorno correspondientes

## Deploy a producción

### Vercel (recomendado)

1. Conectá tu repositorio a Vercel
2. Configurá las variables de entorno en el dashboard de Vercel
3. Asegurate de tener una base de datos PostgreSQL accesible (Neon, Supabase, PlanetScale, etc.)

```bash
# Antes del deploy, ejecutar migraciones
npm run db:push
```

## Funcionalidades principales

- **Galería de Mates / Taller de Insumos**: Navegación por categorías con filtros por provincia, tipo de venta y búsqueda
- **Tiendas de artesanos**: Perfil público con banner, logo, bio y productos
- **Sistema de pedidos con QR**: Al comprar se genera un código QR único para confirmar la entrega
- **Favoritos**: Guardá tus productos favoritos
- **Seguir artesanos**: Seguí a tus artesanos favoritos
- **Dashboard**: Panel de gestión para artesanos con estadísticas
- **Panel admin**: Gestión de usuarios y reportes

## Licencia

MIT
