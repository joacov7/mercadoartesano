import QRCode from "qrcode";

export async function generateQRDataURL(text: string): Promise<string> {
  const dataUrl = await QRCode.toDataURL(text, {
    width: 300,
    margin: 2,
    color: {
      dark: "#2D5016",
      light: "#F5E6D3",
    },
    errorCorrectionLevel: "H",
  });
  return dataUrl;
}

export async function generateQRBuffer(text: string): Promise<Buffer> {
  const buffer = await QRCode.toBuffer(text, {
    width: 300,
    margin: 2,
    color: {
      dark: "#2D5016",
      light: "#F5E6D3",
    },
    errorCorrectionLevel: "H",
  });
  return buffer;
}

export function buildPedidoUrl(codigoQrHash: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${baseUrl}/pedido/${codigoQrHash}`;
}
