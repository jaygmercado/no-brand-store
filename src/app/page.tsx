"use client";

import { useSession } from "next-auth/react";
import { Login } from "@/components/component/login";
import Loading from "@/components/Loading";
import Hero from "@/components/Hero";

export default function Component() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  if (session) {
    return (
      <>
        <Hero />
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
