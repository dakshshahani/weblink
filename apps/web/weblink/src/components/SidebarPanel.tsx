"use client"

import React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarProvider,
} from "@/components/ui/sidebar"

import {
  Link2,
  Tags,
  Settings,
  ChevronDown,
  ChevronUp,
  LogOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Dummy user + tags data (replace with real ones later)
const accountName = "daksh"
const tags = ["Work", "Study", "AI", "Personal", "Ideas", "To‑Read"]

export function SidebarPanel() {
  const [tagsOpen, setTagsOpen] = React.useState(false)

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full relative">
        <Sidebar className="bg-sidebar text-sidebar-foreground border-r border-border">
          {/* ---- Header ---- */}
          <SidebarHeader className="flex items-center justify-between px-4 py-3">
            <h2 className="font-semibold text-lg">NodeBook</h2>
          </SidebarHeader>

          <SidebarSeparator />

          {/* ---- Sidebar content ---- */}
          <SidebarContent>
            {/* Main navigation */}

            {/* Tags dropdown */}
            <SidebarGroup>
              <SidebarGroupLabel>Tags</SidebarGroupLabel>
              <SidebarGroupContent>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTagsOpen((o) => !o)}
                  className="flex w-full items-center justify-between px-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <div className="flex items-center gap-2">
                    <Tags className="h-4 w-4" />
                    <span>My Tags</span>
                  </div>
                  {tagsOpen ? (
                    <ChevronUp className="h-3 w-3 opacity-70" />
                  ) : (
                    <ChevronDown className="h-3 w-3 opacity-70" />
                  )}
                </Button>

                {tagsOpen && (
                  <SidebarMenu className="mt-1">
                    {tags.map((tag) => (
                      <SidebarMenuItem key={tag}>
                        <SidebarMenuButton
                          asChild
                          className="pl-6 text-sm hover:bg-sidebar-accent/30"
                        >
                          <a href={`#tag-${tag.toLowerCase()}`}>
                            <span>#{tag}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                )}
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Settings */}
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a
                        href="#settings"
                        className="flex items-center gap-2 text-sm"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Preferences</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* ---- Footer ---- */}
          <SidebarFooter className="border-t border-border p-3 mt-auto">
            <div className="flex flex-col gap-2 text-xs text-sidebar-foreground/70">
              <div className="flex justify-between items-center">
                <span>
                  Weblink {new Date().getFullYear()} &nbsp;–&nbsp; {accountName}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex items-center gap-2 text-xs text-red-500 hover:text-red-600 hover:bg-transparent px-0"
                )}
                onClick={() => alert("Signing out…")}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
      </div>
    </SidebarProvider>
  )
}