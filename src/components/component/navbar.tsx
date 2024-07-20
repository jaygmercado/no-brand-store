import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut, signIn } from "next-auth/react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { JSX, SVGProps } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  if (session) {
    return (
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 border-b ">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden mr-3">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link href="#" prefetch={false}>
              <SheetClose asChild>
                <Image
                  src="/static/images/noname.svg"
                  height={40}
                  width={70}
                  alt="logo"
                />
              </SheetClose>
            </Link>
            <div className="grid gap-2 py-6">
              <SheetClose asChild>
                <Link
                  href="/"
                  className="flex w-full items-center py-2 text-lg font-semibold"
                  prefetch={false}
                >
                  Home
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/products"
                  className="flex w-full items-center py-2 text-lg font-semibold"
                  prefetch={false}
                >
                  Products
                </Link>
              </SheetClose>
              <Link
                href="#"
                className="flex w-full items-center py-2 text-lg font-semibold"
                prefetch={false}
              >
                About
              </Link>
              <Link
                href="#"
                className="flex w-full items-center py-2 text-lg font-semibold"
                prefetch={false}
              >
                Contact
              </Link>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex justify-between w-full">
          <div className="flex flex-row w-full justify-between items-center">
            <Link href="/" className="mr-6" prefetch={false}>
              <Image
                src="/static/images/noname.svg"
                height={40}
                width={70}
                alt="logo"
              />
            </Link>

            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuLink asChild>
                  <Link
                    href="/"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-md font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    prefetch={false}
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="/products"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-md font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    prefetch={false}
                  >
                    Products
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="#"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-md font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    prefetch={false}
                  >
                    About
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="#"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-md font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    prefetch={false}
                  >
                    Contact
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuList>
            </NavigationMenu>
            <div className="flex flex-row items-center justify-between">
              <Link href="/cart" className="m-4 ">
                <BagIcon />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="ring-0">
                  <Avatar className="h-10 w-10 overflow-hidden hover:ring-2 ring-zinc-700 ">
                    <AvatarImage src={session?.user?.image ?? ""} />
                    <AvatarFallback>NN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <span className="font-semibold">{session?.user?.name}</span>
                    <p className="text-xs text-gray-500">
                      {" "}
                      {session?.user?.email}
                    </p>{" "}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

function LogOutIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function BagIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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

function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
