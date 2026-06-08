import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/shadcn-space/radix/blocks/sidebar-01/app-sidebar";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

const Page = () => {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        {/* ---------------- Main ---------------- */}
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-50 flex h-14 items-center border-b px-4">
            <SidebarTrigger className="cursor-pointer" />
          </header>

          <main className="flex-1 p-4" />
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default Page;
