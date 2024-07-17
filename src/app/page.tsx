"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Loading from "@/components/Loading";

export default function Component() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  if (session) {
    return (
      <>
        Signed in as {session?.user?.email}
        <br />
        <Link href="/products">Products</Link>
        <br />
        <Link href="/cart">Cart</Link>
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
