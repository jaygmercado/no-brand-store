"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ProductType } from "@/types/Product";
import notify from "@/utils/notify";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Login } from "@/components/component/login";
import Loading from "@/components/Loading";

const loadProduct = async (id: string) => {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error("unable to fetch products ");
  return (await res.json().then((res) => res.data)) as ProductType;
};

export default function Component() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const id = pathname.split("/")[2];
  const [product, setProduct] = useState<ProductType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const addProductToCart = useCallback(async () => {
    try {
      await fetch(`/api/users/${session?.user?.email}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product?._id,
          quantity,
        }),
      });
      notify("Success", `Product added to cart`);
    } catch (error) {
      notify("Error", `Cannot load products`);
    }
  }, [session, product, quantity]);

  useEffect(() => {
    loadProduct(id)
      .then(setProduct)
      .catch((e) => console.error("Error", e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (status === "loading") return <Loading />;

  if (session) {
    return (
      <>
        {/* Breadcrumb */}
        <div className="container mx-auto mt-5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/products">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbLink href="#" key={product?._id}>
                {product?.name}
              </BreadcrumbLink>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {/* EndBreadcrumb */}
        {loading ? (
          <Loading />
        ) : (
          <div
            className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6"
            key={product?._id}
          >
            <div className="grid gap-4 md:gap-8">
              <div className="grid gap-4">
                <img
                  src={product?.image}
                  alt="Product Image"
                  width={600}
                  height={600}
                  className="aspect-square object-cover border w-full rounded-lg overflow-hidden"
                />
              </div>
            </div>
            <div className="grid gap-4 md:gap-10 items-start">
              <div className="grid gap-4">
                <h1 className="font-bold text-3xl lg:text-4xl">
                  {product?.name}
                </h1>
                <div>
                  <p>{product?.description}</p>
                </div>
                <div className="text-4xl font-bold">PHP{product?.price}.00</div>
              </div>
              <form className="grid gap-4 md:gap-10">
                <div className="grid gap-2">
                  <Label htmlFor="quantity" className="text-base">
                    Quantity
                  </Label>
                  <Input
                    type="number"
                    id="quantity"
                    defaultValue="1"
                    className="w-16 text-center"
                    max={product?.quantity}
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(+e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => addProductToCart()}
                  disabled={
                    quantity > (product?.quantity || 0) || quantity <= 0
                  }
                  size="lg"
                >
                  Add to cart
                </Button>
              </form>
            </div>
          </div>
        )}
        {/* <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr key={product?._id}>
              <td>{product?.name}</td>
              <td>{product?.description}</td>
              <td>{product?.price}</td>
              <td>{product?.quantity}</td>
            </tr>
          </tbody>
        </table>
        <form>
          quantity:
          <input
            type="number"
            name="quantity"
            id="quantity"
            max={product?.quantity}
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(+e.target.value)}
          />
          <button
            type="button"
            onClick={() => addProductToCart()}
            disabled={quantity > (product?.quantity || 0) || quantity <= 0}
          >
            Add to cart
          </button>
        </form>
        <br />
        <Link href="/">Home</Link>
        <br />
        <Link href="/products">Products</Link>
        <br />
        <Link href="/cart">Cart</Link>
        <br />
        Signed in as {session?.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button> */}
      </>
    );
  }

  return (
    <div className="flex justify-center content-center h-screen">
      <div className="my-auto ">
        <Login />
      </div>
    </div>
  );
}
