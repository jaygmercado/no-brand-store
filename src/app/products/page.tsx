"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { ProductType } from "@/types/Product";
import Link from "next/link";
import Loading from "@/components/Loading";
import notify from "@/utils/notify";
import { JSX, SVGProps } from "react";
import { Login } from "@/components/component/login";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import SkeletonLoader from "@/components/SkeletonLoader";

const loadProducts = async () => {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("unable to fetch products ");
  return (await res.json().then((res) => res.data)) as ProductType[];
};

export default function Component() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

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
      .catch((e) => notify("Error", `Cannot load products`))
      .finally(() => setLoading(false));
  }, []);

  if (status === "loading") return <Loading />;

  if (session) {
    return (
      <div className="md:container">
        <h1 className="text-4xl font-bold mt-6 ml-4">Products</h1>
        <div className="mt-2 ml-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Products</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="bg-background">
          <main className="mx-auto py-8 px-4 md:px-6">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <SkeletonLoader />
                <SkeletonLoader />
                <SkeletonLoader />
                <SkeletonLoader />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="rounded bg-card transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:border"
                  >
                    <Link href={`/products/${product._id}`} prefetch={false}>
                      <Image
                        src={product.image || ""}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="h-96 w-full object-cover rounded-t"
                      />
                    </Link>
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="text-md font-semibold">
                          {product.name}
                        </h3>
                        <p className="text-zinc-500 text-sm">
                          PHP{product.price.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="w-full"
                          disabled={product.quantity <= 0}
                          onClick={() => addProductToCart(product._id)}
                        >
                          <ShoppingBagIcon className="h-4 w-4" />
                          <span className="sr-only">Add to cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
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

function ShoppingBagIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-shopping-bag text-zinc-600 hover:text-zinc-900"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
