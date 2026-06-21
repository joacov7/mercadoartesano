import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, getInitials } from "@/lib/utils";
import { ROL_LABELS } from "@/types";
import type { Rol } from "@/types";
import { MapPin, BadgeCheck } from "lucide-react";

export default async function AdminUsuariosPage() {
  const usuarios = await prisma.usuario.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { productos: true, pedidosComoVendedor: true } },
    },
  });

  const rolColor: Record<string, string> = {
    admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    artesano: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    proveedor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    cliente: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Usuarios ({usuarios.length})</h1>
      </div>

      <div className="space-y-3">
        {usuarios.map((usuario) => (
          <Card key={usuario.id}>
            <CardContent className="flex gap-4 p-4">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={usuario.logoUrl ?? ""} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {getInitials(usuario.nombreMarca ?? usuario.username)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-medium text-sm truncate">{usuario.nombreMarca ?? usuario.username}</p>
                  {usuario.verificado && <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" />}
                  {!usuario.activo && <span className="text-xs text-destructive">(inactivo)</span>}
                </div>
                <p className="text-xs text-muted-foreground">@{usuario.username} · {usuario.email}</p>
                {usuario.provincia && (
                  <p className="text-xs text-muted-foreground flex items-center gap-0.5 mt-0.5">
                    <MapPin className="h-3 w-3" />{usuario.provincia}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rolColor[usuario.rol]}`}>
                  {ROL_LABELS[usuario.rol as Rol]}
                </span>
                <div className="text-xs text-muted-foreground text-right">
                  <p>{usuario._count.productos} productos</p>
                  <p>{usuario._count.pedidosComoVendedor} ventas</p>
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(usuario.createdAt)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
