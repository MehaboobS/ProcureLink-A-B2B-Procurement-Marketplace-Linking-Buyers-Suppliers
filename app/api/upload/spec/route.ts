import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file: any = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/acad"
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const dir = path.join(process.cwd(), "public/uploads/specs");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(dir, fileName);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      fileUrl: `/uploads/specs/${fileName}`
    });

  } catch (err) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}