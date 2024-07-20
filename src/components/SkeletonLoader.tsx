/**
 * v0 by Vercel.
 * @see https://v0.dev/t/VKgtfeftKGQ
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Skeleton } from "@/components/ui/skeleton";

export default function Component() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[350px] w-[250px] rounded-xl" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  );
}
