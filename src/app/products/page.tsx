"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { ProductType } from "@/types/Product";

const loadProducts = async () => {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("unable to fetch products ");

  return (await res.json().then((res) => res.data)) as ProductType[];
};

export default function Component() {
  const { data: session } = useSession();

  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    loadProducts()
      .then(setProducts)
      .catch((e) => console.error("Error", e.message));
  }, []);

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
            {products?.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
