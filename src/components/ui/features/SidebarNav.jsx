"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { userNavRoutes } from "@/config/userNavRoutes";
import { useState } from "react";
import { assets } from "@/assets/assets";
import { APP_NAME } from "@/config/constantsApp";

export default function SidebarNav() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen border-r bg-white shadow-sm transition-all duration-300",
        collapsed ? "w-16" : "w-56"
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        {!collapsed && (
          <Link className="flex items-center gap-2" href="/">
            <img src={assets.logo} alt="MealPixie Logo" className="h-10 w-10" />
            <span className="font-bold text-orange-500 text-xl">
              {APP_NAME}
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu className="w-5 h-5 text-orange-500" />
        </Button>
      </div>

      <nav className="flex flex-col mt-4 gap-1">
        {userNavRoutes.map(({ id, label, icon: Icon, href }) => {
          const isActive = pathname === href;
          return (
            <Link key={id} href={href} className="w-full">
              <Button
                variant="ghost"
                className={cn(
                  `flex items-center gap-3 w-full rounded-none text-muted-foreground px-4 py-2 transition-all hover:text-orange-500 hover:bg-orange-100/50 ${
                    collapsed ? "justify-center" : "justify-start"
                  }`,
                  isActive && "text-orange-500 bg-orange-100"
                )}
              >
                <Icon className="w-5 h-5" />
                {!collapsed && <span className="font-medium">{label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
