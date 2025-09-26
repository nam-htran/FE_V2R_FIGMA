import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Home, 
  FolderOpen, 
  History, 
  Users, 
  HelpCircle,
  Menu,
  X
} from "lucide-react";

export default function Navigation() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationItems = [
    { icon: Home, label: "Dashboard", active: false },
    { icon: FolderOpen, label: "Workspace", active: true },
    { icon: History, label: "Lịch sử", active: false },
    { icon: Users, label: "Cộng đồng", active: false },
  ];

  const supportItems = [
    { icon: Bell, label: "Thông báo" },
    { icon: Settings, label: "Cài đặt" },
    { icon: HelpCircle, label: "Trợ giúp" },
  ];

  return (
    <>
      {/* Top Navigation */}
      <nav className="h-16 border-b border-card-border glass-card flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* Menu Toggle */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="glass"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Dashboard</span>
            <span className="text-muted-foreground">›</span>
            <span className="font-medium">Workspace</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Tìm kiếm..." 
              className="pl-10 w-64 glass"
            />
            <Badge variant="secondary" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs">
              ⌘K
            </Badge>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="glass relative">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-accent"></Badge>
            </Button>
            
            <Button variant="ghost" size="sm" className="glass">
              <Settings className="w-4 h-4" />
            </Button>

            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 glass-card border-r border-card-border transition-transform duration-300 z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 space-y-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">V3D</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">Vision3D</h1>
              <p className="text-xs text-muted-foreground">3D Model Generator</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <div className="space-y-2">
              {navigationItems.map((item, index) => (
                <Button
                  key={index}
                  variant={item.active ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    item.active 
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-glow" 
                      : "glass hover:glass"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              ))}
            </div>

            {/* Support Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground px-2">HỖ TRỢ</h3>
              {supportItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start gap-3 glass hover:glass"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}