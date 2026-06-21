import type { Rol, Plan, TipoVenta, StockEstado, EstadoPedido, EstadoReporte, Categoria } from "@prisma/client";

export type { Rol, Plan, TipoVenta, StockEstado, EstadoPedido, EstadoReporte, Categoria };

export interface UsuarioPublico {
  id: string;
  username: string;
  nombreMarca: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  biografia: string | null;
  whatsapp: string | null;
  instagram: string | null;
  provincia: string | null;
  localidad: string | null;
  rol: Rol;
  reputacionVotosPositivos: number;
  entregasConfirmadas: number;
  verificado: boolean;
  plan: Plan;
  createdAt: Date;
  _count?: {
    productos: number;
    seguidores: number;
    siguiendo: number;
  };
}

export interface ProductoConUsuario {
  id: string;
  titulo: string;
  descripcion: string | null;
  precio: string | number;
  categoria: Categoria;
  tipoVenta: TipoVenta;
  stockEstado: StockEstado;
  fotosUrls: string[];
  destacado: boolean;
  activo: boolean;
  vistas: number;
  createdAt: Date;
  updatedAt: Date;
  usuarioId: string;
  usuario: {
    id: string;
    username: string;
    nombreMarca: string | null;
    logoUrl: string | null;
    provincia: string | null;
    localidad: string | null;
    whatsapp: string | null;
    verificado: boolean;
  };
  _count?: {
    favoritos: number;
    pedidos: number;
  };
  isFavorito?: boolean;
}

export interface PedidoConRelaciones {
  id: string;
  codigoQrHash: string;
  estado: EstadoPedido;
  createdAt: Date;
  comprador: {
    id: string;
    username: string;
    nombreMarca: string | null;
  };
  vendedor: {
    id: string;
    username: string;
    nombreMarca: string | null;
    whatsapp: string | null;
  };
  producto: {
    id: string;
    titulo: string;
    precio: string | number;
    fotosUrls: string[];
    categoria: Categoria;
  };
}

export interface FiltrosProducto {
  categoria?: Categoria;
  provincia?: string;
  localidad?: string;
  tipoVenta?: TipoVenta;
  search?: string;
  orderBy?: "reciente" | "precio_asc" | "precio_desc" | "vistas" | "destacado";
  page?: number;
  limit?: number;
}

export interface EstadisticasDashboard {
  totalProductos: number;
  totalPedidos: number;
  pedidosPendientes: number;
  pedidosEntregados: number;
  totalVistas: number;
  totalFavoritos: number;
  ventasPorCategoria: { categoria: Categoria; count: number }[];
}

export interface EstadisticasAdmin {
  totalUsuarios: number;
  totalArtesanos: number;
  totalClientes: number;
  totalProductos: number;
  totalPedidos: number;
  reportesPendientes: number;
  usuariosPorRol: { rol: Rol; count: number }[];
  productosPorCategoria: { categoria: Categoria; count: number }[];
}

export type HomeTab = "mates" | "insumos";

export interface UIFilters {
  provincia: string;
  localidad: string;
  categoria: string;
  search: string;
  orderBy: string;
  tipoVenta: string;
}

export const PROVINCIAS_ARGENTINA = [
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
  "CABA",
] as const;

export const CATEGORIAS_MATES: Categoria[] = [
  "mates_imperiales",
  "camioneros",
  "torpedos",
  "calabazas",
];

export const CATEGORIAS_INSUMOS: Categoria[] = [
  "virolas",
  "bombillas",
  "cueros",
  "herramientas",
  "accesorios",
];

export const CATEGORIA_LABELS: Record<Categoria, string> = {
  mates_imperiales: "Mates Imperiales",
  camioneros: "Camioneros",
  torpedos: "Torpedos",
  calabazas: "Calabazas",
  virolas: "Virolas",
  bombillas: "Bombillas",
  cueros: "Cueros",
  herramientas: "Herramientas",
  accesorios: "Accesorios",
};

export const TIPO_VENTA_LABELS: Record<TipoVenta, string> = {
  mayorista: "Mayorista",
  minorista: "Minorista",
  ambos: "Mayorista y Minorista",
};

export const STOCK_ESTADO_LABELS: Record<StockEstado, string> = {
  disponible: "Disponible",
  por_encargo: "Por Encargo",
  sin_stock: "Sin Stock",
};

export const ROL_LABELS: Record<Rol, string> = {
  artesano: "Artesano",
  proveedor: "Proveedor",
  cliente: "Cliente",
  admin: "Administrador",
};
