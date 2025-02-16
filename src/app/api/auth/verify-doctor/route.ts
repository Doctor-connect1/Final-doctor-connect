import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "../../../../middleware/authDoctor";

export async function POST(req: NextRequest) {

  const authResult = await authenticate(req);

  if ("error" in authResult) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }

  return NextResponse.json({ isDoctor: authResult.isDoctor }, { status: 200 });
}
