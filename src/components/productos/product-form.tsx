"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CATEGORIA_LABELS, TIPO_VENTA_LABELS, STOCK_ESTADO_LABELS } from "@/types"
import type { Categoria, TipoVenta, StockEstado } from "@/types"
import { toast } from "sonner"
import Image from "next/image"

interface ProductFormData {
  titulo: string
  descripcion: string
  precio: string
  categoria: Categoria
  tipoVenta: TipoVenta
  stockEstado: StockEstado
  fotosUrls: string[]
  destacado: boolean
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData> & { id?: string }
  mode: "create" | "edit"
}

export function ProductForm({ initialData, mode }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<ProductFormData>({
    titulo: initialData?.titulo ?? "",
    descripcion: initialData?.descripcion ?? "",
    precio: initialData?.precio?.toString() ?? "",
    categoria: initialData?.categoria ?? "mates_imperiales",
    tipoVenta: initialData?.tipoVenta ?? "minorista",
    stockEstado: initialData?.stockEstado ?? "disponible",
    fotosUrls: initialData?.fotosUrls ?? [],
    destacado: initialData?.destacado ?? false,
  })

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.titulo || formData.titulo.length < 3) {
      newErrors.titulo = "El título debe tener al menos 3 caracteres"
    }
    if (!formData.precio || isNaN(parseFloat(formData.precio)) || parseFloat(formData.precio) <= 0) {
      newErrors.precio = "El precio debe ser un número positivo"
    }
    if (formData.fotosUrls.length === 0) {
      newErrors.fotosUrls = "Debes subir al menos una foto"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => { const next = { ...prev }; delete next[field]; return next })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    if (formData.fotosUrls.length + files.length > 8) {
      toast.error("Máximo 8 fotos por producto")
      return
    }

    setUploadingImages(true)
    try {
      const uploadedUrls: string[] = []
      for (const file of files) {
        const fd = new FormData()
        fd.append("file", file)
        const res = await fetch("/api/upload", { method: "POST", body: fd })
        if (!res.ok) throw new Error("Error al subir imagen")
        const data = await res.json()
        uploadedUrls.push(data.url)
      }
      handleChange("fotosUrls", [...formData.fotosUrls, ...uploadedUrls])
      toast.success("Imágenes subidas correctamente")
    } catch {
      toast.error("Error al subir las imágenes")
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    handleChange("fotosUrls", formData.fotosUrls.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      const payload = {
        ...formData,
        precio: parseFloat(formData.precio),
      }
      const url = mode === "edit" ? `/api/productos/${initialData?.id}` : "/api/productos"
      const method = mode === "edit" ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error ?? "Error al guardar")
      }
      toast.success(mode === "edit" ? "Producto actualizado" : "Producto creado exitosamente")
      router.push("/dashboard/productos")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message ?? "Error al guardar el producto")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              placeholder="Ej: Mate imperial en palo santo con virola alpaca"
              value={formData.titulo}
              onChange={(e) => handleChange("titulo", e.target.value)}
            />
            {errors.titulo && <p className="text-destructive text-xs">{errors.titulo}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Describí tu producto, materiales, medidas, proceso artesanal..."
              rows={4}
              value={formData.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precio">Precio (ARS) *</Label>
              <Input
                id="precio"
                type="number"
                placeholder="0"
                value={formData.precio}
                onChange={(e) => handleChange("precio", e.target.value)}
              />
              {errors.precio && <p className="text-destructive text-xs">{errors.precio}</p>}
            </div>

            <div className="space-y-2">
              <Label>Categoría *</Label>
              <Select value={formData.categoria} onValueChange={(v) => handleChange("categoria", v as Categoria)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORIA_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de venta</Label>
              <Select value={formData.tipoVenta} onValueChange={(v) => handleChange("tipoVenta", v as TipoVenta)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TIPO_VENTA_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estado del stock</Label>
              <Select value={formData.stockEstado} onValueChange={(v) => handleChange("stockEstado", v as StockEstado)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STOCK_ESTADO_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Fotos del producto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
            {formData.fotosUrls.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                <Image src={url} alt={`Foto ${index + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 hover:bg-black/80 transition-colors"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}
            {formData.fotosUrls.length < 8 && (
              <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary">
                <input type="file" accept="image/*" multiple className="sr-only" onChange={handleImageUpload} disabled={uploadingImages} />
                {uploadingImages ? <Loader2 className="h-6 w-6 animate-spin" /> : <Plus className="h-6 w-6" />}
                <span className="text-xs text-center">{uploadingImages ? "Subiendo..." : "Agregar foto"}</span>
              </label>
            )}
          </div>
          {errors.fotosUrls && <p className="text-destructive text-xs">{errors.fotosUrls}</p>}
          <p className="text-xs text-muted-foreground">Máximo 8 fotos. Formatos: JPG, PNG, WebP</p>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading || uploadingImages} className="flex-1">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "edit" ? "Guardar cambios" : "Publicar producto"}
        </Button>
      </div>
    </form>
  )
}
