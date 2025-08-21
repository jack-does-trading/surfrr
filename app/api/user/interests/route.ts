import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { jwtVerify } from "jose";
import { ObjectId } from "mongodb";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, getJwtSecret());
    const { interests } = await req.json();
    if (!Array.isArray(interests)) {
      return NextResponse.json({ error: "Invalid interests" }, { status: 400 });
    }

    const sanitized = interests
      .filter((i) => typeof i === "string")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const db = await getDb();
    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(String(payload.sub)) },
        { $set: { interests: sanitized, updatedAt: new Date() } }
      );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
