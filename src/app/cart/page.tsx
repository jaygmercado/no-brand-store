"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Loading from "@/components/Loading";
import { CartItem } from "@/types/User";
import notify from "@/utils/notify";

import { Login } from "@/components/component/login";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { JSX, SVGProps } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

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
  const [total, setTotal] = useState<number>(0);
  const [isPurchaseSuccessful, setIsPurchaseSuccessful] = useState(false);

  const calculateTotal = useCallback(() => {
    const newTotal = items.reduce(
      (acc, item: any) => acc + Number(item.quantity) * item.productInfo.price,
      0
    );
    setTotal(newTotal);
  }, [items]);

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
        setItems((state) =>
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
        setItems((state) => {
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
      setIsPurchaseSuccessful(true);
      setCart((state) =>
        state.filter(
          (item) => !items.find((i) => i?.productId === item?.productId)
        )
      );
      notify("Success", `Order placed successfully`);
      setItems([]);
    } catch (error) {
      notify("Error", `Cannot place order`);
    }
  }, [items, session?.user?.email]);

  useEffect(() => {
    loadCart(session?.user?.email || "")
      .then(setCart)
      .catch((e) => console.error("Error", e.message));
  }, [session?.user?.email]);

  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

  if (status === "loading") return <Loading />;

  if (session) {
    return (
      <>
        <div className="container mx-auto px-4 md:px-6 py-12 grid gap-8">
          <div className="grid gap-8">
            <div className="grid gap-6">
              <Dialog
                open={isPurchaseSuccessful}
                onOpenChange={(open) => setIsPurchaseSuccessful(open)}
              >
                {cart.length === 0 ? (
                  <div className="col h-screen">
                    <h1 className="font-bold text-4xl mb-2">
                      Your Bag is Empty
                    </h1>
                    <p className="mb-3">
                      Once you add something to your bag - it will appear here.
                      Ready to get started?
                    </p>
                    <Link href="/products">
                      <Button type="button">Shop Now</Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-2">
                      <h1 className="text-4xl font-bold">Your Bag</h1>
                      <p>
                        Review the items in your cart and proceed to checkout.
                      </p>
                    </div>
                    {cart?.map((cartItem: any) => (
                      <div className="col space-y-6" key={cartItem?.productId}>
                        <div className="flex items-center gap-4 border-b pb-4">
                          <input
                            type="checkbox"
                            checked={
                              !!items.find(
                                (item) =>
                                  item?.productId === cartItem?.productId
                              )
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setItems((items) => [...items, cartItem]);
                              } else {
                                setItems(
                                  items.filter(
                                    (item) =>
                                      item?.productId !== cartItem?.productId
                                  )
                                );
                              }
                            }}
                          />
                          <img
                            src={cartItem?.productInfo?.image}
                            alt="Product Image"
                            width={80}
                            height={80}
                            className="rounded-md object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="text-md font-medium">
                              <Link href={`/products/${cartItem.productId}`}>
                                {cartItem?.productInfo?.name}
                              </Link>
                            </h3>
                            <p className="text-zinc-500 text-sm">
                              PHP
                              {cartItem?.productInfo?.price
                                ?.toFixed(2)
                                .toString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={cartItem?.quantity}
                                max={cartItem?.productInfo?.quantity}
                                onChange={(e) => {
                                  if (
                                    +e.target.value >
                                    cartItem?.productInfo?.quantity
                                  ) {
                                    notify("Error", "Quantity exceeds stock");
                                  } else {
                                    updateItemQuantity(
                                      cartItem?.productId,
                                      e.target.value
                                    );
                                  }
                                }}
                                className="w-16"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="p-1"
                                disabled={cartItem?.quantity <= 0}
                                onClick={() =>
                                  removeItemFromCart(cartItem?.productId)
                                }
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="grid md:grid-cols-[1fr_500px] gap-8 items-start">
                      <div />
                      <Card>
                        <CardHeader>
                          <CardTitle>Checkout</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                          <div className="grid gap-4">
                            <div className="grid gap-2">
                              <div className="font-medium">Order Summary</div>
                              <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">
                                    Subtotal
                                  </span>
                                  <span>₱{total.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">
                                    Shipping
                                  </span>
                                  <span>
                                    {total === 0 ? "₱0.00" : "₱250.00"}
                                  </span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between font-medium">
                                  <span>Total</span>
                                  <span>
                                    ₱
                                    {total === 0
                                      ? "0.00"
                                      : (total + 250.0).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Separator />
                            <div className="grid gap-2">
                              <div className="font-medium">
                                Shipping Details
                              </div>
                              <div className="grid gap-2">
                                <div>
                                  <Label htmlFor="name">Name</Label>
                                  <Input
                                    id="name"
                                    placeholder="Enter your name"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="address">Address</Label>
                                  <Textarea
                                    id="address"
                                    placeholder="Enter your address"
                                  />
                                </div>
                              </div>
                            </div>
                            <Separator />
                            <div className="grid gap-2">
                              <div className="font-medium">Payment Details</div>
                              <div className="grid gap-2">
                                <div>
                                  <Label htmlFor="card-number">
                                    Card Number
                                  </Label>
                                  <Input
                                    id="card-number"
                                    placeholder="Enter your card number"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="expiration">
                                      Expiration Date
                                    </Label>
                                    <Input
                                      id="expiration"
                                      placeholder="MM/YY"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="cvv">CVV</Label>
                                    <Input id="cvv" placeholder="CVV" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <DialogTrigger asChild>
                            <Button
                              size="lg"
                              className="w-full"
                              type="button"
                              disabled={items.length === 0}
                              onClick={() => purchase()}
                            >
                              Place Order
                            </Button>
                          </DialogTrigger>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
                <DialogContent className="sm:max-w-[425px]">
                  <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <CircleCheckIcon className="size-12 text-green-500" />
                    <div className="space-y-2 text-center">
                      <h3 className="text-lg font-medium">
                        Order Placed Successfully
                      </h3>
                      <p className="text-muted-foreground">
                        Thank you for your purchase. Your order has been
                        confirmed.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <div>
                      <DialogClose asChild>
                        <Button type="button">Close</Button>
                      </DialogClose>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
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

function TrashIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function CircleCheckIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
