import React from "react";
import { Card } from "./ui/card";

function Collection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 ">
      <Card className="grid gap-4">
        <img
          src="/static/images/cardigan.png"
          width={200}
          height={200}
          alt="Collection 1"
          className="aspect-square w-full overflow-hidden rounded-lg object-cover"
        />
      </Card>
      <Card className="grid gap-4 items-center text-center p-5 md:p-24">
        <div className="space-y-2">
          <p className="text-muted-foreground text-xl md:text-2xl font-normal">
            Featuring <span className="font-semibold">cozy</span> and{" "}
            <span className="font-semibold">stylish </span>
            pieces crafted from{" "}
            <span className="font-semibold"> soft, high-quality materials</span>
            .
          </p>
        </div>
      </Card>

      <Card className="grid gap-4 items-center text-center p-5 md:p-24">
        <div className="space-y-2">
          <p className="text-muted-foreground text-xl md:text-2xl font-normal">
            Perfect for <span className="font-bold">all-day wear</span>, this
            collection ensures you stay{" "}
            <span className="font-bold">comfortable</span> no matter the
            occasion.
          </p>
        </div>
      </Card>
      <Card className="grid gap-4">
        <img
          src="/static/images/puffer.png"
          width={200}
          height={200}
          alt="Collection 2"
          className="aspect-square w-full overflow-hidden rounded-lg object-cover"
        />
      </Card>
    </div>
  );
}

export default Collection;
