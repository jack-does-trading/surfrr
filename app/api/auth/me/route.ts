import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { jwtVerify } from "jose";
import { ObjectId } from "mongodb";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    const db = await getDb();
    const user = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(String(payload.sub)) },
        { projection: { passwordHash: 0 } }
      );
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        interests: user.interests || [],
      },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
