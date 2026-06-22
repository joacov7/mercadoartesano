-- ============================================================
-- MercadoArtesano — Script completo de base de datos
-- Ejecutar en: console.neon.tech → SQL Editor
-- ============================================================

-- ── 1. ENUMS ──────────────────────────────────────────────
CREATE TYPE "Rol" AS ENUM ('artesano', 'proveedor', 'cliente', 'admin');
CREATE TYPE "Plan" AS ENUM ('free', 'pro', 'premium');
CREATE TYPE "TipoVenta" AS ENUM ('mayorista', 'minorista', 'ambos');
CREATE TYPE "StockEstado" AS ENUM ('disponible', 'por_encargo', 'sin_stock');
CREATE TYPE "EstadoPedido" AS ENUM ('pendiente', 'entregado', 'cancelado');
CREATE TYPE "EstadoReporte" AS ENUM ('pendiente', 'revisado', 'resuelto');
CREATE TYPE "Categoria" AS ENUM ('mates_imperiales', 'camioneros', 'torpedos', 'calabazas', 'virolas', 'bombillas', 'cueros', 'herramientas', 'accesorios');

-- ── 2. TABLAS ─────────────────────────────────────────────
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "nombre_marca" TEXT,
    "logo_url" TEXT,
    "banner_url" TEXT,
    "biografia" TEXT,
    "whatsapp" TEXT,
    "instagram" TEXT,
    "provincia" TEXT,
    "localidad" TEXT,
    "rol" "Rol" NOT NULL DEFAULT 'cliente',
    "reputacion_votos_positivos" INTEGER NOT NULL DEFAULT 0,
    "entregas_confirmadas" INTEGER NOT NULL DEFAULT 0,
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "plan" "Plan" NOT NULL DEFAULT 'free',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "productos" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "categoria" "Categoria" NOT NULL,
    "tipo_venta" "TipoVenta" NOT NULL DEFAULT 'minorista',
    "stock_estado" "StockEstado" NOT NULL DEFAULT 'disponible',
    "fotos_urls" TEXT[],
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "vistas" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "comprador_id" TEXT NOT NULL,
    "vendedor_id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "codigo_qr_hash" TEXT NOT NULL,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'pendiente',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "favoritos" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "seguidores" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "artesano_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "seguidores_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "reportes" (
    "id" TEXT NOT NULL,
    "usuario_reportante" TEXT NOT NULL,
    "usuario_reportado" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "estado" "EstadoReporte" NOT NULL DEFAULT 'pendiente',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reportes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "product_views" (
    "id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "visitante_id" TEXT,
    "ip" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "product_views_pkey" PRIMARY KEY ("id")
);

-- ── 3. ÍNDICES ────────────────────────────────────────────
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
CREATE UNIQUE INDEX "pedidos_codigo_qr_hash_key" ON "pedidos"("codigo_qr_hash");
CREATE UNIQUE INDEX "favoritos_usuario_id_producto_id_key" ON "favoritos"("usuario_id", "producto_id");
CREATE UNIQUE INDEX "seguidores_usuario_id_artesano_id_key" ON "seguidores"("usuario_id", "artesano_id");

