import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { uploadImage } from "@/lib/upload";

export async function POST(request: NextRequest) {
  const user = await requireUser(request);
  if (user instanceof NextResponse) return user;
  const image = (await request.formData()).get("image");
  if (!(image instanceof File) || image.size === 0 || !image.type.startsWith("image/") || image.size > 5 * 1024 * 1024) {
    return NextResponse.json({ message: "Image invalide (5 Mo maximum)." }, { status: 400 });
  }
  const uploaded = await uploadImage(Buffer.from(await image.arrayBuffer()), "bakeryflow/avatars");
  return NextResponse.json({ url: uploaded.secure_url }, { status: 201 });
}
