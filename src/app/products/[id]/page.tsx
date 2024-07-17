"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ProductType } from "@/types/Product";
import Loading from "@/components/Loading";
import notify from "@/utils/notify";

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
      notify("Error", `Cannot load products`)
    }
  }, [session, product, quantity]);

  useEffect(() => {
    loadProduct(id)
      .then(setProduct)
      .catch((e) => console.error("Error", e.message));
  }, [id]);

  if (status === "loading") return <Loading />;

  if (session) {
    return (
      <>
        <table>
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
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
