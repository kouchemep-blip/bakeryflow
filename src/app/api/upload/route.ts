import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { uploadImage } from "@/lib/upload";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;
  const image = (await request.formData()).get("image");
  if (!(image instanceof File) || image.size === 0) return NextResponse.json({ message: "Image requise." }, { status: 400 });
  if (!image.type.startsWith("image/") || image.size > 5 * 1024 * 1024) return NextResponse.json({ message: "Image invalide (5 Mo maximum)." }, { status: 400 });
  const uploaded = await uploadImage(Buffer.from(await image.arrayBuffer()));
  return NextResponse.json(uploaded, { status: 201 });
}
