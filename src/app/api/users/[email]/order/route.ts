import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongoDB";
import User from "@/models/User";
import Product from "@/models/Product";

function extractEmail(url: string) {
  const emailRegex = /\/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\//;
  const match = url.match(emailRegex);
  const emailAddress = match ? match[1] : null;
  return emailAddress;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const email = extractEmail(req.url);
    await connectMongo();
    const result = await User.aggregate([
      {
        $match: {
          email,
        },
      },
      {
        $unwind: {
          path: "$cart",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "cart.productId",
          foreignField: "_id",
          as: "cart.productInfo",
        },
      },
      {
        $unwind: {
          path: "$cart.productInfo",
        },
      },
      {
        $group: {
          _id: "$_id",
          email: { $first: "$email" },
          name: { $first: "$name" },
          image: { $first: "$image" },
          cart: { $push: "$cart" },
          __v: { $first: "$__v" },
        },
      },
    ]);

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "Success", data: result[0].cart });
  } catch (error) {
    console.error("Error in /api/users/[email]/cart (GET): ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const email = extractEmail(req.url);
    const { items } = await req.json();
    await connectMongo();

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error("Product not found");
      product.quantity -= item.quantity;
      await product.save();

      // Remove purchased items from cart
      user.cart = user.cart.filter(
        (cartItem: any) => cartItem.productId.toString() !== item.productId
      );
    }

    await user.save();

    return NextResponse.json({ status: "Success" });
  } catch (error) {
    console.error("Error in /api/users/[email]/cart (POST): ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
