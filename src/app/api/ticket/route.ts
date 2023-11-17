import { NextResponse } from "next/server";
import { db } from '@/lib/db'
import { tickets } from "@/lib/db/schema";
import { getToken } from '@/lib/jamf'

// /api/ticket
export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    const { user, device, incident, description, status, imageUrl } = body;
    // console.log(user, device, incident, description, status, imageUrl);
    
    // getToken

    // await db.insert(tickets).values({
    //   user, device, incident, description, status, imageUrl
    // })
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: `internal server error` },
      { status: 500 }
    );
  }
};

export const GET = async (req: Request, res: Response) => {
  try {
    const _tickets = await db.select().from(tickets)
    return NextResponse.json(
      _tickets,
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: `internal server error` },
      { status: 500 }
    );
  }
};