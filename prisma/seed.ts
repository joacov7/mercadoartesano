import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Clear existing data in correct order
  await prisma.productView.deleteMany();
  await prisma.reporte.deleteMany();
  await prisma.seguidor.deleteMany();
  await prisma.favorito.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.usuario.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 12);

  // Admin
  const admin = await prisma.usuario.create({
    data: {
      username: "admin",
      email: "admin@mercadoartesano.com.ar",
      passwordHash,
      rol: "admin",
      nombreMarca: "MercadoArtesano Admin",
      verificado: true,
      plan: "premium",
    },
  });

  // Artisans
  const artesano1 = await prisma.usuario.create({
    data: {
      username: "mates_del_norte",
      email: "matesnorte@ejemplo.com",
      passwordHash,
      rol: "artesano",
      nombreMarca: "Mates del Norte",
      biografia: "Artesano misionero con 15 años de experiencia. Especializado en mates imperiales de palo santo y cedro. Cada pieza es única y hecha a mano con amor.",
      whatsapp: "+5493764123456",
      instagram: "@matesdelnorte",
      provincia: "Misiones",
      localidad: "Posadas",
      verificado: true,
      plan: "pro",
      reputacionVotosPositivos: 47,
      entregasConfirmadas: 89,
    },
  });

  const artesano2 = await prisma.usuario.create({
    data: {
      username: "virolas_rioja",
      email: "virolas@ejemplo.com",
      passwordHash,
      rol: "artesano",
      nombreMarca: "Virolas Riojanas",
      biografia: "Platero artesano de La Rioja. Trabajo la plata alpaca y el bronce para crear virolas y accesorios únicos para mates. Más de 20 años en el oficio.",
      whatsapp: "+5493804567890",
      instagram: "@virolasrioja",
      provincia: "La Rioja",
      localidad: "La Rioja Capital",
      verificado: true,
      plan: "pro",
      reputacionVotosPositivos: 82,
      entregasConfirmadas: 156,
    },
  });

  const artesano3 = await prisma.usuario.create({
    data: {
      username: "calabazas_cordobesas",
      email: "calabazas@ejemplo.com",
      passwordHash,
      rol: "artesano",
      nombreMarca: "Calabazas Cordobesas",
      biografia: "Cultivamos y procesamos nuestras propias calabazas en Córdoba. Mates naturales con el toque artesanal serrano.",
      whatsapp: "+5493514123456",
      instagram: "@calabazascba",
      provincia: "Córdoba",
      localidad: "Villa General Belgrano",
      verificado: false,
      plan: "free",
      reputacionVotosPositivos: 23,
      entregasConfirmadas: 41,
    },
  });

  const proveedor1 = await prisma.usuario.create({
    data: {
      username: "bombillas_sa",
      email: "bombillas@ejemplo.com",
      passwordHash,
      rol: "proveedor",
      nombreMarca: "Bombillas & Accesorios SA",
      biografia: "Distribuidora mayorista de bombillas, cueros y accesorios para mates. 25 años en el mercado.",
      whatsapp: "+541122334455",
      instagram: "@bombillassa",
      provincia: "Buenos Aires",
      localidad: "Avellaneda",
      verificado: true,
      plan: "premium",
      reputacionVotosPositivos: 134,
      entregasConfirmadas: 389,
    },
  });

  // Clients
  const cliente1 = await prisma.usuario.create({
    data: {
      username: "juan_mateador",
      email: "juan@ejemplo.com",
      passwordHash,
      rol: "cliente",
      provincia: "Santa Fe",
    },
  });

  const cliente2 = await prisma.usuario.create({
    data: {
      username: "maria_yerba",
      email: "maria@ejemplo.com",
      passwordHash,
      rol: "cliente",
      provincia: "Mendoza",
    },
  });

  console.log("✅ Usuarios creados");

  // Products for artesano1 - Mates del Norte
  const productos1 = await Promise.all([
    prisma.producto.create({
      data: {
        usuarioId: artesano1.id,
        titulo: "Mate Imperial Palo Santo con Virola Alpaca",
        descripcion: "Mate imperial tallado a mano en palo santo de Misiones. Virola de alpaca 900/1000 con grabado artesanal de hojas de yerba. Sellado con cera virgen de abeja para mayor durabilidad. Capacidad: 120ml. Incluye bombilla de regalo.",
        precio: 8500,
        categoria: "mates_imperiales",
        tipoVenta: "minorista",
        stockEstado: "disponible",
        fotosUrls: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500", "https://images.unsplash.com/photo-1562887284-e0de0c6ffadc?w=500"],
        destacado: true,
        vistas: 234,
      },
    }),
    prisma.producto.create({
      data: {
        usuarioId: artesano1.id,
        titulo: "Mate Torpedo en Cedro Misionero",
        descripcion: "Torpedo de cedro misionero primera calidad. Forma ergonómica perfecta para la mano. Grabado con escenas de la selva misionera. Sin virola para mantener el sabor natural de la madera.",
        precio: 5200,
        categoria: "torpedos",
        tipoVenta: "ambos",
        stockEstado: "disponible",
        fotosUrls: ["https://images.unsplash.com/photo-1558618047-3c8c76c7f8c1?w=500"],
        destacado: false,
        vistas: 89,
      },
    }),
    prisma.producto.create({
      data: {
        usuarioId: artesano1.id,
        titulo: "Mate Camionero Roble con Asa",
        descripcion: "Mate camionero ideal para viajes largos. Hecho en roble patagónico, con asa de cuero trenzado y tapa a rosca. Perfecto para el mate de ruta.",
        precio: 6800,
        categoria: "camioneros",
        tipoVenta: "minorista",
        stockEstado: "disponible",
        fotosUrls: ["https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?w=500"],
        destacado: true,
        vistas: 156,
      },
    }),
    prisma.producto.create({
      data: {
        usuarioId: artesano1.id,
        titulo: "Lote de 10 Mates Imperiales para Reventa",
        descripcion: "Lote mayorista de 10 mates imperiales en diferentes maderas (quebracho, palo santo, cedro). Ideal para artesanías, ferias y negocios. Precio por unidad $6500.",
        precio: 65000,
        categoria: "mates_imperiales",
        tipoVenta: "mayorista",
        stockEstado: "por_encargo",
        fotosUrls: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"],
        destacado: false,
        vistas: 45,
      },
    }),
  ]);

  // Products for artesano2 - Virolas Riojanas
  const productos2 = await Promise.all([
    prisma.producto.create({
      data: {
        usuarioId: artesano2.id,
        titulo: "Virola de Plata 900 con Grabado Pampa",
        descripcion: "Virola artesanal en plata 900/1000. Grabado manual con diseño de cactus y paisaje riojano. Compatible con mates de 55-65mm de diámetro. Viene con certificado de autenticidad.",
        precio: 12000,
        categoria: "virolas",
        tipoVenta: "ambos",
        stockEstado: "disponible",
        fotosUrls: ["https://images.unsplash.com/photo-1589802829985-817e51171b92?w=500"],
        destacado: true,
        vistas: 312,
      },
    }),
    prisma.producto.create({
      data: {
        usuarioId: artesano2.id,
        titulo: "Bombilla de Alpaca con Filtro de Malla Fina",
        descripcion: "Bombilla premium de alpaca 900. Filtro de malla fina anti-residuos. Longitud 21cm. Doblez ergonómico. Ideal para yerba gruesa y mix de yerbas.",
        precio: 3500,
        categoria: "bombillas",
        tipoVenta: "ambos",
        stockEstado: "disponible",
        fotosUrls: ["https://images.unsplash.com/photo-1589802829985-817e51171b92?w=500"],
        destacado: false,
        vistas: 187,
      },
    }),
    prisma.producto.create({
      data: {
        usuarioId: artesano2.id,
        titulo: "Set Virola + Bombilla a Juego - Diseño Andino",
        descripcion: "Set completo de virola y bombilla en alpaca con diseño andino grabado a mano. Motivos de la Pachamama y cóndor riojano. Regalo ideal para amantes del mate.",
        precio: 18500,
        categoria: "virolas",
        tipoVenta: "minorista",
        stockEstado: "disponible",
        fotosUrls: ["https://images.unsplash.com/photo-1589802829985-817e51171b92?w=500"],
        destacado: true,
        vistas: 428,
      },
    }),
  ]);

  // Products for artesano3 - Calabazas Cordobesas
  const productos3 = await Promise.all([
    prisma.producto.create({
      data: {
        usuarioId: artesano3.id,
        titulo: "Calabaza Natural Curada Serrana",
        descripcion: "Calabaza lagenaria natural cultivada en las sierras de Córdoba. Curada artesanalmente durante 3 meses. Sabor único que se va mejorando con el uso. Forma redonda perfecta.",
        precio: 2800,
        categoria: "calabazas",
        tipoVenta: "ambos",
        stockEstado: "disponible",
        fotosUrls: ["https://images.unsplash.com/photo-1601925228239-50d6aa1e5e47?w=500"],
        destacado: false,
        vistas: 67,
      },
    }),
    prisma.producto.create({
      data: {
        usuarioId: artesano3.id,
        titulo: "Calabaza Grande Pintada a Mano - Diseño Floral",
        descripcion: "Calabaza lagenaria grande pintada a mano con diseños florales con pinturas acrílicas y barnizada. Arte único, pieza decorativa y funcional. Tamaño: 15cm aprox.",
        precio: 4500,
        categoria: "calabazas",
        tipoVenta: "minorista",
        stockEstado: "disponible",
        fotosUrls: ["https://images.unsplash.com/photo-1601925228239-50d6aa1e5e47?w=500"],
        destacado: true,
        vistas: 134,
      },
    }),
    prisma.producto.create({
      data: {
        usuarioId: artesano3.id,
        titulo: "Cuero Vacuno para Forrar Mates - Por Metro",
        descripcion: "Cuero vacuno natural sin tratar para forrar mates y artesanías. Venta por metro cuadrado. Grosor 1.5mm. Colores disponibles: natural, negro, marrón.",
        precio: 3200,
        categoria: "cueros",
        tipoVenta: "mayorista",
        stockEstado: "disponible",
        fotosUrls: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"],
        destacado: false,
        vistas: 92,
      },
    }),
  ]);

  // Products for proveedor1 - Bombillas & Accesorios SA
  const productos4 = await Promise.all([
    prisma.producto.create({
      data: {
        usuarioId: proveedor1.id,
        titulo: "Pack 50 Bombillas Acero Inoxidable - Mayorista",
        descripcion: "Pack mayorista de 50 bombillas de acero inoxidable 316L. Aptas para lavaplatos. Filtro cónico 5 ranuras. Longitud 21.5cm. Ideal para negocios y ferias.",
        precio: 45000,
        categoria: "bombillas",
        tipoVenta: "mayorista",
        stockEstado: "disponible",
        fotosUrls: ["https://images.unsplash.com/photo-1589802829985-817e51171b92?w=500"],
        destacado: true,
        vistas: 567,
      },
    }),
    prisma.producto.create({
      data: {
        usuarioId: proveedor1.id,
        titulo: "Herramientas para Artesanos - Kit Completo",
        descripcion: "Kit profesional para artesanos de mates: 1 torno de mano, 3 gubias, 1 formón, papel lija surtido, aceite de linaza 250ml, cera de abeja 100g. Todo en caja de madera.",
        precio: 28000,
        categoria: "herramientas",
        tipoVenta: "ambos",
        stockEstado: "disponible",
        fotosUrls: ["https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=500"],
        destacado: true,
        vistas: 289,
      },
    }),
    prisma.producto.create({
      data: {
        usuarioId: proveedor1.id,
        titulo: "Cuero Curado para Confección - 2m²",
        descripcion: "Cuero vacuno curtido al cromo, color natural. 2 metros cuadrados. Ideal para forrar mates, hacer fundas y accesorios artesanales. Grosor uniforme 1.2mm.",
        precio: 7500,
        categoria: "cueros",
        tipoVenta: "ambos",
        stockEstado: "disponible",
        fotosUrls: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"],
        destacado: false,
        vistas: 143,
      },
    }),
    prisma.producto.create({
      data: {
        usuarioId: proveedor1.id,
        titulo: "Accesorios para Mate - Set Completo Regalo",
        descripcion: "Set de accesorios completo: porta mate de cuero, posa pava de madera, tapa anti-insectos de alpaca, cepillo limpia bombilla, estuche de viaje. El regalo perfecto para mateadores.",
        precio: 15000,
        categoria: "accesorios",
        tipoVenta: "ambos",
        stockEstado: "disponible",
        fotosUrls: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"],
        destacado: false,
        vistas: 201,
      },
    }),
  ]);

  console.log("✅ Productos creados");

  // Create some follows
  await Promise.all([
    prisma.seguidor.create({ data: { usuarioId: cliente1.id, artesanoId: artesano1.id } }),
    prisma.seguidor.create({ data: { usuarioId: cliente1.id, artesanoId: artesano2.id } }),
    prisma.seguidor.create({ data: { usuarioId: cliente2.id, artesanoId: artesano1.id } }),
    prisma.seguidor.create({ data: { usuarioId: cliente2.id, artesanoId: artesano3.id } }),
  ]);

  console.log("✅ Seguidores creados");

  // Create some favorites
  const allProductos = [...productos1, ...productos2, ...productos3, ...productos4];
  await Promise.all([
    prisma.favorito.create({ data: { usuarioId: cliente1.id, productoId: allProductos[0].id } }),
    prisma.favorito.create({ data: { usuarioId: cliente1.id, productoId: allProductos[4].id } }),
    prisma.favorito.create({ data: { usuarioId: cliente2.id, productoId: allProductos[0].id } }),
    prisma.favorito.create({ data: { usuarioId: cliente2.id, productoId: allProductos[2].id } }),
    prisma.favorito.create({ data: { usuarioId: cliente2.id, productoId: allProductos[6].id } }),
  ]);

  console.log("✅ Favoritos creados");

  // Create some orders
  const { nanoid } = await import("nanoid");
  await Promise.all([
    prisma.pedido.create({
      data: {
        compradorId: cliente1.id,
        vendedorId: artesano1.id,
        productoId: productos1[0].id,
        codigoQrHash: nanoid(12),
        estado: "entregado",
      },
    }),
    prisma.pedido.create({
      data: {
        compradorId: cliente2.id,
        vendedorId: artesano2.id,
        productoId: productos2[0].id,
        codigoQrHash: nanoid(12),
        estado: "pendiente",
      },
    }),
    prisma.pedido.create({
      data: {
        compradorId: cliente1.id,
        vendedorId: proveedor1.id,
        productoId: productos4[1].id,
        codigoQrHash: nanoid(12),
        estado: "pendiente",
      },
    }),
  ]);

  console.log("✅ Pedidos creados");

  console.log("\n🎉 Seed completado exitosamente!");
  console.log("\n📋 Usuarios de prueba (contraseña: password123):");
  console.log("  👑 admin@mercadoartesano.com.ar (admin)");
  console.log("  🎨 matesnorte@ejemplo.com (artesano - Mates del Norte)");
  console.log("  💍 virolas@ejemplo.com (artesano - Virolas Riojanas)");
  console.log("  🎃 calabazas@ejemplo.com (artesano - Calabazas Cordobesas)");
  console.log("  📦 bombillas@ejemplo.com (proveedor - Bombillas & Accesorios SA)");
  console.log("  👤 juan@ejemplo.com (cliente)");
  console.log("  👤 maria@ejemplo.com (cliente)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
