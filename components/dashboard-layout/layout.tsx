"use client"

import type { ReactNode } from "react"
import Sidebar from "@/components/dashboard-layout/sidebar"
import TopNav from "@/components/dashboard-layout/top-nav"
import { useEffect, useState } from "react"

interface LayoutProps {
  children: ReactNode
}

interface CustomWindow extends Window {
    menuState?: "full" | "collapsed" | "hidden";
    isHovered?: boolean;
    isMobile?: boolean;
}

declare const window: CustomWindow;

export default function Layout({ children }: LayoutProps) {
  const [mounted, setMounted] = useState(false)
  const [menuState, setMenuState] = useState<"full" | "collapsed" | "hidden">("full")
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const checkState = () => {
      if (typeof window !== "undefined") {
        if (window.menuState) {
          setMenuState(window.menuState)
        }
        if (window.isHovered !== undefined) {
          setIsHovered(window.isHovered)
        }
        if (window.isMobile !== undefined) {
          setIsMobile(window.isMobile)
        }
      }
    }

    const interval = setInterval(checkState, 50)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return null
  }

  const getMarginLeft = () => {
    if (isMobile) { return "0" }
    if (menuState === "hidden") { return "0" }
    if (menuState === "collapsed" && isHovered) { return "16rem" }
    if (menuState === "collapsed") { return "4rem" }
    return "16rem"
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div
        className="w-full flex flex-1 flex-col transition-all duration-300 ease-in-out min-w-0"
        style={{ marginLeft: getMarginLeft() }}
      >
        <header className="h-16 border-b flex-shrink-0 bg-card/80 backdrop-blur-lg sticky top-0 z-40">
          <TopNav />
        </header>
        {/* --- ĐÃ SỬA: Bỏ viền và trả lại nền xám nhạt mặc định --- */}
        <main className="flex-1 overflow-auto bg-secondary/40 min-w-0">{children}</main>
      </div>
    </div>
  )
}