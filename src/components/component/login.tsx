import React, { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

export function Login() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn();
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="w-full max-w-md bg-slate-50">
      <CardHeader>
        <Image
          src="/static/images/noname.svg"
          height={50}
          width={80}
          alt="logo"
          className="py-4"
        />
        <CardTitle className="text-2xl">You are not signed in</CardTitle>
        <CardDescription>Plesae login to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <Button className="w-full" onClick={handleSignIn} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
