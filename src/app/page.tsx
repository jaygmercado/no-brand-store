"use client";
import { useSession } from "next-auth/react";
import { Login } from "@/components/component/login";
import Loading from "@/components/Loading";
import Hero from "@/components/Hero";

import Image from "next/image";

export default function Component() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  if (session) {
    return (
      <>
        <Hero />
        <section className="container">
          <h1 className="text-center font-bold text-4xl py-16 tracking-tight">
            Featured.
          </h1>
        </section>

        <section className="container w-full pt-12 md:pt-24 lg:pt-32">
          <div className="px-4 md:px-6 mt-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl py-8">
              Embrace Comfort, Elevate Style
            </h2>
          </div>
          <div className="container">
            <Image
              src="/static/images/cover3.png"
              width={1270}
              height={600}
              alt="Sustainability"
              className="mx-auto aspect-[21/9] overflow-hidden rounded-t-xl object-cover"
            />
          </div>
        </section>
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
