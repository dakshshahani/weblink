'use client'

import React from 'react'
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
} from '@/components/ui/sidebar'
import { Tags, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const accountName = 'daksh'
const tags = [
  'Work',
  'Study',
  'AI',
  'Personal',
  'Ideas',
  'To‑Read',
  'Framework',
  'Library',
  'Language',
  'Database',
]

/**
 * ✅ Correct prop interface
 * The callback just reports a key and its new active state.
 */
export interface SidebarPanelProps {
  children?: React.ReactNode
  onToggleChange?: (key: string, active: boolean) => void
  onSignOut?: () => void
}

export function SidebarPanel({
  children,
  onToggleChange,
  onSignOut,
}: SidebarPanelProps) {
  const [activeKeys, setActiveKeys] = React.useState<string[]>([])

  /** Toggle helper */
  const handleToggle = (key: string) => {
    setActiveKeys((prev) => {
      const isActive = prev.includes(key)
      const newActive = isActive
        ? prev.filter((k) => k !== key)
        : [...prev, key]

      // Notify parent of this toggle state
      onToggleChange?.(key, !isActive)
      return newActive
    })
  }

  return (
    <Sidebar>
      {/* ---- Header ---- */}
      <SidebarHeader>
        <h2 className="font-bold text-lg">NodeBook</h2>
      </SidebarHeader>

      <SidebarSeparator className="m-0" />

      <SidebarContent>
        {/* ---- Tags ---- */}
        <SidebarGroup>
          <SidebarGroupLabel>Tags</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-1">
              {tags.map((tag) => {
                const isActive = activeKeys.includes(tag)
                return (
                  <SidebarMenuItem key={tag}>
                    <SidebarMenuButton
                      asChild
                      onClick={() => handleToggle(tag)}
                      className={cn(
                        'pl-6 text-sm hover:bg-sidebar-accent/30 transition-colors',
                        isActive &&
                          'bg-sidebar-accent/60 text-sidebar-accent-foreground font-medium'
                      )}
                    >
                      <a href={`#tag-${tag.toLowerCase()}`}>
                        <div className="flex items-center gap-2">
                          <Tags
                            className={cn(
                              'h-4 w-4 transition-opacity',
                              isActive ? 'opacity-100' : 'opacity-60'
                            )}
                          />
                          <span>#{tag}</span>
                        </div>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
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
                  const key = 'settings'
                  const isActive = activeKeys.includes(key)
                  return (
                    <SidebarMenuButton
                      onClick={() => handleToggle(key)}
                      className={cn(
                        'flex items-center gap-2 text-sm',
                        isActive &&
                          'bg-sidebar-accent/60 text-sidebar-accent-foreground font-medium'
                      )}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Preferences</span>
                    </SidebarMenuButton>
                  )
                })()}
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
              'flex items-center gap-2 text-xs text-red-500 hover:text-red-600 hover:bg-transparent px-0'
            )}
            onClick={onSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}