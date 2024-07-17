import { NextRequest, NextResponse } from "next/server";
import { Schema } from "mongoose";
import connectMongo from "@/lib/mongoDB";
import User from "@/models/User";

function extractEmail(url: string) {
  const emailRegex = /\/api\/users\/([^\/]+)\/cart/;
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

    return NextResponse.json({
      status: "Success",
      data: result[0]?.cart || [],
    });
  } catch (error) {
    console.error("Error in /api/users/[email]/cart (GET): ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const email = extractEmail(req.url);
    const { productId, quantity } = await req.json();
    await connectMongo();

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const productIndex = user.cart.findIndex(
      (item: { productId: Schema.Types.ObjectId }) =>
        item.productId.toString() === productId
    );

    if (productIndex > -1) {
      // Product exists, increment quantity
      user.cart[productIndex].quantity += +quantity;
    } else {
      // Product does not exist, push new product into cart
      user.cart.push({ productId, quantity });
    }

    const updatedUser = await user.save();

    return NextResponse.json({ status: "Success", cart: updatedUser.cart });
  } catch (error) {
    console.error("Error in /api/users/[email]/cart (POST): ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const email = extractEmail(req.url);
    const { productId, newQuantity } = await req.json();
    await connectMongo();

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const productIndex = user.cart.findIndex(
      (item: { productId: Schema.Types.ObjectId }) =>
        item.productId.toString() === productId
    );
    user.cart[productIndex].quantity = newQuantity;
    const updatedUser = await user.save();

    return NextResponse.json({ status: "Success", cart: updatedUser.cart });
  } catch (error) {
    console.error("Error in /api/users/[email]/cart (POST): ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const email = extractEmail(req.url);
    const { productId } = await req.json();
    await connectMongo();

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    user.cart = user.cart.filter(
      (item: any) => item.productId.toString() !== productId
    );

    await user.save();

    return NextResponse.json({ status: "Success" });
  } catch (error) {
    console.error("Error in /api/users/[email]/cart (DELETE): ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
