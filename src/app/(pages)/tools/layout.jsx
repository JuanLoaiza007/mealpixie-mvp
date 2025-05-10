import MobileNav from "@/components/ui/features/MobileNav";
import SidebarNav from "@/components/ui/features/SidebarNav";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <SidebarNav />
      <main className="flex-1 h-screen max-h-screen overflow-auto px-2 pt-12 md:pt-4 pb-16 md:pb-16 bg-slate-100">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
