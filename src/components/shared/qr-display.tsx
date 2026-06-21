"use client"

import { useState } from "react"
import Image from "next/image"
import { Copy, Check, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buildWhatsAppUrl } from "@/lib/utils"
import { toast } from "sonner"

interface QRDisplayProps {
  qrDataUrl: string
  codigoQrHash: string
  vendedorWhatsapp?: string | null
  productoTitulo?: string
}

export function QRDisplay({ qrDataUrl, codigoQrHash, vendedorWhatsapp, productoTitulo }: QRDisplayProps) {
  const [copied, setCopied] = useState(false)
  const pedidoUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/pedido/${codigoQrHash}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codigoQrHash)
    setCopied(true)
    toast.success("Código copiado")
    setTimeout(() => setCopied(false), 2000)
  }

  const waMessage = vendedorWhatsapp
    ? `Hola! Realicé un pedido en MercadoArtesano${productoTitulo ? ` de "${productoTitulo}"` : ""}. Mi código de pedido es: ${codigoQrHash}`
    : ""

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg">Tu pedido está confirmado</CardTitle>
        <p className="text-sm text-muted-foreground">Mostrá este QR al artesano para confirmar la entrega</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="border-4 border-primary rounded-lg p-2 bg-[#F5E6D3]">
          <Image src={qrDataUrl} alt="Código QR del pedido" width={200} height={200} className="rounded" />
        </div>

        <div className="w-full">
          <p className="text-xs text-muted-foreground text-center mb-1">Código de pedido</p>
          <div className="flex items-center gap-2 rounded-lg border bg-muted px-3 py-2">
            <code className="flex-1 text-sm font-mono text-center">{codigoQrHash}</code>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={handleCopy}>
              {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        </div>

        {vendedorWhatsapp && (
          <a href={buildWhatsAppUrl(vendedorWhatsapp, waMessage)} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2">
              <MessageCircle className="h-4 w-4" />
              Avisar al artesano por WhatsApp
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  )
}
