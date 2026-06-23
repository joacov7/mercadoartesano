"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Camera, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { actualizarPerfil } from "@/server/actions/perfil";
import { getInitials } from "@/lib/utils";

async function uploadImage(file: File, type: "banner" | "logo"): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Error al subir imagen");
  const data = await res.json();
  return data.url as string;
}

export default function PerfilPage() {
  const { data: session, update } = useSession();
  const user = session?.user as any;

  const [bannerUrl, setBannerUrl] = useState<string>(user?.bannerUrl ?? "");
  const [logoUrl, setLogoUrl] = useState<string>(user?.logoUrl ?? "");
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nombreMarca: user?.name ?? "",
    biografia: user?.biografia ?? "",
    whatsapp: user?.whatsapp ?? "",
    instagram: user?.instagram ?? "",
    provincia: user?.provincia ?? "",
    localidad: user?.localidad ?? "",
  });

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBanner(true);
    try {
      const url = await uploadImage(file, "banner");
      setBannerUrl(url);
      await actualizarPerfil({ bannerUrl: url });
      toast.success("Banner actualizado");
    } catch {
      toast.error("Error al subir el banner");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const url = await uploadImage(file, "logo");
      setLogoUrl(url);
      await actualizarPerfil({ logoUrl: url });
      toast.success("Logo actualizado");
    } catch {
      toast.error("Error al subir el logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await actualizarPerfil(form);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Perfil actualizado");
        await update();
      }
    } catch {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Mi Perfil</h1>

      {/* Banner */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Banner de tienda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-40 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden group cursor-pointer"
            onClick={() => bannerInputRef.current?.click()}>
            {bannerUrl && (
              <Image src={bannerUrl} alt="Banner" fill className="object-cover" />
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {uploadingBanner ? (
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              ) : (
                <div className="text-center text-white">
                  <Camera className="h-8 w-8 mx-auto mb-1" />
                  <p className="text-sm font-medium">
                    {bannerUrl ? "Cambiar banner" : "Subir banner"}
                  </p>
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Recomendado: 1200×300px. JPG, PNG o WebP. Máx 5MB.</p>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleBannerChange}
          />
        </CardContent>
      </Card>

      {/* Logo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Logo / Foto de perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer group" onClick={() => logoInputRef.current?.click()}>
              <Avatar className="h-20 w-20 border-2 border-border">
                <AvatarImage src={logoUrl} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {getInitials(form.nombreMarca || user?.username || "U")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploadingLogo ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                ) : (
                  <Camera className="h-5 w-5 text-white" />
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Hacé clic para cambiar</p>
              <p className="text-xs text-muted-foreground">JPG, PNG o WebP. Máx 5MB.</p>
            </div>
          </div>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleLogoChange}
          />
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Información de la tienda</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombreMarca">Nombre de marca</Label>
              <Input
                id="nombreMarca"
                value={form.nombreMarca}
                onChange={(e) => setForm({ ...form, nombreMarca: e.target.value })}
                placeholder="Ej: Mates del Norte"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="biografia">Biografía</Label>
              <Textarea
                id="biografia"
                value={form.biografia}
                onChange={(e) => setForm({ ...form, biografia: e.target.value })}
                placeholder="Contá tu historia, tu estilo de trabajo..."
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">{form.biografia.length}/500</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provincia">Provincia</Label>
                <Input
                  id="provincia"
                  value={form.provincia}
                  onChange={(e) => setForm({ ...form, provincia: e.target.value })}
                  placeholder="Ej: Mendoza"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="localidad">Localidad</Label>
                <Input
                  id="localidad"
                  value={form.localidad}
                  onChange={(e) => setForm({ ...form, localidad: e.target.value })}
                  placeholder="Ej: Godoy Cruz"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="5491112345678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  placeholder="@mi_cuenta"
                />
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <a
                href={`/tienda/${user?.username}`}
                target="_blank"
                className="text-sm text-primary hover:underline"
              >
                Ver mi tienda →
              </a>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
