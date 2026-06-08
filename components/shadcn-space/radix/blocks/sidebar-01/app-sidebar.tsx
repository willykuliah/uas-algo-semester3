"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/logo/logo";
import {
  NavItem,
  NavMain,
} from "@/components/shadcn-space/radix/blocks/sidebar-01/nav-main";
import {
  AlignStartVertical,
  PieChart,
  CircleUserRound,
  ClipboardList,
  Notebook,
  NotepadText,
  Table,
  Languages,
  Ticket,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export const navData: NavItem[] = [
  {
    title: "INI SIDEBAR",
    icon: Languages,
    children: [{ title: " ISI SIDEBAR ", href: "#" }],
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="px-0 h-full [&_[data-slot=sidebar-inner]]:h-full">
      <div className="flex flex-col gap-6 h-full">
        {/* Header */}
        <SidebarHeader className="px-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <a href="#" className="w-full h-full">
                <Logo />
              </a>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Content */}
        <SidebarContent className="overflow-hidden">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="px-4">
              <NavMain items={navData} />
            </div>
          </ScrollArea>
        </SidebarContent>

        {/* Footer with ThemeSwitcher */}
        <SidebarFooter className="px-4 pb-4 mt-auto">
          <ThemeSwitcher />
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
