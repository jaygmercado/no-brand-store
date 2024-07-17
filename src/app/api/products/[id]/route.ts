import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongoDB";
import Product from "@/models/Product";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongo();
    const product = await Product.findOne({ _id: params.id });
    return NextResponse.json({ status: "Success", data: product });
  } catch (error) {
    console.error("Error in /api/posts/[id] (GET): ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
