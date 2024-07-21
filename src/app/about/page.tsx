"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Login } from "@/components/component/login";
import Loading from "@/components/Loading";

const page = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  if (session) {
    return (
      <>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 text-center md:text-left md:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  About No Name.
                </h2>
                <div className="mt-4" />
                <p className=" max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  No Name is a contemporary clothing brand dedicated to merging
                  simplicity with unparalleled comfort. Our focus is on creating
                  timeless, high-quality pieces crafted from premium materials
                  that offer both style and ease. We prioritize comfort in every
                  design, ensuring that each garment feels as good as it looks.
                  With No Brand, you can enjoy a wardrobe that not only enhances
                  your personal style but also delivers day-long comfort,
                  allowing you to move through life with confidence and ease.
                </p>
              </div>
              <img
                src="/static/images/about.png"
                alt="clothingrack"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
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
};

export default page;
