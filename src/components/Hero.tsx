import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Hero() {
  return (
    <>
      <div className="w-full mx-auto">
        <div className="relative overflow-hidden pt-60 lg:pt-72 bg-[url('/static/images/hero1.png')] bg-cover bg-top">
          <div className="relative z-10">
            <div className="py-10 lg:py-16 mx-auto">
              <div className="mx-5 lg:mx-auto max-w-2xl md:max-w-6xl text-start">
                <p className="text-zinc-100 drop-shadow">NEW COLLECTION</p>
                <div className="mt-5 max-w-2xl">
                  <h1 className="text-white scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl drop-shadow">
                    Essential Comfort.
                  </h1>
                </div>
                <div className="mt-5 max-w-2xl">
                  <p className="text-lg text-zinc-100 drop-shadow">
                    Discover the perfect blend of simplicity and coziness with
                    our Essential Comfort collection.
                  </p>
                </div>
                <div className="mt-5 gap-3 flex justify-start">
                  <Link href="/products">
                    <Button size={"lg"} variant={"outline"}>
                      Shop Now
                    </Button>
                  </Link>
                </div>
                {/* End Buttons */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
