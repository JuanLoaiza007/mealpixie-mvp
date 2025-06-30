"use client";
import MobileNav from "@/components/ui/features/MobileNav";
import SidebarNav from "@/components/ui/features/SidebarNav";
import { ImageProvider } from "@/context/image";
import { MobileTopBarProvider } from "@/context/mobileTopBar";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <MobileTopBarProvider>
        <SidebarNav />
        <main className="flex-1 h-screen max-h-screen overflow-auto px-3 pt-4 pb-16 md:pb-16 bg-slate-100">
          <ImageProvider>{children}</ImageProvider>
        </main>
        <MobileNav />
      </MobileTopBarProvider>
    </div>
  );
}
