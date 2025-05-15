"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { userNavRoutes } from "@/config/userNavRoutes";

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t z-50 flex justify-around pt-2 pb-1 md:hidden shadow-md">
      {userNavRoutes
        .filter((route) => route.tags.includes("functionality"))
        .map(({ id, label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={id} href={href} className="flex flex-col items-center">
              <Button
                variant="ghost"
                className={cn(
                  "flex flex-col items-center text-muted-foreground transition-colors hover:text-orange-500 hover:bg-orange-100/50 gap-1",
                  isActive && "text-orange-500"
                )}
              >
                <Icon className="[&_svg]:size-1 w-4 h-4" />
                <span className="text-xs font-medium">{label}</span>
              </Button>
            </Link>
          );
        })}
    </nav>
  );
}
