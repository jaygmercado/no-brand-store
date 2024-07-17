"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Loading from "@/components/Loading";
import { CartItem } from "@/types/User";
import notify from "@/utils/notify";

const loadCart = async (email: string) => {
  if (!email) return [];
  const res = await fetch(`/api/users/${email}/cart`);
  if (!res.ok) throw new Error("unable to fetch cart");
  return (await res.json().then((res) => res.data)) as CartItem[];
};

export default function Component() {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [items, setItems] = useState<CartItem[]>([]);

  const removeItemFromCart = useCallback(
    async (productId: string) => {
      try {
        await fetch(`/api/users/${session?.user?.email}/cart`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
          }),
        });
        setCart((state) =>
          state.filter((item) => item.productId !== productId)
        );
        notify("Success", `Product removed from cart`);
      } catch (error) {
        notify("Error", `Cannot load products`);
      }
    },
    [session?.user?.email]
  );

  const updateItemQuantity = useCallback(
    async (productId: string, newQuantity: string) => {
      try {
        if (+newQuantity === 0) return removeItemFromCart(productId);
        await fetch(`/api/users/${session?.user?.email}/cart`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            newQuantity,
          }),
        });
        setCart((state) => {
          return state.map((item) => {
            if (item.productId === productId) {
              item.quantity = +newQuantity;
            }
            return item;
          });
        });
        notify("Success", `Quantity updated`);
      } catch (error) {
        notify("Error", `Cannot load products`);
      }
    },
    [removeItemFromCart, session?.user?.email]
  );

  const purchase = useCallback(async () => {
    try {
      await fetch(`/api/users/${session?.user?.email}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
        }),
      });
      setCart((state) => {
        return state.filter(
          (item) => !items.find((i) => i?.productId === item?.productId)
        );
      });
      notify("Success", `Quantity updated`);
    } catch (error) {
      notify("Error", `Cannot load products`);
    }
  }, [items, session?.user?.email]);

  useEffect(() => {
    loadCart(session?.user?.email || "")
      .then(setCart)
      .catch((e) => console.error("Error", e.message));
  }, [session?.user?.email]);

  if (status === "loading") return <Loading />;

  if (session) {
    return (
      <>
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.length === 0 && (
              <tr>
                <td colSpan={6}>No items in cart</td>
              </tr>
            )}
            {cart?.map((cartItem: any) => (
              <tr key={cartItem?.productId}>
                <td>
                  <input
                    type="checkbox"
                    checked={
                      !!items.find(
                        (item) => item?.productId === cartItem?.productId
                      )
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setItems((items) => [...items, cartItem]);
                      } else {
                        setItems(
                          items.filter(
                            (item) => item?.productId !== cartItem?.productId
                          )
                        );
                      }
                    }}
                  />
                </td>
                <td>
                  <Link href={`/products/${cartItem.productId}`}>
                    {cartItem?.productInfo?.name}
                  </Link>
                </td>
                <td>{cartItem?.productInfo?.description}</td>
                <td>{cartItem?.productInfo?.price?.toString()}</td>
                <td>
                  <input
                    type="number"
                    value={cartItem?.quantity}
                    max={cartItem?.productInfo?.quantity}
                    onChange={(e) => {
                      if (+e.target.value > cartItem?.productInfo?.quantity)
                        notify("Error", "Quantity exceeds stock");
                      else
                        updateItemQuantity(cartItem?.productId, e.target.value);
                    }}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    disabled={cartItem?.quantity <= 0}
                    onClick={() => removeItemFromCart(cartItem?.productId)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          disabled={items.length <= 0}
          onClick={() => purchase()}
        >
          Purchase
        </button>
        <br />
        <Link href="/">Home</Link>
        <br />
        <Link href="/products">Products</Link>
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
