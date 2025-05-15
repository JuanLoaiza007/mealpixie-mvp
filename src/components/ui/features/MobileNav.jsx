"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { userNavRoutes } from "@/config/userNavRoutes";
import { useMobileTopBar } from "@/context/mobileTopBar";
import { print_log } from "@/utils/development";

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { title, setTitle } = useMobileTopBar();
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    setTitle(null);
    print_log(`MobileNav: Title reset due to pathname change to: ${pathname}`);
    const actualRoute = userNavRoutes.find((route) => route.href === pathname);
    setShowNav(actualRoute?.tags.includes("functionality"));
  }, [pathname, setTitle]);

  return (
    <>
      {title && (
        <nav className="fixed top-0 bg-white inset-x-0 z-50 border-b flex pt-1 pb-2 md:hidden gap-0">
          <Button
            variant="ghost"
            className="p-0 m-0 h-auto w-auto shadow-none"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5 text-black" />
          </Button>
          <span className="text-lg font-semibold text-black">{title}</span>
        </nav>
      )}
      {showNav && (
        <nav className="fixed bottom-0 bg-white inset-x-0 z-50 border-t flex justify-around pt-2 pb-1 md:hidden">
          {userNavRoutes
            .filter((route) => route.tags.includes("functionality"))
            .map(({ id, label, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={id}
                  href={href}
                  className="flex flex-col items-center"
                >
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
      )}
    </>
  );
}
