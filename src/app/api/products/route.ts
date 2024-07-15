import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongo from "@/lib/mongoDB";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    const products = await Product.find();
    return NextResponse.json({ status: "Success", data: products });
  } catch (error) {
    console.error("Error in /api/products (GET): ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, author } = body;
    await connectMongo();
    const newProduct = await Product.create({ content, author });
    return NextResponse.json({ status: "Success", data: newProduct });
  } catch (error) {
    console.error("Error in /api/posts (POST): ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
