import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Flag } from "lucide-react";

export default async function AdminReportesPage() {
  const reportes = await prisma.reporte.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      reportante: { select: { username: true, nombreMarca: true } },
      reportado: { select: { username: true, nombreMarca: true } },
    },
  });

  const estadoColor: Record<string, string> = {
    pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    revisado: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    resuelto: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };

  const estadoLabels: Record<string, string> = { pendiente: "Pendiente", revisado: "Revisado", resuelto: "Resuelto" };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reportes ({reportes.length})</h1>

      {reportes.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl">
          <Flag className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No hay reportes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reportes.map((reporte) => (
            <Card key={reporte.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Flag className="h-4 w-4 text-destructive shrink-0" />
                      <p className="text-sm font-medium">
                        @{reporte.reportante.username} reportó a @{reporte.reportado.username}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground bg-muted/50 rounded p-2 mt-2">{reporte.motivo}</p>
                    <p className="text-xs text-muted-foreground mt-2">{formatDate(reporte.createdAt)}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${estadoColor[reporte.estado]}`}>
                    {estadoLabels[reporte.estado]}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
