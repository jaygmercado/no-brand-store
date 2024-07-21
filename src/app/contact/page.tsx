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
        <section className=" py-12 md:py-16 lg:py-20">
          <div className="container max-w-4xl px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Get in Touch
                </h2>
                <p className="text-zinc-700 md:text-lg">
                  Have a question or want to work together? We'd love to hear
                  from you.
                </p>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <h3 className="text-lg font-semibold">Address</h3>
                  <div className="flex items-center gap-2 text-zinc-700">
                    <MapPinIcon className="h-5 w-5" />
                    <p>DBB-B, 4115 West Ave, Dasmariñas, Cavite</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <h3 className="text-lg font-semibold">Phone</h3>
                  <div className="flex items-center gap-2 text-zinc-700">
                    <PhoneIcon className="h-5 w-5" />
                    <p> (046) 416 4531</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <h3 className="text-lg font-semibold">Email</h3>
                  <div className="flex items-center gap-2 text-zinc-700">
                    <MailIcon className="h-5 w-5" />
                    <p>nonameclothing@gmail.com</p>
                  </div>
                </div>
              </div>
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

function MailIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function MapPinIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
