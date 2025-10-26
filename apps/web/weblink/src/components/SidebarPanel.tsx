"use client";

import React from "react";
import type { ToggleKey } from "@/app/dashboard/page";
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
} from "@/components/ui/sidebar";
import { Tags, Settings, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const accountName = "daksh";

export interface SidebarPanelProps {
  availableTags?: string[]; // ✅ dynamically passed tags
  children?: React.ReactNode;
  onToggleChange?: (key: ToggleKey, active: boolean) => void;
  onSignOut?: () => void;
}

export function SidebarPanel({
  availableTags = [],
  children,
  onToggleChange,
  onSignOut,
}: SidebarPanelProps) {
  const [activeKeys, setActiveKeys] = React.useState<string[]>([]);
  const [hoveredTag, setHoveredTag] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);
  const [tags, setTags] = React.useState<string[]>(availableTags);

  // keep tags in sync when availableTags changes from parent (e.g. after fetch)
  React.useEffect(() => {
    setTags(availableTags);
  }, [availableTags]);

  /** Toggle logic */
  const handleToggle = (key: string) => {
    setActiveKeys((prev) => {
      const isActive = prev.includes(key);
      const nextActive = isActive
        ? prev.filter((k) => k !== key)
        : [...prev, key];

      onToggleChange?.(key as ToggleKey, !isActive);
      return nextActive;
    });
  };

  /** Delete tag after confirmation */
  const confirmDelete = () => {
    if (!deleteTarget) return;
    setTags((prev) => prev.filter((t) => t !== deleteTarget));
    setDeleteTarget(null);
    if (activeKeys.includes(deleteTarget)) {
      setActiveKeys((prev) => prev.filter((k) => k !== deleteTarget));
    }
  };

  return (
    <>
      <Sidebar className="border-none">
        {/* ---- Header ---- */}
        <SidebarHeader>
          <h2 className="p-3 font-bold text-lg">NodeBook</h2>
        </SidebarHeader>

        <SidebarContent>
          {/* ---- Tags ---- */}
          <SidebarGroup>
            <SidebarGroupLabel>Tags</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="mt-1">
                {tags.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">
                    No tags found
                  </p>
                ) : (
                  tags.map((tag) => {
                    const isActive = activeKeys.includes(tag);
                    return (
                      <SidebarMenuItem
                        key={tag}
                        className="relative group"
                        onMouseEnter={() => setHoveredTag(tag)}
                        onMouseLeave={() => setHoveredTag(null)}
                      >
                        <SidebarMenuButton
                          asChild
                          onClick={() => handleToggle(tag)}
                          className={cn(
                            "pl-6 text-sm hover:bg-sidebar-accent/30 transition-colors pr-8",
                            isActive &&
                              "bg-sidebar-accent/60 text-sidebar-accent-foreground font-medium"
                          )}
                        >
                          <a href={`#tag-${tag.toLowerCase()}`}>
                            <div className="flex items-center gap-2">
                              <Tags
                                className={cn(
                                  "h-4 w-4 transition-opacity",
                                  isActive ? "opacity-100" : "opacity-60"
                                )}
                              />
                              <span>#{tag}</span>
                            </div>
                          </a>
                        </SidebarMenuButton>

                        {/* ❌ Delete Icon on hover */}
                        {hoveredTag === tag && (
                          <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setDeleteTarget(tag);
                            }}
                          >
                            <X className="h-4 w-4 text-red-500 hover:text-red-600" />
                          </button>
                        )}
                      </SidebarMenuItem>
                    );
                  })
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* ---- Settings ---- */}
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  {(() => {
                    const key = "settings";
                    const isActive = activeKeys.includes(key);
                    return (
                      <SidebarMenuButton
                        onClick={() => handleToggle(key)}
                        className={cn(
                          "flex items-center gap-2 text-sm",
                          isActive &&
                            "bg-sidebar-accent/60 text-sidebar-accent-foreground font-medium"
                        )}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Preferences</span>
                      </SidebarMenuButton>
                    );
                  })()}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* ---- Footer ---- */}
        <SidebarFooter className="p-3">
          <div className="flex text-xs items-center justify-between text-sidebar-foreground/70">
            <span>
              Weblink {new Date().getFullYear()} &nbsp;–&nbsp; {accountName}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-red-500 hover:text-red-600 hover:bg-transparent p-0 m-0"
              )}
              onClick={onSignOut}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* ---- Delete Confirmation Dialog ---- */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete “{deleteTarget}”? This action
              cannot be undone. Your notes will NOT be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
              className="text-gray-500"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}