"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { ProductType } from "@/types/Product";
import Link from "next/link";
import Loading from "@/components/Loading";
import notify from "@/utils/notify";

const loadProducts = async () => {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("unable to fetch products ");
  return (await res.json().then((res) => res.data)) as ProductType[];
};

export default function Component() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<ProductType[]>([]);

  const addProductToCart = useCallback(
    async (productId: string) => {
      try {
        await fetch(`/api/users/${session?.user?.email}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            quantity: 1,
          }),
        });
        notify("Success", `Product added to cart`);
      } catch (error) {
        notify("Error", `Cannot load products`);
      }
    },
    [session]
  );

  useEffect(() => {
    loadProducts()
      .then(setProducts)
      .catch((e) => notify("Error", `Cannot load products`));
  }, []);

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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product._id}>
                <td>
                  <Link href={`/products/${product._id}`}>{product.name}</Link>
                </td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => addProductToCart(product._id)}
                  >
                    Add To Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <Link href="/">Home</Link>
        <br />
        <Link href="/cart">Cart</Link>
        <br />
        Signed in as {session?.user?.email}
        <br />
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