-- ── 4. FOREIGN KEYS ───────────────────────────────────────
ALTER TABLE "productos" ADD CONSTRAINT "productos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_comprador_id_fkey" FOREIGN KEY ("comprador_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "seguidores" ADD CONSTRAINT "seguidores_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "seguidores" ADD CONSTRAINT "seguidores_artesano_id_fkey" FOREIGN KEY ("artesano_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_usuario_reportante_fkey" FOREIGN KEY ("usuario_reportante") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_usuario_reportado_fkey" FOREIGN KEY ("usuario_reportado") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "product_views" ADD CONSTRAINT "product_views_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "product_views" ADD CONSTRAINT "product_views_visitante_id_fkey" FOREIGN KEY ("visitante_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ── 5. SEED — Usuarios ────────────────────────────────────
-- password para todos: password123
INSERT INTO "usuarios" ("id","username","email","password_hash","nombre_marca","biografia","whatsapp","instagram","provincia","localidad","rol","reputacion_votos_positivos","entregas_confirmadas","verificado","plan","updated_at") VALUES
('usr_admin','admin','admin@mercadoartesano.com','$2a$12$nULcXCRQLK2EehxNk5ylrenFTt8LGvpRiE4ceX24HXrNRPRPpJKwa','MercadoArtesano',NULL,NULL,NULL,'Buenos Aires','Buenos Aires','admin',0,0,true,'premium',NOW()),
('usr_juan','juanelmatero','juan@example.com','$2a$12$nULcXCRQLK2EehxNk5ylrenFTt8LGvpRiE4ceX24HXrNRPRPpJKwa','El Matero de Juan','Artesano misionero con 15 años de experiencia tallando mates imperiales en madera de palo santo y lapacho. Cada pieza es única.','5493764123456','juanelmatero','Misiones','Posadas','artesano',47,47,true,'pro',NOW()),
('usr_maria','mariacueros','maria@example.com','$2a$12$nULcXCRQLK2EehxNk5ylrenFTt8LGvpRiE4ceX24HXrNRPRPpJKwa','Cueros del Sur','Especialista en cueros artesanales para mates. Trabajo con cuero vacuno curtido al vegetal. Diseños tradicionales y modernos.','5492944567890','cuerosdelsur','Río Negro','Bariloche','artesano',23,23,true,'free',NOW()),
('usr_carlos','carlosbombillas','carlos@example.com','$2a$12$nULcXCRQLK2EehxNk5ylrenFTt8LGvpRiE4ceX24HXrNRPRPpJKwa','Bombillas del Norte','Fabricante mayorista de bombillas de alpaca, acero inoxidable y bambú. Envíos a todo el país. Mínimo 12 unidades.','5493874321098','bombillasdelnorte','Salta','Salta','proveedor',89,89,true,'premium',NOW()),
('usr_sofia','sofiacalabazas','sofia@example.com','$2a$12$nULcXCRQLK2EehxNk5ylrenFTt8LGvpRiE4ceX24HXrNRPRPpJKwa','Calabazas Naturales','Cultivo y curo mis propias calabazas en la provincia de Corrientes. Variedades: pera, Imperial, camionero y torpedo.','5493794567123','calabazasnaturales','Corrientes','Corrientes','artesano',12,12,false,'free',NOW()),
('usr_cli1','matelovers','cliente@example.com','$2a$12$nULcXCRQLK2EehxNk5ylrenFTt8LGvpRiE4ceX24HXrNRPRPpJKwa',NULL,NULL,NULL,NULL,'Córdoba','Córdoba','cliente',0,0,false,'free',NOW()),
('usr_cli2','amantedelmate','comprador@example.com','$2a$12$nULcXCRQLK2EehxNk5ylrenFTt8LGvpRiE4ceX24HXrNRPRPpJKwa',NULL,NULL,NULL,NULL,'Santa Fe','Rosario','cliente',0,0,false,'free',NOW());

-- ── 6. SEED — Productos ───────────────────────────────────
INSERT INTO "productos" ("id","usuario_id","titulo","descripcion","precio","categoria","tipo_venta","stock_estado","fotos_urls","destacado","activo","vistas","updated_at") VALUES
('prod_01','usr_juan','Mate Imperial Palo Santo Tallado','Mate imperial tallado a mano en madera de palo santo. Diseño geométrico mapuche. Capacidad: 250ml. Incluye curado.',8500,'mates_imperiales','minorista','disponible',ARRAY['https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800'],true,true,342,NOW()),
('prod_02','usr_juan','Mate Camionero Quebracho Colorado','Mate camionero en quebracho colorado. Ideal para viajes. Base plana antivuelco. Capacidad: 300ml.',6200,'camioneros','minorista','disponible',ARRAY['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'],false,true,187,NOW()),
('prod_03','usr_juan','Mate Torpedo Lapacho con Virola Plateada','Mate torpedo en lapacho rojizo con virola de alpaca plateada. Acabado satinado. Pieza artesanal única.',11000,'torpedos','minorista','por_encargo',ARRAY['https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800'],true,true,521,NOW()),
('prod_04','usr_juan','Set de 3 Mates Imperiales - Pack Mayorista','Pack de 3 mates imperiales en madera de lapacho. Ideal para revendedores. Diseños variados.',21000,'mates_imperiales','mayorista','disponible',ARRAY['https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800'],false,true,98,NOW()),
('prod_05','usr_maria','Cuero Artesanal para Mate Imperial - Marrón Oscuro','Cuero vacuno curtido al vegetal, color marrón oscuro. Talla a medida para mates imperiales. Costura a mano.',3500,'cueros','minorista','disponible',ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'],true,true,234,NOW()),
('prod_06','usr_maria','Cuero Trenzado Natural - Técnica Patagónica','Cuero trenzado a mano con técnica tradicional patagónica. Color natural sin teñir. Durable y flexible.',4800,'cueros','minorista','disponible',ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'],false,true,156,NOW()),
('prod_07','usr_maria','Cuero Negro con Detalles Bordados - Mate Camionero','Cuero negro con bordados geométricos en hilo crudo. Para mate camionero. Cada pieza es única.',5200,'cueros','minorista','por_encargo',ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'],false,true,89,NOW()),
('prod_08','usr_carlos','Bombilla Alpaca Cebadora Artesanal','Bombilla de alpaca plateada con filtro cebador anti-paja. Largo: 19cm. Apta para lavar.',2800,'bombillas','minorista','disponible',ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],true,true,678,NOW()),
('prod_09','usr_carlos','Pack 12 Bombillas Acero Inoxidable - Mayorista','Pack mayorista de 12 bombillas de acero inoxidable 304. Filtro espiral. Apta lavavajillas.',18000,'bombillas','mayorista','disponible',ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],false,true,445,NOW()),
('prod_10','usr_carlos','Bombilla Bambú Eco-Friendly','Bombilla ecológica de bambú con filtro de acero. Sustentable y biodegradable. 18cm de largo.',1500,'bombillas','minorista','disponible',ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],false,true,312,NOW()),
('prod_11','usr_sofia','Calabaza Imperial Curada - Grande','Calabaza tipo imperial cultivada y curada naturalmente. Talla grande (250-300ml). Lista para usar.',1200,'calabazas','minorista','disponible',ARRAY['https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800'],false,true,145,NOW()),
('prod_12','usr_sofia','Lote 10 Calabazas Camionero - Mayorista','10 calabazas tipo camionero curadas. Tamaño uniforme. Ideales para artesanos que tallan.',9000,'calabazas','mayorista','disponible',ARRAY['https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800'],false,true,67,NOW()),
('prod_13','usr_sofia','Calabaza Pera Curada - Sin Cuello','Calabaza tipo pera sin cuello. Perfecta para tallar o cubrir con cuero. Curada al sol.',900,'calabazas','minorista','por_encargo',ARRAY['https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800'],false,true,43,NOW()),
('prod_14','usr_juan','Virola Alpaca 25mm - Pack 5 unidades','Virolas de alpaca plateada 25mm de diámetro. Pack de 5 unidades. Acabado satinado.',4500,'virolas','mayorista','disponible',ARRAY['https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800'],false,true,289,NOW()),
('prod_15','usr_maria','Yerbera Artesanal Cuero y Madera','Yerbera artesanal con estructura de madera y forro de cuero. Capacidad 500g. Con tapa.',7500,'accesorios','minorista','por_encargo',ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'],false,true,134,NOW());

-- ── 7. SEED — Seguidores ──────────────────────────────────
INSERT INTO "seguidores" ("id","usuario_id","artesano_id") VALUES
('seg_01','usr_cli1','usr_juan'),
('seg_02','usr_cli1','usr_maria'),
('seg_03','usr_cli2','usr_juan'),
('seg_04','usr_cli2','usr_carlos');

-- ── FIN ───────────────────────────────────────────────────
